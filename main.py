#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""UniversalStore — один файл для Railway, Python 3.11+.

1. Разместите bot.py в корне репозитория и подключите его к Railway.
2. Build Command: python bot.py --install-deps
3. Start Command: python bot.py
4. Токен бота и администраторы 7184372468, 7787606759 уже указаны в файле.
5. Networking -> Generate Domain. Если домен не определился автоматически,
   задайте PUBLIC_URL=https://ваш-домен (без завершающего /).
6. Подключите Volume с Mount Path /data и задайте DATA_DIR=/data.
7. Одна реплика. Остановите другие процессы, использующие этот токен.
8. Отправьте боту /start со своего аккаунта. /admin откроет админку.

Внутри файла: весь исходный магазин, интерфейс, рефералы, Telegram-бот.
Каталог в архиве пустой. Товары/оплата/доставка настраиваются в админке.
Данные и фото сохраняются отдельно в DATA_DIR; при переходе со старого
сервера перенесите содержимое его data в подключённый Volume.
Токен встроен. При необходимости BOT_TOKEN в Variables переопределяет его.
Не публикуйте этот файл в открытом репозитории: он содержит токен.
Для проверки без Telegram: BOT_DISABLED=1 python bot.py.
"""
import sys
import os
from pathlib import Path
ROOT = Path(__file__).resolve().parent
DEPS = ROOT / '.deps'
sys.path.insert(0, str(DEPS))

def install_dependencies():
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install',
        '--disable-pip-version-check', '--no-cache-dir', '--target', str(DEPS),
        'aiohttp==3.13.5', 'Pillow==12.3.0', 'tzdata==2026.3'])

if __name__ == '__main__' and '--install-deps' in sys.argv:
    install_dependencies()
    raise SystemExit(0)

try:
    import aiohttp
    import PIL
except ImportError:
    if __name__ != '__main__':
        raise
    install_dependencies()
    os.execv(sys.executable, [sys.executable, *sys.argv])

os.environ.setdefault('PUBLIC_URL', 'https://fogdog7-production.up.railway.app')
os.environ.setdefault('BOT_TOKEN', '8513706230:AAHyIxXKTBgn29xeXFEN2WnXP1lW3uBtlf4')
os.environ.setdefault('ADMIN_PASSWORD', 'FogDogAdmin2026!')
os.environ.setdefault('TELEGRAM_ADMIN_IDS', '1284525881')
os.environ.setdefault('ADMIN_CHAT_ID', '1284525881')
os.environ.setdefault('DATA_DIR', os.getenv('RAILWAY_VOLUME_MOUNT_PATH') or str(ROOT / 'data'))
if not os.getenv('PUBLIC_URL') and os.getenv('RAILWAY_PUBLIC_DOMAIN'):
    os.environ['PUBLIC_URL'] = 'https://' + os.environ['RAILWAY_PUBLIC_DOMAIN']

# Встроенные модули. Отдельные .py файлы не требуются.
import types

_referrals_source = '"""Referral accounts and transactional, integer-minor-unit bonus ledger."""\nimport json\nimport re\nimport secrets\nimport sqlite3\nimport time\n\nDEFAULTS = dict(enabled=False, reward_type=\'percent\', reward_percent=5, reward_fixed=500,\n                reward_cap=0, minimum=0, first_only=True, welcome=0,\n                spend_enabled=True, spend_percent=30, combine_promo=True, bot_username=\'\')\n\nclass ReferralError(Exception):\n    def __init__(self, message, status=400):\n        self.message, self.status = message, status\n\n\ndef migrate(db, directory=None):\n    columns = {r[1] for r in db.execute(\'PRAGMA table_info(orders)\')}\n    if \'bonus_spent\' not in columns:\n        if directory is not None and db.execute("SELECT 1 FROM config WHERE key=\'settings\'").fetchone():\n            db.commit()\n            with sqlite3.connect(directory / f\'before-referrals-v4-{time.time_ns()}.sqlite3\') as backup:\n                db.backup(backup)\n        db.execute(\'ALTER TABLE orders ADD COLUMN bonus_spent INTEGER NOT NULL DEFAULT 0\')\n        db.execute("ALTER TABLE orders ADD COLUMN referral_snapshot TEXT NOT NULL DEFAULT \'{}\'")\n    db.executescript(\'\'\'\n    CREATE TABLE IF NOT EXISTS referral_accounts (\n      owner TEXT PRIMARY KEY REFERENCES customers(owner), code TEXT NOT NULL UNIQUE,\n      inviter TEXT REFERENCES referral_accounts(owner), joined INTEGER NOT NULL);\n    CREATE TABLE IF NOT EXISTS bonus_ledger (\n      id INTEGER PRIMARY KEY, owner TEXT NOT NULL REFERENCES referral_accounts(owner),\n      order_id INTEGER NOT NULL REFERENCES orders(id), kind TEXT NOT NULL,\n      amount INTEGER NOT NULL, created INTEGER NOT NULL, UNIQUE(order_id,kind));\n    CREATE INDEX IF NOT EXISTS bonus_owner ON bonus_ledger(owner,id);\n    CREATE INDEX IF NOT EXISTS referral_inviter ON referral_accounts(inviter);\n    \'\'\')\n    db.execute(\'PRAGMA user_version=4\')\n\n\ndef config(db):\n    row = db.execute("SELECT value FROM config WHERE key=\'referrals\'").fetchone()\n    return {**DEFAULTS, **(json.loads(row[0]) if row else {})}\n\n\ndef account(db, owner):\n    if not owner.startswith(\'tg:\'):\n        raise ReferralError(\'ref_telegram\')\n    row = db.execute(\'SELECT * FROM referral_accounts WHERE owner=?\', (owner,)).fetchone()\n    if not row:\n        db.execute(\'INSERT INTO referral_accounts VALUES (?,?,NULL,?)\', (owner,secrets.token_hex(12),int(time.time())))\n        row = db.execute(\'SELECT * FROM referral_accounts WHERE owner=?\', (owner,)).fetchone()\n    return row\n\n\ndef balance(db, owner):\n    return db.execute(\'SELECT COALESCE(SUM(amount),0) FROM bonus_ledger WHERE owner=?\',(owner,)).fetchone()[0]\n\n\ndef claim(db, owner, code):\n    if not config(db)[\'enabled\']:\n        raise ReferralError(\'ref_disabled\')\n    me = account(db,owner)\n    inviter = db.execute(\'SELECT * FROM referral_accounts WHERE code=?\',(code,)).fetchone()\n    if not inviter:\n        raise ReferralError(\'ref_invalid\')\n    if inviter[\'owner\'] == owner:\n        raise ReferralError(\'ref_self\')\n    if me[\'inviter\']:\n        if me[\'inviter\'] == inviter[\'owner\']:\n            return\n        raise ReferralError(\'ref_attached\')\n    if db.execute(\'SELECT 1 FROM orders WHERE owner=? LIMIT 1\',(owner,)).fetchone():\n        raise ReferralError(\'ref_existing\')\n    ancestor = inviter\n    while ancestor:\n        if ancestor[\'owner\'] == owner:\n            raise ReferralError(\'ref_cycle\')\n        ancestor = db.execute(\'SELECT * FROM referral_accounts WHERE owner=?\',(ancestor[\'inviter\'],)).fetchone() if ancestor[\'inviter\'] else None\n    db.execute(\'UPDATE referral_accounts SET inviter=? WHERE owner=?\',(inviter[\'owner\'],owner))\n\n\ndef spending(db, owner, requested, net, has_promo):\n    cfg = config(db)\n    available = balance(db,owner) if owner and owner.startswith(\'tg:\') else 0\n    limit = min(available,net*cfg[\'spend_percent\']//100) if cfg[\'enabled\'] and cfg[\'spend_enabled\'] and (cfg[\'combine_promo\'] or not has_promo) else 0\n    if not isinstance(requested,bool):\n        raise ReferralError(\'ref_bad_request\')\n    return (limit if requested else 0), available, limit\n\n\ndef snapshot(db, owner, net):\n    cfg = config(db)\n    me = db.execute(\'SELECT * FROM referral_accounts WHERE owner=?\',(owner,)).fetchone()\n    if not cfg[\'enabled\'] or not me or not me[\'inviter\'] or net < cfg[\'minimum\'] or net <= 0:\n        return {}\n    reward = net*cfg[\'reward_percent\']//100 if cfg[\'reward_type\']==\'percent\' else cfg[\'reward_fixed\']\n    reward = min(reward,net,cfg[\'reward_cap\'] or net)\n    return {\'inviter\':me[\'inviter\'],\'reward\':reward,\'welcome\':min(cfg[\'welcome\'],net),\'first_only\':cfg[\'first_only\']}\n\n\ndef entry(db, owner, order_id, kind, amount):\n    if amount:\n        db.execute(\'INSERT OR IGNORE INTO bonus_ledger(owner,order_id,kind,amount,created) VALUES (?,?,?,?,?)\',\n                   (owner,order_id,kind,amount,int(time.time())))\n\n\ndef finish(db, order, kind):\n    if kind==\'cancelled\':\n        entry(db,order[\'owner\'],order[\'id\'],\'refund\',order[\'bonus_spent\'])\n    if kind!=\'done\':\n        return\n    snap=json.loads(order[\'referral_snapshot\'])\n    if not snap:\n        return\n    # Record even zero rewards: first qualifying completed order is claimed once.\n    previous=db.execute("SELECT 1 FROM bonus_ledger l JOIN orders o ON o.id=l.order_id WHERE o.owner=? AND l.kind=\'qualified\' LIMIT 1",(order[\'owner\'],)).fetchone()\n    if db.execute("SELECT 1 FROM bonus_ledger WHERE order_id=? AND kind=\'qualified\'",(order[\'id\'],)).fetchone():\n        return\n    db.execute("INSERT INTO bonus_ledger(owner,order_id,kind,amount,created) VALUES (?,?,\'qualified\',0,?)",(order[\'owner\'],order[\'id\'],int(time.time())))\n    if not previous or not snap[\'first_only\']:\n        entry(db,snap[\'inviter\'],order[\'id\'],\'reward\',snap[\'reward\'])\n    if not previous:\n        entry(db,order[\'owner\'],order[\'id\'],\'welcome\',snap[\'welcome\'])\n\n\ndef profile(db, owner):\n    cfg=config(db)\n    result={\'config\':cfg,\'eligible\':owner.startswith(\'tg:\'),\'balance\':0,\'invited\':0,\'earned\':0,\'history\':[]}\n    if not result[\'eligible\']:\n        return result\n    me=account(db,owner)\n    result.update(code=me[\'code\'],has_inviter=bool(me[\'inviter\']),balance=balance(db,owner),\n        invited=db.execute(\'SELECT COUNT(*) FROM referral_accounts WHERE inviter=?\',(owner,)).fetchone()[0],\n        earned=db.execute("SELECT COALESCE(SUM(amount),0) FROM bonus_ledger WHERE owner=? AND kind IN (\'reward\',\'welcome\')",(owner,)).fetchone()[0],\n        history=[dict(r) for r in db.execute("SELECT kind,amount,created FROM bonus_ledger WHERE owner=? AND kind!=\'qualified\' ORDER BY id DESC LIMIT 50",(owner,))])\n    return result\n\n\ndef admin_summary(db):\n    people=[dict(r) for r in db.execute(\'SELECT a.*,c.telegram FROM referral_accounts a JOIN customers c ON c.owner=a.owner ORDER BY a.joined DESC\')]\n    for p in people:\n        p[\'telegram\']=json.loads(p[\'telegram\'])\n        p[\'balance\']=balance(db,p[\'owner\'])\n        p[\'invited\']=db.execute(\'SELECT COUNT(*) FROM referral_accounts WHERE inviter=?\',(p[\'owner\'],)).fetchone()[0]\n    return {\'config\':config(db),\'accounts\':people,\'ledger\':[dict(r) for r in db.execute("SELECT * FROM bonus_ledger WHERE kind!=\'qualified\' ORDER BY id DESC LIMIT 100")]}\n'

referrals = types.ModuleType('referrals')
sys.modules['referrals'] = referrals
exec(compile(_referrals_source, "<embedded/referrals.py>", "exec"), referrals.__dict__)

_localization_source = '"""RU/DE API errors and Telegram notifications. Catalog text is owned by admins."""\nimport re\n# Original key | Russian | German. Exact source keys keep legacy validations compatible.\n_SOURCE = \'\'\'Некоректний текст або перевищено довжину поля|Некорректный текст или превышена длина поля|Ungültiger Text oder maximale Feldlänge überschritten\nЗаповніть обов’язкові поля|Заполните обязательные поля|Bitte füllen Sie die Pflichtfelder aus\nОчікується ціле число|Введите целое число|Bitte geben Sie eine ganze Zahl ein\nЧисло поза дозволеним діапазоном|Число вне допустимого диапазона|Die Zahl liegt außerhalb des zulässigen Bereichs\nОновіть сторінку: недійсний токен сесії|Обновите страницу: сессия устарела|Bitte laden Sie die Seite neu: Die Sitzung ist abgelaufen\nСпочатку виконайте на сервері: python server.py init-admin|Сначала задайте пароль: python server.py init-admin|Legen Sie zuerst das Passwort fest: python server.py init-admin\nНеправильний пароль|Неверный пароль|Falsches Passwort\nДодайте від 1 до 100 позицій у кошик|Добавьте от 1 до 100 позиций в корзину|Fügen Sie 1 bis 100 Positionen zum Warenkorb hinzu\nНекоректні дані доставки|Некорректные данные доставки|Ungültige Lieferdaten\nВыберите доступный способ оплаты|Выберите доступный способ оплаты|Wählen Sie eine verfügbare Zahlungsart\nСумма товаров после скидки меньше минимальной суммы заказа|Сумма товаров после скидки меньше минимальной суммы заказа|Der Warenwert nach Rabatt liegt unter dem Mindestbestellwert\nТовар замовлення не знайдено|Товар заказа не найден|Der bestellte Artikel wurde nicht gefunden\nНеподдерживаемый язык|Неподдерживаемый язык|Nicht unterstützte Sprache\nНекорректный перевод характеристик|Некорректный перевод характеристик|Ungültige Übersetzung der Eigenschaften\nСсылка должна начинаться с https://|Ссылка должна начинаться с https://|Der Link muss mit https:// beginnen\nДозволено до 10 фотографій|Можно добавить до 10 фотографий|Bis zu 10 Bilder sind erlaubt\nДозволено до 30 характеристик|Можно добавить до 30 характеристик|Bis zu 30 Eigenschaften sind erlaubt\nНазви характеристик повторюються|Названия характеристик повторяются|Eigenschaftsnamen dürfen nicht mehrfach vorkommen\nТовар не знайдено|Товар не найден|Artikel nicht gefunden\nТовар змінився після відкриття форми. Відкрийте його знову, щоб не перезаписати актуальні залишки.|Товар изменился. Откройте форму заново, чтобы не перезаписать актуальные остатки.|Der Artikel wurde geändert. Öffnen Sie das Formular erneut, um aktuelle Bestände nicht zu überschreiben.\nНекоректні категорії|Некорректные категории|Ungültige Kategorien\nСтара ціна має бути вищою за поточну|Старая цена должна быть выше текущей|Der alte Preis muss über dem aktuellen Preis liegen\nДозволено до 250 варіантів|Допускается до 250 вариантов|Bis zu 250 Varianten sind erlaubt\nНекоректний статус товару|Некорректный статус товара|Ungültiger Artikelstatus\nОберіть товари|Выберите товары|Wählen Sie Artikel aus\nНевідома масова дія|Неизвестное массовое действие|Unbekannte Sammelaktion\nКатегорію не знайдено|Категория не найдена|Kategorie nicht gefunden\nСпочатку перемістіть або видаліть підкатегорії|Сначала переместите или удалите подкатегории|Verschieben oder entfernen Sie zuerst die Unterkategorien\nЗамовлення не знайдено|Заказ не найден|Bestellung nicht gefunden\nЦей перехід статусу недоступний|Этот переход статуса недоступен|Dieser Statuswechsel ist nicht zulässig\nСтатус не найден|Статус не найден|Status nicht gefunden\nКод: від 2 до 40 латинських літер, цифр, - або _|Код: от 2 до 40 латинских букв, цифр, - или _|Code: 2 bis 40 lateinische Buchstaben, Ziffern, - oder _\nВкажіть назву магазину|Укажите название магазина|Geben Sie einen Shopnamen ein\nПідтримувані валюти: UAH, USD, EUR|Поддерживаемые валюты: UAH, USD, EUR|Unterstützte Währungen: UAH, USD, EUR\nВалюту потрібно обрати до додавання товарів. Автоматичної конвертації немає.|Выберите валюту до добавления товаров. Автоматической конвертации нет.|Wählen Sie die Währung vor dem Anlegen von Artikeln. Es erfolgt keine automatische Umrechnung.\nОберіть коректний колір|Выберите корректный цвет|Wählen Sie eine gültige Farbe\nКонтакт підтримки має вигляд @username|Контакт поддержки должен иметь вид @username|Der Supportkontakt muss das Format @username haben\nПосилання на карту має починатися з https://|Ссылка на карту должна начинаться с https://|Der Kartenlink muss mit https:// beginnen\nНедопустимый тип статуса|Недопустимый тип статуса|Ungültiger Statustyp\nТип существующего статуса менять нельзя; создайте новый|Тип существующего статуса менять нельзя; создайте новый|Der Typ eines bestehenden Status kann nicht geändert werden. Erstellen Sie einen neuen.\nНачальный статус нельзя отключить|Начальный статус нельзя отключить|Der Anfangsstatus kann nicht deaktiviert werden\nОчікується файл зображення|Ожидается файл изображения|Eine Bilddatei wird erwartet\nОберіть файл|Выберите файл|Wählen Sie eine Datei\nЦіна має бути від 0 до 10 000 000, не більше двох знаків після коми|Цена: от 0 до 10 000 000, не больше двух знаков после запятой|Preis: 0 bis 10.000.000 mit höchstens zwei Nachkommastellen\nНекоректна ціна|Некорректная цена|Ungültiger Preis\nНекоректний Telegram initData|Некорректные данные авторизации Telegram|Ungültige Telegram-Anmeldedaten\nTelegram-сесія застаріла. Відкрийте Mini App повторно.|Сессия Telegram устарела. Откройте Mini App заново.|Die Telegram-Sitzung ist abgelaufen. Öffnen Sie die Mini App erneut.\nОчікується JSON-об’єкт|Ожидается JSON-объект|Ein JSON-Objekt wird erwartet\nНекоректний JSON|Некорректный JSON|Ungültiges JSON\nНекоректна позиція кошика|Некорректная позиция корзины|Ungültige Warenkorbposition\nОб’єднайте повторні позиції кошика|Объедините повторяющиеся позиции корзины|Fassen Sie doppelte Warenkorbpositionen zusammen\nТовар недоступний. Оновіть кошик.|Товар недоступен. Обновите корзину.|Der Artikel ist nicht verfügbar. Aktualisieren Sie den Warenkorb.\nОберіть доступний варіант товару|Выберите доступный вариант товара|Wählen Sie eine verfügbare Variante\nПромокод недоступний або сума замовлення замала|Промокод недоступен или сумма заказа слишком мала|Der Gutscheincode ist nicht verfügbar oder der Bestellwert ist zu niedrig\nСамовивіз вимкнено|Самовывоз отключён|Abholung ist deaktiviert\nОберіть доступну точку самовивозу|Выберите доступную точку самовывоза|Wählen Sie einen verfügbaren Abholort\nОберіть доставку або самовивіз|Выберите доставку или самовывоз|Wählen Sie Lieferung oder Abholung\nВаріант замовлення не знайдено|Вариант заказа не найден|Die bestellte Variante wurde nicht gefunden\nНедостатній залишок|Недостаточный остаток|Nicht genügend Bestand\nПеревод должен соответствовать исходной характеристике|Перевод должен соответствовать исходной характеристике|Die Übersetzung muss zur ursprünglichen Eigenschaft gehören\nСпочатку завантажте фотографію|Сначала загрузите фотографию|Laden Sie zuerst ein Bild hoch\nНекоректний варіант|Некорректный вариант|Ungültige Variante\nВаріанти повинні мати унікальні значення та ідентифікатори|Варианты должны иметь уникальные значения и идентификаторы|Varianten benötigen eindeutige Kombinationen und Kennungen\nВ усіх варіантах мають бути однакові назви параметрів|Во всех вариантах должны быть одинаковые названия параметров|Alle Varianten müssen dieselben Parameternamen verwenden\nКатегорія не може бути власною підкатегорією|Категория не может быть собственной подкатегорией|Eine Kategorie kann nicht ihre eigene Unterkategorie sein\nБатьківську категорію не знайдено|Родительская категория не найдена|Übergeordnete Kategorie nicht gefunden\nНеизвестный часовой пояс|Неизвестный часовой пояс|Unbekannte Zeitzone\nНекорректный цвет|Некорректный цвет|Ungültige Farbe\nФото має бути не більше 12 МБ|Фотография должна быть не больше 12 МБ|Das Bild darf höchstens 12 MB groß sein\nЗабагато запитів. Спробуйте за хвилину.|Слишком много запросов. Попробуйте через минуту.|Zu viele Anfragen. Versuchen Sie es in einer Minute erneut.\nЗапит з іншого сайту заборонено|Запрос с другого сайта запрещён|Anfragen von anderen Websites sind nicht erlaubt\nДоставку вимкнено|Доставка отключена|Lieferung ist deaktiviert\nВыберите способ доставки|Выберите способ доставки|Wählen Sie eine Versandart\nТариф недоступний для обраного міста|Способ доставки недоступен для указанного города|Diese Versandart ist für die angegebene Stadt nicht verfügbar\nЗавершіть або скасуйте активні замовлення перед зміною структури варіантів|Завершите или отмените активные заказы перед изменением структуры вариантов|Schließen Sie aktive Bestellungen ab oder stornieren Sie sie, bevor Sie die Variantenstruktur ändern\nНекоректний перемикач|Некорректное значение переключателя|Ungültiger Schalterwert\nЗапис не знайдено|Запись не найдена|Eintrag nicht gefunden\nФайл не є безпечним зображенням|Файл не является допустимым изображением|Die Datei ist kein gültiges Bild\nПідтримуються JPEG, PNG і WebP|Поддерживаются JPEG, PNG и WebP|JPEG, PNG und WebP werden unterstützt\nФото має перевищення 20 мегапікселів|Фотография превышает 20 мегапикселей|Das Bild überschreitet 20 Megapixel\nМожно добавить до 20 ссылок|Можно добавить до 20 ссылок|Bis zu 20 Links sind erlaubt\nМожно добавить до 12 баннеров|Можно добавить до 12 баннеров|Bis zu 12 Banner sind erlaubt\nНекорректный баннер|Некорректный баннер|Ungültiges Banner\nУвійдіть до адмінпанелі|Войдите в админ-панель|Melden Sie sich im Adminbereich an\nОновіть сторінку|Обновите страницу|Laden Sie die Seite neu\nТакий артикул або код уже існує, або запис використовується.|Такой артикул или код уже существует либо запись используется.|Diese Artikelnummer oder dieser Code existiert bereits, oder der Eintrag wird verwendet.\nПомилка сервера. Дані не збережено.|Ошибка сервера. Данные не сохранены.|Serverfehler. Die Daten wurden nicht gespeichert.\'\'\'\nERRORS={r[0]:{\'ru\':r[1],\'de\':r[2]} for line in _SOURCE.splitlines() if (r:=line.split(\'|\'))}\nERRORS.update({\'ref_telegram\': {\'ru\': \'Бонусная программа доступна внутри Telegram.\', \'de\': \'Das Bonusprogramm ist in Telegram verfügbar.\'}, \'ref_disabled\': {\'ru\': \'Реферальная программа выключена.\', \'de\': \'Das Empfehlungsprogramm ist deaktiviert.\'}, \'ref_invalid\': {\'ru\': \'Реферальный код не найден.\', \'de\': \'Empfehlungscode nicht gefunden.\'}, \'ref_self\': {\'ru\': \'Нельзя пригласить самого себя.\', \'de\': \'Sie können sich nicht selbst einladen.\'}, \'ref_attached\': {\'ru\': \'Пригласивший уже закреплён за вашим профилем.\', \'de\': \'Ihr Einladender wurde bereits zugeordnet.\'}, \'ref_existing\': {\'ru\': \'Приглашение можно принять только до первого заказа.\', \'de\': \'Eine Einladung ist nur vor der ersten Bestellung möglich.\'}, \'ref_cycle\': {\'ru\': \'Взаимные приглашения недоступны.\', \'de\': \'Gegenseitige Einladungen sind nicht möglich.\'}, \'ref_bad_request\': {\'ru\': \'Проверьте настройки бонусной программы.\', \'de\': \'Bitte prüfen Sie die Bonuseinstellungen.\'}})\n\ndef translate_error(message,lang=\'ru\'):\n    lang=\'de\' if lang==\'de\' else \'ru\'\n    if message in ERRORS:return ERRORS[message][lang]\n    if message.startswith(\'Недостатньо товару\'):\n        match=re.search(r\'залишок (\\d+)\',message)\n        stock=match.group(1) if match else \'?\'\n        return f\'Недостаточно товара. Доступно: {stock}.\' if lang==\'ru\' else f\'Недостатньо товару. Доступно: {stock}.\'\n    return \'Не удалось выполнить действие. Обновите страницу.\' if lang==\'ru\' else \'Дію не виконано. Оновіть сторінку.\'\ndef notification(kind,lang,id_,status=\'\'):\n    if kind==\'created\':return f\'Bestellung #{id_} erstellt. Bitte warten Sie auf die Bestätigung.\' if lang==\'de\' else f\'Заказ #{id_} создан. Ожидайте подтверждения магазина.\'\n    return f\'Bestellung #{id_}: {status}.\' if lang==\'de\' else f\'Заказ #{id_}: {status}.\'\n'

localization = types.ModuleType('localization')
sys.modules['localization'] = localization
exec(compile(_localization_source, "<embedded/localization.py>", "exec"), localization.__dict__)

ASSETS = {'app.css': ':root{--accent:#9d4edd;--ink:#9c8eb0;--muted:#8b7d99;--line:#3a2052;--paper:#090212;--white:#9c8eb0;--radius:20px;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:var(--paper);font-synthesis:none}*{box-sizing:border-box}body{margin:0;font-size:14px;line-height:1.5}button,input,select,textarea{font:inherit}button,a,input,select,textarea{-webkit-tap-highlight-color:transparent}button{cursor:pointer;color:inherit}button:disabled{opacity:.4;cursor:not-allowed}a{color:inherit;text-decoration:none}a:hover{text-decoration:underline}h1,h2,h3,p{margin:0}h1{font-size:clamp(28px,4vw,42px);line-height:1.12;letter-spacing:-1.5px;font-weight:650}h2{font-size:23px;line-height:1.2;letter-spacing:-.65px;font-weight:650}h3{font-size:16px;font-weight:650}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid #65994d;outline-offset:3px}img{max-width:100%;display:block}.icon{width:22px;height:22px;flex:none}small{font-size:12px}.muted{color:var(--muted)}.tiny{font-size:12px}.eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:650;color:var(--muted);margin-bottom:9px}.row{display:flex;align-items:center;gap:10px}.spread{justify-content:space-between}.wrap{flex-wrap:wrap}.full{grid-column:1/-1}.wide{width:100%}.btn{display:inline-flex;gap:9px;align-items:center;justify-content:center;border:1px solid transparent;border-radius:12px;padding:12px 18px;min-height:44px;font-weight:600;line-height:1.35;background:transparent;transition:background .2s,transform .2s;white-space:normal}.btn:hover:not(:disabled){transform:translateY(-1px)}.secondary{background:rgba(255,255,255,0.05);border-color:var(--line)}.dark{background:var(--ink);color:white}.ghost{background:transparent;color:var(--muted)}.danger{background:rgba(255,255,255,0.05);color:#ff4d4d}.small{font-size:12px;min-height:38px;padding:8px 12px}.icon-btn{border:0;background:transparent;font-size:22px;min-width:40px;min-height:40px;padding:6px}.badge{font-size:10px;letter-spacing:.2px;line-height:1.2;background:#2a1b3d;border-radius:6px;padding:6px 9px;display:inline-flex;align-items:center;white-space:nowrap}.badge.new,.badge.active,.badge.paid,.badge.transferred{background:rgba(255,255,255,0.05);color:var(--ink)}.badge.sale{background:#150d24;color:var(--ink)}.badge.cancelled,.badge.archived{background:rgba(255,255,255,0.05);color:var(--ink)}.badge.confirmed{background:rgba(255,255,255,0.05);color:var(--ink)}.badge.hidden{background:rgba(255,255,255,0.05);color:var(--ink)}.brand{display:flex;gap:10px;align-items:center;font-size:18px;font-weight:750;letter-spacing:-.7px;min-width:0}.brand span:last-child{overflow-wrap:anywhere}.brand:hover{text-decoration:none}.brand-mark{height:36px;width:36px;border-radius:11px;background:var(--ink);color:var(--accent);display:flex;align-items:center;justify-content:center;flex:none}.brand-logo{width:38px;height:38px;object-fit:contain}.announcement{text-align:center;background:rgba(255,255,255,0.05);padding:8px 16px;font-size:10px;letter-spacing:1.2px}.store-header{height:94px;display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1320px;margin:auto;padding:0 48px}.desktop-nav{display:flex;align-items:center;gap:10px}.nav-link{font-size:12px;color:var(--muted);padding:10px 14px}.nav-link.active{color:var(--ink)}.header-cart{position:relative;border:1px solid var(--line);background:rgba(255,255,255,0.05);border-radius:50%;width:43px;height:43px;min-height:43px;padding:8px;flex:none}.cart-count{position:absolute;right:-7px;top:-4px;border:2px solid var(--paper);border-radius:50%;background:var(--accent);font-size:10px;min-width:19px;height:19px;line-height:15px;text-align:center}.store-main{max-width:1320px;margin:auto;padding:0 48px;min-height:60vh}.hero{position:relative;overflow:hidden;border-radius:26px;background:rgba(255,255,255,0.05);min-height:390px;display:flex;align-items:center;padding:58px}.hero-copy{position:relative;z-index:2;max-width:480px}.hero-copy h1{font-size:clamp(40px,5vw,65px);line-height:1.03;letter-spacing:-3px;margin:23px 0 20px}.hero-copy p{font-size:14px;color:var(--ink);max-width:350px;margin-bottom:30px}.hero-label{display:inline-flex;border:1px solid #c6cebc;border-radius:30px;padding:7px 12px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase}.hero-art{position:absolute;width:50%;height:100%;right:0;top:0;overflow:hidden}.orb{position:absolute;border-radius:46% 54% 52% 48%;box-shadow:inset -35px -20px 70px #73896730,20px 35px 40px #6d805f20}.orb-one{background:rgba(255,255,255,0.02);right:0;top:36px}.orb-two{background:rgba(255,255,255,0.02)}.art-mark{position:absolute;right:100px;top:100px;font-size:165px;line-height:1;color:var(--ink);font-weight:200}.hero-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.has-banner:after{content:\'\';position:absolute;inset:0;background:rgba(255,255,255,0.02)}.store-benefits{display:flex;gap:40px;justify-content:center;padding:23px;border-bottom:1px solid var(--line);font-size:11px;color:var(--ink)}.store-benefits span{display:flex;gap:8px;align-items:center}.store-benefits .icon{width:17px;height:17px}.catalog-section{padding:39px 0}.section-heading,.page-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:25px}.page-heading{padding-top:24px;margin-bottom:30px}.section-heading .muted{font-size:11px}.category-strip{display:flex;gap:8px;overflow:auto;padding:1px 0 16px;scrollbar-width:thin}.chip{flex:none;border:1px solid var(--line);border-radius:40px;min-height:38px;padding:8px 17px;font-size:12px;background:#150d24}.chip.active{background:var(--ink);color:white;border-color:var(--ink)}.category-thumb{width:22px;height:22px;object-fit:cover;border-radius:50%}.catalog-tools{display:flex;gap:20px;align-items:center;margin-bottom:14px}.catalog-tools>.field{display:flex;flex-direction:row;gap:10px;align-items:center;font-size:11px;white-space:nowrap}.catalog-tools select{min-width:180px}.search{display:flex;gap:10px;align-items:center;border:1px solid var(--line);border-radius:12px;background:#150d24;padding:0 14px;min-height:45px;flex:1}.search .icon{width:18px;height:18px;color:var(--muted)}.search input{border:0;padding:11px 0;width:100%;background:transparent;outline:none;font-size:12px}.filters{border:1px solid var(--line);border-radius:12px;padding:12px 15px;margin-bottom:22px;background:rgba(255,255,255,0.05)}.filters summary{cursor:pointer;font-size:12px;font-weight:600;list-style:none;display:flex;justify-content:space-between}.filter-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;padding-top:16px}.product-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:28px 20px;margin-top:22px}.product-grid>.empty{grid-column:1/-1}.product-card{min-width:0;animation:rise .3s ease}.product-image{position:relative;border:0;padding:0;background:rgba(255,255,255,0.05);aspect-ratio:4/5;width:100%;overflow:hidden;border-radius:18px;display:block}.product-image>img{width:100%;height:100%;object-fit:cover;transition:transform .4s}.product-image:hover>img{transform:scale(1.035)}.placeholder{display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);color:var(--ink);width:100%;height:100%;min-height:40px}.placeholder .icon{width:40px;height:40px}.card-badges{position:absolute;left:12px;top:12px;display:flex;gap:5px}.stock-label{position:absolute;bottom:15px;left:10px;right:10px;background:rgba(255,255,255,0.05);text-align:center;border-radius:9px;padding:6px;font-size:10px}.card-info{padding:14px 1px}.card-info>small{font-size:10px;color:var(--muted)}.product-name{display:block;text-align:left;padding:4px 0;border:0;background:none;font-size:14px;line-height:1.4;font-weight:600;max-width:100%;overflow-wrap:anywhere}.card-price{display:flex;gap:7px;align-items:center;margin-top:8px;flex-wrap:wrap;font-size:14px}.card-price del{font-size:11px;color:var(--ink)}.add-btn{margin-left:auto;min-width:32px;min-height:32px;padding:5px;background:rgba(255,255,255,0.05);border-radius:50%;flex:none}.add-btn .icon{width:18px;height:18px}.variant-preview{display:flex;gap:5px;margin-top:10px;flex-wrap:wrap}.variant-preview button{border:1px solid var(--line);background:#150d24;border-radius:5px;padding:5px;font-size:9px;max-width:100%;overflow-wrap:anywhere}.store-footer{max-width:1224px;margin:40px auto 0;padding:32px 0;border-top:1px solid var(--line);display:flex;align-items:center;gap:22px;color:var(--muted);font-size:11px}.store-footer .brand{font-size:15px;color:var(--ink)}.store-footer>a:last-child{margin-left:auto}.bottom-nav{display:none}.panel{background:rgba(255,255,255,0.05);border:1px solid var(--line);border-radius:var(--radius);padding:25px}.panel>h2{margin-bottom:20px}.panel>p{margin:10px 0}.empty{text-align:center;padding:65px 25px;border:1px dashed #3a2052;border-radius:20px;background:#1a102b;width:100%}.empty-icon{display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:20px;background:rgba(255,255,255,0.05);margin:0 auto 18px;color:var(--ink)}.empty h2{font-size:22px;margin-bottom:10px}.empty p{color:var(--muted);font-size:13px;margin-bottom:20px}.empty p:last-child{margin:0}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:550;min-width:0}input:not([type=checkbox]):not([type=radio]):not([type=file]),select,textarea{border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,0.05);min-height:44px;padding:11px 12px;color:var(--ink);width:100%;max-width:100%;font-weight:400}input[type=color]{padding:5px!important}input[type=checkbox],input[type=radio]{accent-color:var(--ink);width:17px;height:17px;flex:none}textarea{resize:vertical;min-height:100px;line-height:1.6}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.check{display:flex;gap:8px;align-items:center;font-size:12px;min-height:38px}.check input{margin:0}.error{color:var(--ink);font-size:12px;margin:12px 0}.error:empty{display:none}.notice{background:rgba(255,255,255,0.05);padding:16px;border-radius:12px;font-size:13px;line-height:1.7;margin:16px 0}.description{white-space:pre-wrap;font-size:13px;color:var(--ink);line-height:1.8;overflow-wrap:anywhere}.checkout-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(290px,1fr);gap:30px;align-items:start}.cart-list{background:rgba(255,255,255,0.05);border:1px solid var(--line);border-radius:20px;margin-bottom:24px;padding:0 22px}.cart-item{display:flex;gap:18px;padding:20px 0;border-bottom:1px solid var(--line);align-items:flex-start}.cart-item:last-child{border:0}.cart-photo{height:120px;width:92px;object-fit:cover;border-radius:10px;flex:none}.cart-info{flex:1;min-width:0}.cart-info h3{font-size:14px;overflow-wrap:anywhere}.cart-info p{font-size:11px;margin:5px 0}.cart-info b{font-size:13px}.quantity{display:flex;align-items:center;border:1px solid var(--line);border-radius:8px;width:max-content;margin-top:10px;font-size:12px}.quantity .icon-btn{min-width:30px;min-height:28px;font-size:16px;padding:4px 9px}.quantity span{min-width:25px;text-align:center}.checkout-summary{position:sticky;top:20px}.checkout-summary h2{font-size:20px}.promo-control{display:flex;gap:8px;align-items:end}.promo-control .field{flex:1;min-width:0}.promo-control .btn{padding:12px;font-size:11px}.totals{padding:15px 0}.totals>div{display:flex;justify-content:space-between;gap:14px;font-size:13px;padding:9px 0;color:var(--ink)}.totals .total{font-size:20px;color:var(--ink);border-top:1px solid var(--line);margin-top:12px;padding-top:20px}.shipping-progress{background:rgba(255,255,255,0.05);border-radius:12px;padding:13px;font-size:11px}.shipping-progress p{margin-bottom:10px}progress{width:100%;height:5px;border:0;border-radius:5px;overflow:hidden;background:#dce2d3}progress::-webkit-progress-bar{background:#dce2d3}progress::-webkit-progress-value{background:#73975d}progress::-moz-progress-bar{background:#73975d}.payment-note{font-size:12px;line-height:1.7;color:var(--muted);margin:20px 0}.checkout-summary>.tiny{margin-top:15px}.checkout-form>.field{margin-top:18px}.checkout-form h2{font-size:20px}.fulfillment-switch{display:flex;gap:10px;margin:20px 0}.fulfillment-switch label{display:flex;align-items:center;justify-content:center;gap:9px;border:1px solid var(--line);border-radius:12px;padding:13px;flex:1;font-size:12px;cursor:pointer}.fulfillment-switch label:has(input:checked){background:rgba(255,255,255,0.05);border-color:var(--ink)}.fulfillment-switch input{position:absolute;opacity:0}.fulfillment-switch label:focus-within{outline:2px solid #628951}.fulfillment-switch .icon{width:20px;height:20px}#fulfillment-fields{margin-top:18px}.pickup-list{display:grid;gap:10px}.pickup-option{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--line);border-radius:12px;padding:15px}.pickup-option:has(input:checked){border-color:var(--ink);background:rgba(255,255,255,0.05)}.pickup-option>span{display:grid;gap:5px;font-size:12px}.pickup-option small{color:var(--muted)}.pickup-option a{color:var(--ink)}.profile-card{max-width:600px;margin:auto;text-align:center;padding:42px}.profile-avatar{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);margin:0 auto 20px}.profile-avatar .icon{width:36px;height:36px}.profile-card .btn{margin:20px 10px 0}.profile-card>a:last-child{display:block;margin-top:18px}.order-card{margin-bottom:16px}.order-card summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;cursor:pointer}.order-card summary small{display:block;color:var(--muted);margin-top:5px}.order-items{margin-top:15px}.order-line{display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line);font-size:13px}.order-line>span{flex:1}.order-line small{display:block;color:var(--muted);font-size:11px}.fulfillment-detail{font-size:12px;background:rgba(255,255,255,0.05);border-radius:12px;padding:15px}.fulfillment-detail p{margin-top:5px;overflow-wrap:anywhere}.tiny-photo{width:44px;height:54px;object-fit:cover;border-radius:8px;flex:none}.tiny-photo .icon{width:20px;height:20px}dialog{width:min(850px,calc(100vw - 36px));max-height:90dvh;border:1px solid var(--line);border-radius:22px;padding:0;color:var(--ink);box-shadow:0 30px 120px #19201044}dialog::backdrop{background:#20291c66;backdrop-filter:blur(4px)}.modal-head{position:sticky;top:0;background:#150d24;z-index:4;display:flex;justify-content:space-between;align-items:center;gap:18px;padding:17px 25px;border-bottom:1px solid var(--line)}.modal-head h2{font-size:19px;overflow-wrap:anywhere}.modal-body{padding:25px}.modal-footer{position:sticky;bottom:0;padding:16px 25px;background:#150d24;border-top:1px solid var(--line);display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap;z-index:3}.product-detail{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:28px}.detail-image{aspect-ratio:4/5;border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.05)}.detail-image>img{width:100%;height:100%;object-fit:contain}.detail-copy h2{margin-bottom:12px}.detail-copy h3{margin:20px 0 12px;font-size:13px}.detail-price{font-size:25px;font-weight:650;margin-bottom:18px}.detail-copy .muted{margin-top:18px;font-size:12px}.gallery{display:flex;gap:8px;overflow:auto;margin-top:10px}.gallery-item{min-width:55px;width:55px;height:65px;padding:0;border:1px solid var(--line);border-radius:8px;overflow:hidden}.gallery-item img{width:100%;height:100%;object-fit:cover}.variant-options{display:grid;gap:8px}.variant-option{display:flex;flex-direction:column;gap:5px;border:1px solid var(--line);border-radius:10px;text-align:left;padding:10px 12px;background:rgba(255,255,255,0.05);font-size:11px}.variant-option small{font-size:10px;color:var(--muted)}.variant-option.active{background:rgba(255,255,255,0.05);border-color:var(--ink)}.traits{font-size:11px;margin-top:24px}.traits>div{display:flex;gap:15px;justify-content:space-between;border-bottom:1px solid var(--line);padding:9px 0}.traits dt{color:var(--muted)}.traits dd{text-align:right;margin:0;overflow-wrap:anywhere}.success-mark{width:65px;height:65px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;margin:auto}.success-mark .icon{width:32px;height:32px}#toast{position:fixed;bottom:30px;left:50%;transform:translate(-50%,20px);padding:13px 22px;background:#263021;color:white;border-radius:12px;z-index:1000;max-width:90vw;opacity:0;pointer-events:none;font-size:13px;transition:opacity .2s,transform .2s}#toast.show{opacity:1;transform:translate(-50%,0)}.boot{text-align:center;padding:120px 20px;color:var(--muted)}\n.hero{box-shadow: inset 0 0 50px rgba(157,78,221,0.1), 0 0 30px rgba(157,78,221,0.2);border:1px solid #3a2052}.btn.primary{box-shadow: 0 0 15px rgba(157,78,221,0.3);}.product-card, .panel, .filters{box-shadow: 0 0 20px rgba(166,74,255,0.05);}body{text-shadow:0 0 5px rgba(156,142,176,0.3)} h1,h2,h3,b{text-shadow:0 0 10px rgba(156,142,176,0.6)} .primary{background:var(--accent);color:#11091a;text-shadow:0 0 10px rgba(255,255,255,0.4)} /* Administration */\n.admin-shell{display:grid;grid-template-columns:235px minmax(0,1fr);min-height:100vh}.sidebar{position:sticky;top:0;height:100vh;background:rgba(255,255,255,0.05);border-right:1px solid var(--line);display:flex;flex-direction:column;padding:30px 20px}.sidebar .brand{font-size:16px;gap:8px}.sidebar>.eyebrow{margin-top:43px;font-size:9px;padding-left:10px}.sidebar nav{display:grid;gap:5px}.side-link{justify-content:flex-start;font-size:12px;font-weight:500;color:var(--ink);border-radius:10px;padding:11px 12px;gap:12px}.side-link .icon{width:19px;height:19px}.side-link.active{background:rgba(255,255,255,0.05);color:var(--ink);font-weight:650}.sidebar-bottom{margin-top:auto;display:grid;gap:15px;padding:20px 12px 0;font-size:11px;color:var(--muted)}.sidebar-bottom .btn{justify-content:flex-start;padding:0}.admin-header{height:78px;display:flex;justify-content:space-between;align-items:center;padding:0 36px;border-bottom:1px solid var(--line);font-size:12px;background:rgba(255,255,255,0.05)}.admin-main{padding:16px 36px 45px;max-width:1440px;margin:auto}.admin-main h1{font-size:32px}.admin-main .page-heading .eyebrow{font-size:9px}.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:28px}.metric{background:#150d24;border:1px solid var(--line);border-radius:18px;padding:23px;display:grid;gap:18px}.metric.highlight{background:rgba(255,255,255,0.05);border-color:var(--ink)}.metric>span{font-size:12px;color:var(--ink)}.metric>b{font-size:33px;letter-spacing:-1.5px;line-height:1}.metric>small{font-size:10px;color:var(--ink)}.admin-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:22px}.admin-grid h2{font-size:19px}.quick-links{display:grid;gap:6px}.quick-link{display:flex;align-items:center;gap:12px;text-align:left;justify-content:space-between;font-weight:400;padding:12px 0}.quick-link>span:first-child{display:flex;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05)}.quick-link>span:nth-child(2){flex:1}.quick-link b{font-size:12px;display:block}.quick-link small{font-size:10px;color:var(--muted);display:block;margin-top:3px}.admin-main .search{margin-bottom:22px;max-width:500px}.table-wrap{width:100%;overflow:auto}.table-wrap.panel{padding:0}table{border-collapse:collapse;width:100%;text-align:left;font-size:12px}th{font-size:10px;color:var(--ink);font-weight:500;background:rgba(255,255,255,0.05)}td,th{padding:16px 18px;white-space:nowrap;border-bottom:1px solid var(--line)}tr:last-child td{border-bottom:0}td small{display:block;color:var(--muted);margin-top:4px;font-size:10px}.table-product{display:flex;align-items:center;gap:12px}.table-product b{font-weight:600;white-space:normal;min-width:100px;max-width:220px;display:block;overflow-wrap:anywhere}.admin-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin-bottom:30px}.admin-cards .panel p{font-size:12px}.admin-cards .panel h3{overflow-wrap:anywhere}.category-admin{display:grid;gap:16px}.category-symbol{display:flex;width:50px;height:50px;border-radius:14px;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);font-size:25px}.category-cover{width:100%;height:130px;object-fit:cover;border-radius:12px}.category-admin .eyebrow{font-size:8px}.category-admin .row{margin-top:auto}.promo-percent{font-size:42px;letter-spacing:-2px;margin:20px 0 8px;color:var(--ink)}.settings-form{max-width:860px;margin-bottom:32px}.settings-form .form-grid{margin:22px 0}.settings-form .row{margin:15px 0}.brand-preview{width:160px;height:100px;object-fit:contain;border:1px solid var(--line);border-radius:12px;margin:10px 0}.editor-section{margin:25px 0;border-top:1px solid var(--line);padding-top:20px}.editor-section h3{font-size:14px;margin-bottom:12px}.editor-section>.row h3{margin:0}.editor-section>.row{margin-bottom:13px}.pair-row{display:flex;gap:8px;align-items:center;margin-bottom:9px}.pair-row input{font-size:12px;min-width:0}.pair-row .icon-btn{flex:none}.variant-editor{border:1px solid var(--line);border-radius:14px;padding:16px;margin-top:14px;background:rgba(255,255,255,0.05)}.variant-editor>.row{margin-bottom:12px}.variant-editor .form-grid{margin-top:12px}.category-checks{display:flex;gap:8px 20px;flex-wrap:wrap}.category-checks .check{max-width:100%;overflow-wrap:anywhere}.photo-list{display:flex;gap:10px;overflow:auto;margin:15px 0}.photo-editor{flex:none;width:110px}.photo-editor>img{height:120px;width:110px;object-fit:cover;border-radius:10px}.photo-editor>div{display:flex;justify-content:space-between}.photo-editor .btn{min-width:30px;padding:2px;min-height:32px;font-size:16px}.upload-zone{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;padding:24px;border:1px dashed #c4d1b8;background:rgba(255,255,255,0.05);border-radius:14px;font-size:12px;cursor:pointer}.upload-zone input{max-width:100%;font-size:11px}.editor-section>.tiny{margin-top:10px}.login-page{min-height:100vh;display:grid;place-items:center;padding:25px;background:radial-gradient(ellipse at 15% 20%,#dce9cf,transparent 50%)}.login-card{width:100%;max-width:430px;padding:40px}.login-card>.eyebrow{margin-top:40px}.login-card h1{font-size:30px;margin:12px 0 30px}.login-card .wide{margin:20px 0}.login-card>a{display:block;font-size:12px;color:var(--muted)}.login-card .brand{color:var(--ink);font-size:18px}\n@keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}\n@media(min-width:1450px){.admin-main{padding-top:30px}.admin-grid{grid-template-columns:1fr 1.5fr}}@media(max-width:1050px){.store-header,.store-main{padding-left:28px;padding-right:28px}.hero{padding:40px;min-height:350px}.hero-copy{max-width:55%}.hero-copy h1{font-size:50px}.hero-art{width:45%}.orb-two{right:110px}.orb-one{right:-100px}.art-mark{right:25px}.product-grid{gap:20px 15px}.store-footer{margin-left:28px;margin-right:28px}.desktop-nav{gap:0}.desktop-nav .btn{padding:10px}.admin-shell{grid-template-columns:195px minmax(0,1fr)}.sidebar{padding:25px 12px}.admin-main{padding:12px 22px 40px}.admin-header{padding:0 22px}.admin-grid{grid-template-columns:1fr}.metric{padding:18px}.metric>b{font-size:27px}.checkout-layout{gap:20px;grid-template-columns:minmax(0,1fr) 310px}.panel{padding:20px}}\n@media(max-width:760px){body{font-size:13px}.announcement{font-size:9px;padding:7px}.store-header{height:73px;padding:0 20px}.brand{font-size:17px}.brand-mark{width:33px;height:33px}.desktop-nav{display:none}.store-main{padding:0 18px}.hero{min-height:330px;padding:30px 25px;border-radius:22px;align-items:flex-start}.hero-copy{max-width:72%}.hero-copy h1{font-size:43px;letter-spacing:-2.3px;margin-top:20px;max-width:280px}.hero-copy p{font-size:12px;max-width:240px;margin-bottom:23px}.hero-copy .btn{font-size:12px;padding:12px 17px}.hero-label{font-size:8px;padding:6px 9px}.hero-art{width:55%;opacity:.7}.orb-one{width:200px;height:280px;right:-110px;top:95px}.orb-two{width:120px;height:190px;right:5px;top:200px}.art-mark{font-size:85px;top:170px;right:-4px}.store-benefits{padding:18px 0;gap:18px;justify-content:space-around;font-size:9px}.store-benefits span{gap:5px}.store-benefits .icon{width:15px;height:15px}.catalog-section{padding:28px 0}.section-heading{margin-bottom:19px}.section-heading h2{font-size:25px}.section-heading .eyebrow{font-size:8px;margin-bottom:6px}.catalog-tools{gap:10px;align-items:stretch}.catalog-tools .field{font-size:0;flex:0 0 135px}.catalog-tools select{font-size:10px;min-width:0;padding:9px;min-height:44px}.search{padding:0 10px}.search input{font-size:11px!important;min-width:0}.product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:17px 13px;margin-top:16px}.product-image{border-radius:14px}.card-info{padding:10px 0}.card-info>small{font-size:9px}.product-name{font-size:12px}.card-price{font-size:12px;gap:5px;margin-top:5px}.card-price del{font-size:9px}.add-btn{width:30px;min-width:30px;height:30px;min-height:30px}.card-badges{left:9px;top:9px}.card-badges .badge{font-size:8px;padding:5px 7px}.variant-preview{gap:4px}.variant-preview button{font-size:8px;padding:5px 4px;min-height:28px}.stock-label{font-size:8px;padding:6px}.store-footer{margin:20px 18px 95px;flex-wrap:wrap;gap:18px;padding-top:25px}.store-footer>span{display:none}.store-footer>a:last-child{margin-left:0;font-size:10px}.bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:rgba(9, 2, 18, 0.95);backdrop-filter:blur(15px);border-top:1px solid var(--line);padding:7px 8px calc(7px + env(safe-area-inset-bottom));justify-content:space-around;z-index:20}.bottom-nav button{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:3px;min-height:48px;min-width:54px;border:0;background:none;color:var(--ink);padding:4px 6px;border-radius:10px}.bottom-nav button>span{position:relative}.bottom-nav .icon{width:20px;height:20px}.bottom-nav button.active{color:var(--ink);background:rgba(255,255,255,0.05)}.bottom-nav small{font-size:8px}.bottom-nav i{font-style:normal;font-size:8px;position:absolute;right:-10px;top:-5px;background:var(--accent);border-radius:20px;color:var(--ink);min-width:14px;padding:1px 3px}.page-heading{margin-bottom:24px;padding-top:16px}.page-heading h1{font-size:29px}.page-heading .btn{font-size:10px;padding:10px;min-height:40px}.checkout-layout{grid-template-columns:1fr;gap:20px}.checkout-summary{position:static}.cart-list{padding:0 15px}.cart-item{gap:12px}.cart-photo{width:72px;height:100px}.cart-info h3{font-size:12px}.cart-item>.icon-btn{min-width:28px;padding:0}.checkout-form h2,.checkout-summary h2{font-size:19px}.form-grid{gap:13px}.field{font-size:11px}input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,select{font-size:16px}.filter-grid select{font-size:13px}.filter-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.fulfillment-switch label{padding:12px 8px;font-size:11px}.profile-card{padding:30px 20px}.order-card{padding:18px}.order-card summary{font-size:12px}.order-line{font-size:11px}.order-line>b{font-size:11px;white-space:nowrap}.order-line>span{min-width:0}.order-line b{overflow-wrap:anywhere}.totals .total{font-size:19px}.empty{padding:45px 20px}.empty h2{font-size:20px}.empty p{font-size:12px}dialog{width:calc(100vw - 20px);max-height:94dvh;border-radius:19px}.modal-head{padding:12px 16px}.modal-head h2{font-size:17px}.modal-body{padding:18px 16px}.modal-footer{padding:12px 16px calc(12px + env(safe-area-inset-bottom))}.modal-footer .btn{flex:1;font-size:12px;min-width:80px}.product-detail{grid-template-columns:1fr;gap:22px}.detail-image{aspect-ratio:1;max-height:350px}.detail-image>img{object-fit:contain}.detail-copy h2{font-size:22px}.variant-option{padding:14px;font-size:12px}.variant-option small{font-size:11px}.traits{font-size:12px}#toast{bottom:90px}.admin-shell{display:block}.sidebar{position:static;height:auto;width:100%;padding:18px;border-right:0;border-bottom:1px solid var(--line);gap:16px}.sidebar>.eyebrow{display:none}.sidebar nav{display:flex;overflow:auto;gap:6px;padding-bottom:3px}.side-link{flex:none;font-size:10px;min-height:38px;padding:8px 12px;gap:7px}.side-link .icon{width:16px;height:16px}.sidebar .brand{max-width:70%}.sidebar-bottom{position:absolute;top:20px;right:15px;margin:0;padding:0;font-size:10px;display:flex}.sidebar-bottom>a{display:none}.sidebar-bottom .btn{min-height:30px}.admin-header{height:48px;padding:0 18px;font-size:10px}.admin-main{padding:10px 16px 35px}.admin-main h1{font-size:25px;letter-spacing:-.8px}.admin-main .page-heading{gap:10px}.admin-main .page-heading .btn .icon{width:16px}.metrics{gap:9px;grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:20px}.metric{padding:14px 10px;border-radius:12px;gap:12px}.metric>span{font-size:9px}.metric>b{font-size:20px;letter-spacing:-.8px;overflow-wrap:anywhere}.metric>small{font-size:8px}.admin-cards{grid-template-columns:1fr}.admin-main .section-heading h2{font-size:18px}.admin-main .section-heading>.btn{font-size:10px}.settings-form{padding:18px}.settings-form h2{font-size:19px}.pair-row{gap:5px}.pair-row input{font-size:12px!important;padding:10px 8px!important}.pair-row .icon-btn{min-width:28px}.variant-editor{padding:12px}.variant-editor .field{font-size:10px}.editor-section h3{font-size:13px}.editor-section>.row>.btn{font-size:10px}.category-checks{gap:5px 12px}.category-checks .check{font-size:11px}.login-card{padding:28px}.admin-body{min-width:0}.table-wrap th,.table-wrap td{padding:12px}.table-wrap table{font-size:11px}.table-product .tiny-photo{width:36px;height:44px}.brand-preview{width:100%;max-width:160px}.order-card summary .badge{font-size:9px}}\n@media(max-width:370px){.store-main{padding:0 12px}.store-header{padding:0 14px}.hero{padding:26px 20px}.hero-copy{max-width:85%}.hero-copy h1{font-size:38px}.store-benefits{gap:8px;font-size:8px}.product-grid{gap:15px 10px}.card-price{font-size:11px}.card-price del{font-size:8px}.bottom-nav button{min-width:48px}.bottom-nav small{font-size:7px}.form-grid{grid-template-columns:1fr}.metrics{grid-template-columns:1fr}.metric{gap:8px}.metric>b{font-size:26px}.metric>small{font-size:10px}.metric>span{font-size:11px}}\n/* Mobile commerce v3 */\n:root{--secondary:#e9ede2}.announcement{background:var(--secondary)}.language-switch{display:flex;padding:3px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,0.05);flex:none;gap:2px}.language-switch button{border:0;border-radius:7px;padding:7px 9px;min-height:32px;background:transparent;font-size:11px;font-weight:650;color:var(--muted)}.language-switch button.active{background:var(--accent);color:var(--ink)}.profile-language{margin:28px 0;display:grid;gap:12px;justify-items:center}.store-footer>div{max-width:350px;white-space:pre-line}.banner-dots{position:absolute;z-index:3;bottom:14px;right:24px;display:flex;gap:3px}.dot-button{min-width:30px;min-height:30px;padding:4px;font-size:13px;color:var(--ink)70}.dot-button.active{color:var(--ink)}.checkout-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:27px}.checkout-steps button{border:0;background:none;display:flex;flex-direction:column;align-items:center;gap:7px;padding:4px;position:relative;color:var(--muted)}.checkout-steps button>span{border:1px solid var(--line);width:31px;height:31px;border-radius:50%;display:grid;place-items:center;background:var(--paper);font-size:12px;font-weight:650}.checkout-steps button.active>span{background:var(--ink);color:var(--accent);border-color:var(--ink)}.checkout-steps button.complete>span{background:var(--accent);color:var(--ink);border-color:var(--accent)}.checkout-steps button small{font-size:10px}.checkout-steps button.active small{font-weight:650;color:var(--ink)}.step-content h2{font-size:21px;margin-bottom:22px}.step-content h3{font-size:14px;margin-bottom:12px}.step-content>.field{margin-top:18px}.wizard-buttons{display:flex;justify-content:space-between;gap:12px;margin-top:22px}.wizard-buttons>.primary{margin-left:auto;min-width:125px}.method-list{display:grid;gap:12px;margin:16px 0}.method-card{display:flex;gap:12px;align-items:flex-start;padding:16px;border:1px solid var(--line);border-radius:14px;cursor:pointer}.method-card:has(input:checked){background:#2a1b3d;border-color:var(--ink)}.method-card>span{display:grid;gap:8px;flex:1;min-width:0}.method-card small{display:block;white-space:pre-line;color:var(--muted);font-size:12px}.method-card b{overflow-wrap:anywhere}.method-card .description{font-size:12px}.review-block{padding:15px 0;border-top:1px solid var(--line);font-size:13px;overflow-wrap:anywhere}.review-block p{margin-top:7px;color:var(--muted)}.review-block:first-of-type{border-top:0}.management-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}.management-card{border:1px solid var(--line);border-radius:18px;background:#150d24;padding:20px;min-width:0}.management-card h3,.management-card p{overflow-wrap:anywhere}.management-card>p{margin-top:10px;font-size:12px}.management-card>.btn,.management-card>.row:last-child{margin-top:17px}.management-card>.row:first-child{margin-top:0}.card-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:15px 0;font-size:12px}.grow{flex:1;min-width:0}.grow h3{font-size:14px;margin-bottom:4px}.grow b{display:block;margin-top:8px}.admin-card-photo{width:72px;height:86px;border-radius:12px;object-fit:cover;flex:none}.metrics.four{grid-template-columns:repeat(4,minmax(0,1fr))}.metrics.four .metric>b{font-size:28px}.quick-actions{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 30px}.admin-filter-chips{display:flex;flex-wrap:wrap;gap:7px;margin:16px 0 24px}.admin-filter-chips .chip.active{background:var(--ink);color:white}.admin-bottom-nav{display:none}.more-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.more-card{display:flex;gap:14px;align-items:center;border:1px solid var(--line);border-radius:16px;padding:22px;background:#150d24;text-align:left;justify-content:space-between}.more-card>span:first-child{background:#2a1b3d;display:flex;padding:10px;border-radius:12px}.more-card>span:nth-child(2){flex:1;min-width:0}.more-card b{display:block;font-size:14px}.more-card small{display:block;font-size:11px;color:var(--muted);margin-top:5px;font-weight:400}.link-editor{padding:17px;border:1px solid var(--line);border-radius:14px;margin:15px 0}.banner-preview{width:100%;max-height:180px;object-fit:cover;border-radius:12px;margin-bottom:14px}.pair-fields{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1;min-width:0}.pair-row{align-items:flex-start;padding:12px;border:1px solid var(--line);border-radius:12px;background:#150d24}.pair-row .icon-btn{padding:0}.audit-cards{display:grid;gap:9px}.audit-cards .management-card{padding:15px}.order-admin-header{margin-bottom:20px}.order-admin-header>p{margin:5px 0}.sidebar{overflow-y:auto}.sidebar nav{gap:2px}.side-link{min-height:36px;padding:8px 10px}.sidebar>.eyebrow{margin-top:25px}.sidebar-bottom{padding-top:22px}.settings-form h2:not(:first-child){margin-top:25px}.admin-main input,.admin-main textarea{max-width:100%}.checkout-form .form-grid{margin-top:16px}.checkout-form>.error{scroll-margin-top:100px}\n@media(max-width:1100px){.metrics.four{grid-template-columns:repeat(2,minmax(0,1fr))}.management-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.more-card{padding:16px}}\n@media(max-width:760px){.store-header{gap:12px}.store-header>.brand{font-size:15px;max-width:calc(100% - 125px)}.store-header>.row{gap:9px}.language-switch button{font-size:10px;padding:6px 7px;min-height:32px}.header-cart{width:37px;height:37px;min-height:37px}.admin-shell .sidebar{display:none}.admin-header{position:sticky;top:0;z-index:15;background:rgba(9, 2, 18, 0.95);backdrop-filter:blur(8px);height:56px;gap:15px}.admin-header>span{min-width:0;overflow-wrap:anywhere}.admin-header>a{white-space:nowrap}.admin-main{padding:14px 16px calc(110px + env(safe-area-inset-bottom))}.admin-bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;padding:8px 9px calc(8px + env(safe-area-inset-bottom));background:rgba(9, 2, 18, 0.95);backdrop-filter:blur(15px);border-top:1px solid var(--line);z-index:25;justify-content:space-around}.admin-bottom-nav>button{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:0;border-radius:12px;padding:8px 10px;min-width:57px;min-height:49px;background:none;color:var(--ink)}.admin-bottom-nav>button.active{background:#2a1b3d;color:var(--ink)}.admin-bottom-nav small{font-size:9px}.admin-bottom-nav .icon{height:21px;width:21px}.admin-bottom-nav i{position:absolute;right:14px;top:7px;width:6px;height:6px;background:#d58b46;border-radius:50%}.management-cards{grid-template-columns:1fr;gap:13px}.management-card{padding:18px;border-radius:16px}.management-card h3{font-size:16px}.management-card>.btn{min-height:44px}.admin-card-photo{width:72px;height:87px}.metrics.four{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.metrics.four .metric{padding:18px 14px;gap:12px}.metrics.four .metric>b{font-size:25px}.metrics.four .metric>span{font-size:11px}.metrics.four .metric>small{font-size:9px}.quick-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.quick-actions .btn{font-size:11px;min-height:48px;padding:10px 7px}.admin-main .page-heading>.btn{min-height:44px;font-size:12px}.admin-main .page-heading{align-items:center}.admin-main .search input{font-size:16px!important}.admin-filter-chips{gap:6px}.admin-filter-chips .chip{font-size:11px;min-height:40px;padding:9px 13px}.more-grid{grid-template-columns:1fr}.more-card{padding:17px;min-height:83px}.more-card b{font-size:14px}.more-card small{font-size:11px}.admin-main .form-grid{grid-template-columns:1fr}.admin-main .field{font-size:12px}.admin-main .settings-form>.btn[type=submit]{width:100%;min-height:48px}.checkout-steps{gap:2px}.checkout-steps button small{font-size:9px}.step-content h2{font-size:20px}.method-card{padding:14px 12px;font-size:12px}.method-card small{font-size:11px}.method-card .row.spread{gap:10px;align-items:flex-start}.method-card .row.spread>b:last-child{white-space:nowrap}.wizard-buttons .btn{min-height:48px;flex:1}.checkout-summary{margin-bottom:12px}.pair-row{padding:9px;gap:5px}.pair-fields{gap:7px}.pair-fields input{font-size:12px!important}.modal-body .form-grid{grid-template-columns:1fr}.variant-editor .form-grid{grid-template-columns:1fr 1fr}.photo-list{flex-wrap:wrap;overflow:visible}.photo-editor{width:calc(33.333% - 7px);min-width:80px}.photo-editor>img{width:100%;height:110px}.store-footer{gap:15px}.store-footer>div{flex-basis:100%;font-size:11px}.hero{padding-bottom:42px}.admin-shell #toast{bottom:95px}.card-meta .badge{font-size:10px}}\n@media(max-width:370px){.admin-main{padding-left:12px;padding-right:12px}.admin-bottom-nav>button{min-width:50px;padding:8px}.admin-bottom-nav small{font-size:8px}.store-header{padding:0 12px}.store-header .brand-mark{display:none}.store-header>.brand{max-width:calc(100% - 117px)}.metrics.four .metric>b{font-size:22px}.pair-fields{grid-template-columns:1fr}.variant-editor .form-grid{grid-template-columns:1fr}.checkout-steps button small{font-size:8px}}\n.referral-panel{margin-top:24px;max-width:760px}.referral-panel h3{margin-top:24px}.referral-panel .field{margin-top:18px}.referral-panel input{min-width:0;width:100%;box-sizing:border-box}.referral-panel .row{gap:12px;padding:8px 0;flex-wrap:wrap}.bonus-control{padding:12px 0;border-bottom:1px solid var(--line)}\n', 'app.js': '\'use strict\';\nconst $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];\nconst esc=v=>String(v??\'\').replace(/[&<>"\']/g,c=>({\'&\':\'&amp;\',\'<\':\'&lt;\',\'>\':\'&gt;\',\'"\':\'&quot;\',"\'":\'&#39;\'}[c]));\nconst icons={home:\'m3 10 9-7 9 7v11h-6v-7H9v7H3V10\',products:\'M4 7h16l1 14H3L4 7Zm4 0V5a4 4 0 0 1 8 0v2\',cart:\'M2 3h3l3 12h11l3-9H6M9 21h.01M18 21h.01\',profile:\'M20 21v-2a7 7 0 0 0-14 0v2M17 6a5 5 0 1 1-10 0 5 5 0 0 1 10 0\',orders:\'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6m-6 4h4\',categories:\'M3 7h7l2 3h9v10H3zM3 7V4h7l2 3h9v3\',dashboard:\'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z\',promos:\'M3 3h9l9 9-9 9-9-9V3Zm5 4h.01\',delivery:\'M1 5h13v12H1zM14 9h5l3 5v3h-8M6 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0m15 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0\',settings:\'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2\',search:\'m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0\',arrow:\'M4 12h16m-6-6 6 6-6 6\',plus:\'M12 4v16M4 12h16\',check:\'m4 12 5 5L20 6\',pin:\'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0\',audit:\'M7 4h14M7 9h14M7 14h14M7 19h14M3 4h.01M3 9h.01M3 14h.01M3 19h.01\'};\nconst icon=n=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[n]||icons.products}"/></svg>`;\nconst btn=(label,action,id=\'\',cls=\'secondary\',extra=\'\')=>`<button type="button" class="btn ${cls}" data-action="${action}" data-id="${esc(id)}" ${extra}>${label}</button>`;\nconst field=(name,label,value=\'\',type=\'text\',extra=\'\')=>`<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;\nconst area=(name,label,value=\'\',extra=\'\')=>`<label class="field full">${label}<textarea name="${name}" ${extra}>${esc(value)}</textarea></label>`;\nconst check=(name,label,value)=>`<label class="check"><input type="checkbox" name="${name}" ${value?\'checked\':\'\'}>${label}</label>`;\nconst select=(name,label,options,value=\'\',extra=\'\')=>`<label class="field">${label}<select name="${name}" ${extra}>${options.map(([v,l])=>`<option value="${esc(v)}" ${String(v)===String(value)?\'selected\':\'\'}>${esc(l)}</option>`).join(\'\')}</select></label>`;\nconst imageUrl=id=>\'/images/\'+encodeURIComponent(id)+\'.webp\';\nconst photo=(id,cls=\'\',alt=\'\')=>id?`<img class="${cls}" src="${imageUrl(id)}" alt="${esc(alt)}" loading="lazy">`:`<span class="placeholder ${cls}" aria-label="${isAdmin?\'Без фото\':t(\'noImage\')}">${icon(\'products\')}</span>`;\nlet session={},catalog={products:[],categories:[],settings:{},pickup_points:[],shipping_rates:[],payment_methods:[],order_statuses:[]},admin=null,view=\'home\',tab=\'dashboard\',editing=null,busy=false;\nlet renderedCatalog=\'\',search=\'\',category=\'\',filters={},sorting=\'new\',adminSearch=\'\',orderFilter=\'\',cart=[],draft={},quoteResult=null,quoteSequence=0,checkoutKey=null;\nconst isAdmin=location.pathname.startsWith(\'/admin\');\ntry{const saved=JSON.parse(localStorage.getItem(\'universal-cart-v2\')||\'[]\');if(Array.isArray(saved))cart=saved.filter(x=>Number.isInteger(x.id)&&typeof x.variant_id===\'string\'&&Number.isInteger(x.quantity)&&x.quantity>0).slice(0,100);}catch{}\nconst money=(v,currency=(admin?.settings||catalog.settings).currency||\'EUR\')=>new Intl.NumberFormat(isAdmin?\'ru-RU\':locale(),{style:\'currency\',currency}).format((v||0)/100);\nconst count=()=>cart.reduce((n,x)=>n+x.quantity,0);\nlet statusNames={};\nconst badge=(value,label)=>`<span class="badge ${esc(value)}">${esc(label||statusNames[value]||value)}</span>`;\nconst errorBox=()=>\'<p class="error" id="form-error" role="alert"></p>\';\nfunction saveCart(){localStorage.setItem(\'universal-cart-v2\',JSON.stringify(cart));checkoutKey=null;quoteResult=null;}\nasync function api(path,options={}){const headers={\'X-CSRF-Token\':session.csrf||\'\',\'X-Language\':isAdmin?\'ru\':lang,...(options.headers||{})};if(options.body&&!(options.body instanceof FormData)){headers[\'Content-Type\']=\'application/json\';options.body=JSON.stringify(options.body);}const r=await fetch(path,{...options,headers,credentials:\'same-origin\'});const result=await r.json().catch(()=>({error:t(\'serverError\')}));if(!r.ok)throw new Error(result.error||t(\'requestError\'));return result;}\nfunction empty(title,text,action=\'\'){return `<div class="empty"><div class="empty-icon">${icon(\'products\')}</div><h2>${esc(title)}</h2><p>${esc(text)}</p>${action}</div>`;}\nfunction close(){if(busy)return;$(\'#modal\').close();editing=null;}\nfunction formError(e){if($(\'#form-error\'))$(\'#form-error\').textContent=e.message;else toast(e.message);}\nfunction header(title,text,action=\'\'){return `<div class="page-heading"><div><p class="eyebrow">${esc(text)}</p><h1>${esc(title)}</h1></div>${action}</div>`;}\nfunction categoryIds(id){const set=new Set([Number(id)]);for(let i=0;i<catalog.categories.length;i++)for(const c of catalog.categories)if(set.has(c.parent_id))set.add(c.id);return set;}\nfunction minPrice(p){return p.variants.length?Math.min(...p.variants.map(v=>v.price??p.price)):p.price;}\nfunction cartProduct(item){const p=catalog.products.find(p=>p.id===item.id);const v=p?.variants.find(v=>v.id===item.variant_id);return {p,v,price:v?.price??p?.price??0,stock:v?.stock??p?.stock??0,valid:!!p&&p.availability===\'available\'&&(!p.variants.length&&!item.variant_id||!!v)};}\nfunction captureDraft(){if($(\'#checkout-form\'))Object.assign(draft,Object.fromEntries(new FormData($(\'#checkout-form\'))));if($(\'#promo\'))draft.promo=$(\'#promo\').value.trim();}\nfunction chooseVariant(id){if(editing?.type!==\'preview\')return;const p=catalog.products.find(p=>p.id===editing.id),v=p.variants.find(v=>v.id===id);if(!v)return;editing.variantId=id;$$(\'.variant-option\').forEach(b=>b.classList.toggle(\'active\',b.dataset.id===id));$(\'#variant-price\').textContent=money(v.price??p.price);$(\'#add-selected\').disabled=!v.stock||p.availability!==\'available\';}\nfunction addCart(id,variant_id=\'\'){const {p,v,stock,valid}=cartProduct({id,variant_id});if(!valid||p.variants.length&&!v)throw new Error(t(\'chooseVariant\'));const line=cart.find(x=>x.id===id&&x.variant_id===variant_id);if((line?.quantity||0)+1>stock)throw new Error(t(\'cartStock\'));if(line)line.quantity++;else cart.push({id,variant_id,quantity:1});saveCart();renderStore();toast(t(\'added\'));}\n// Administration\nconst adminTabs={dashboard:\'Главная\',orders:\'Заказы\',products:\'Товары\',clients:\'Клиенты\',categories:\'Категории\',delivery:\'Доставка\',pickup:\'Самовывоз\',payments:\'Оплата\',statuses:\'Статусы\',promos:\'Промокоды\',banners:\'Баннеры\',languages:\'Языки\',settings:\'Настройки\',audit:\'Журнал\',referrals:\'Реферальная программа\',more:\'Ещё\'};\nfunction renderLogin(){$(\'#app\').innerHTML=`<main class="login-page"><form class="login-card panel" id="login-form">${brand()}<p class="eyebrow">Рабочее пространство</p><h1>Вход в админку</h1>${field(\'password\',\'Пароль администратора\',\'\',\'password\',\'required minlength="12" autocomplete="current-password"\')}${errorBox()}<button class="btn primary wide" type="submit">Войти ${icon(\'arrow\')}</button><a href="/">← Вернуться в магазин</a></form></main>`;}\nfunction categoriesAdmin(){return header(\'Категории\',\'Удобная структура каталога\',btn(icon(\'plus\')+\' Добавить категорию\',\'edit-category\',\'\',\'primary\'))+(admin.categories.length?`<div class="admin-cards">${admin.categories.map(c=>`<article class="panel category-admin">${c.image?photo(c.image,\'category-cover\'):`<span class="category-symbol">${esc(c.icon)||icon(\'categories\')}</span>`}<div><span class="eyebrow">Порядок: ${c.position} · ${c.hidden?\'Скрыта\':\'Активна\'}</span><h3>${esc(categoryPath(c,admin.categories))}</h3><p class="muted">${esc(c.description)}</p></div><div class="row">${btn(\'Редактировать\',\'edit-category\',c.id,\'secondary small\')}${btn(\'Удалить\',\'delete-category\',c.id,\'ghost small\')}</div></article>`).join(\'\')}</div>`:empty(\'Категорий пока нет\',\'Создайте свои категории или продавайте товары без них.\'));}\nfunction promosAdmin(){return header(\'Промокоды\',\'Повод вернуться\',btn(icon(\'plus\')+\' Добавить промокод\',\'edit-promo\',\'\',\'primary\'))+(admin.promos.length?`<div class="admin-cards">${admin.promos.map(p=>`<article class="panel"><div class="row spread"><h2>${esc(p.code)}</h2>${badge(p.enabled?\'active\':\'hidden\',p.enabled?\'Активный\':\'Выключен\')}</div><div class="promo-percent">−${p.percent}%</div><p>От ${money(p.minimum)}</p><p class="muted">Использовано ${p.used} из ${p.max_uses}</p>${btn(\'Редактировать\',\'edit-promo\',p.id,\'secondary\')}</article>`).join(\'\')}</div>`:empty(\'Создайте первый промокод\',\'Процент скидки, минимальная сумма и лимит использований.\'));}\nfunction editorFooter(form,extra=\'\'){return extra+btn(\'Отмена\',\'close\',\'\',\'secondary\')+`<button type="submit" form="${form}" class="btn primary">Сохранить</button>`;}\nfunction readPairs(root){const pairs={};for(const r of $$(\'.pair-row\',root)){const k=$(\'[data-key]\',r).value.trim(),v=$(\'[data-value]\',r).value.trim();if(!k||!v)throw new Error(\'Заполните название и значение\');if(Object.hasOwn(pairs,k))throw new Error(\'Название RUния характеристик повторяются\');Object.defineProperty(pairs,k,{value:v,enumerable:true});}return pairs;}\nfunction editProduct(id){const p=admin.products.find(x=>x.id===id)||{name:\'\',sku:\'\',price:0,old_price:0,description:\'\',traits:{},images:[],variants:[],category_ids:[],stock:0,status:\'active\',availability:\'available\'};editing={type:\'product\',id:id||0,revision:p.revision,images:[...p.images]};modal(id?\'Редактировать товар\':\'Новый товар\',`<form id="product-form"><div class="form-grid">${field(\'name\',\'Название RU\',p.name,\'text\',\'required maxlength="120"\')}${field(\'sku\',\'Артикул (можно оставить пустым)\',p.sku,\'text\',\'maxlength="100"\')}${field(\'price\',\'Цена\',(p.price/100).toFixed(2),\'number\',\'min="0" step="0.01" required\')}${field(\'old_price\',\'Старая цена / скидка\',p.old_price?(p.old_price/100).toFixed(2):\'\',\'number\',\'min="0" step="0.01"\')}${select(\'status\',\'Отображение\',[[\'active\',\'Активный\'],[\'hidden\',\'Скрытый\'],[\'archived\',\'Архив\']],p.status)}${select(\'availability\',\'Наличие\',[[\'available\',\'Доступен к заказу\'],[\'unavailable\',\'Недоступен\']],p.availability)}${field(\'stock\',\'Доступное количество (без вариантов)\',p.stock,\'number\',\'min="0" max="1000000" required\')}${area(\'description\',\'Описание RU\',p.description,\'maxlength="5000"\')}</div><div class="editor-section"><h3>Категории</h3><div class="category-checks">${admin.categories.map(c=>check(\'category-\'+c.id,esc(categoryPath(c,admin.categories)),p.category_ids.includes(c.id))).join(\'\')||\'<p class="muted">Категории создаются в отдельном разделе. Товар можно сохранить без категории.</p>\'}</div></div><div class="editor-section"><h3>Фотографии</h3><div class="photo-list" id="photo-list">${photosMarkup()}</div><label class="upload-zone" id="dropzone">${icon(\'plus\')} Добавить или перетащить фото<input type="file" id="product-images" accept="image/jpeg,image/png,image/webp" multiple></label><p class="tiny muted">До 10 фото, JPEG / PNG / WebP, до 12 МБ. Первое фото — обложка.</p></div><div class="editor-section"><div class="row spread"><h3>Характеристики</h3>${btn(\'+ Добавить\',\'add-trait\',\'\',\'secondary small\')}</div><div id="traits-list">${Object.entries(p.traits).map(([k,v])=>pairRow(k,v)).join(\'\')}</div></div><div class="editor-section"><div class="row spread"><h3>Варианты товара</h3>${btn(\'+ Вариант\',\'add-variant\',\'\',\'secondary small\')}</div><p class="tiny muted">Задайте свои параметры и значения. Во всех вариантах используйте одинаковые названия параметров. Пустая цена означает основную цену товара.</p><div id="variants-list">${p.variants.map(variantRow).join(\'\')}</div></div><div class="row wrap">${check(\'featured\',\'Рекомендуемый\',p.featured)}${check(\'is_new\',\'Отметка «Новинка»\',p.is_new)}</div>${errorBox()}</form>`,editorFooter(\'product-form\',id?btn(\'Архивировать\',\'archive-product\',id,\'danger\'):\'\'));}\nfunction photosMarkup(){return editing.images.map((im,i)=>`<div class="photo-editor">${photo(im)}<div>${btn(\'←\',\'photo-left\',i,\'icon-btn\',`aria-label="Переместить фото влево" ${i===0?\'disabled\':\'\'}`)}${btn(\'→\',\'photo-right\',i,\'icon-btn\',`aria-label="Переместить фото вправо" ${i===editing.images.length-1?\'disabled\':\'\'}`)}${btn(\'×\',\'photo-delete\',i,\'icon-btn\',\'aria-label="Удалить фото"\')}</div></div>`).join(\'\');}\nfunction editCategory(id){const c=admin.categories.find(c=>c.id===id)||{};editing={type:\'category\',id:id||0};modal(id?\'Редактировать категорию\':\'Новая категория\',`<form id="category-form"><div class="form-grid">${field(\'name\',\'Название RU\',c.name||\'\',\'text\',\'required maxlength="120"\')}${field(\'icon\',\'Иконка / эмодзи\',c.icon||\'\',\'text\',\'maxlength="24"\')}${select(\'parent_id\',\'Родительская категория\',[[\'\',\'Без родительской категории\'],...admin.categories.filter(x=>x.id!==id).map(x=>[x.id,categoryPath(x,admin.categories)])],c.parent_id||\'\')}${field(\'position\',\'Порядок отображения\',c.position||0,\'number\',\'required min="0"\')}${area(\'description\',\'Описание RU\',c.description||\'\',\'maxlength="2000"\')}</div><label class="field">Изображение<div id="category-preview">${c.image?photo(c.image,\'brand-preview\'):\'\'}</div><input type="hidden" name="image" value="${esc(c.image||\'\')}"><input type="file" id="category-image" accept="image/jpeg,image/png,image/webp"></label>${btn(\'Убрать изображение\',\'clear-category-image\',\'\',\'ghost small\')}${check(\'hidden\',\'Скрыть вместе с подкатегориями\',c.hidden)}${errorBox()}</form>`,editorFooter(\'category-form\'));}\nfunction editPromo(id){const p=admin.promos.find(x=>x.id===id)||{percent:10,minimum:0,max_uses:100,enabled:true};editing={type:\'promo\',id:id||0};modal(\'Промокод\',`<form id="promo-form"><div class="form-grid">${field(\'code\',\'Код\',p.code||\'\',\'text\',\'required maxlength="40" pattern="[A-Za-z0-9_-]{2,40}"\')}${field(\'percent\',\'Скидка, %\',p.percent,\'number\',\'required min="1" max="100"\')}${field(\'minimum\',\'Минимальная сумма\',p.minimum/100,\'number\',\'required min="0" step="0.01"\')}${field(\'max_uses\',\'Лимит использований\',p.max_uses,\'number\',\'required min="1"\')}</div>${check(\'enabled\',\'Активный\',p.enabled)}${errorBox()}</form>`,editorFooter(\'promo-form\'));}\nfunction editPickup(id){const p=admin.pickup_points.find(x=>x.id===id)||{active:true};editing={type:\'pickup\',id:id||0};modal(\'Точка самовывоза\',`<form id="pickup-form"><div class="form-grid">${field(\'name\',\'Название RUние точки RU\',p.name||\'\',\'text\',\'required maxlength="200"\')}${field(\'city\',\'Город RU\',p.city||\'\',\'text\',\'required maxlength="200"\')}${field(\'address\',\'Адрес RU\',p.address||\'\',\'text\',\'required maxlength="200"\')}${field(\'hours\',\'Часы работы RU\',p.hours||\'\',\'text\',\'maxlength="200"\')}${field(\'map_url\',\'Ссылка на карту\',p.map_url||\'\',\'url\',\'pattern="https://.*" maxlength="200"\')}${area(\'description\',\'Дополнительная информация RU\',p.description||\'\',\'maxlength="2000"\')}</div>${check(\'active\',\'Активна\',p.active)}${errorBox()}</form>`,editorFooter(\'pickup-form\'));}\nasync function uploadOne(file){const form=new FormData();form.append(\'file\',file);return api(\'/api/admin/upload\',{method:\'POST\',body:form});}\nasync function uploadPhotos(files){if(!editing||editing.type!==\'product\')return;if(editing.images.length+files.length>10)throw new Error(\'Можно добавить до 10 фото\');busy=true;setBusy();try{for(const f of files){const result=await uploadOne(f);editing.images.push(result.id);$(\'#photo-list\').innerHTML=photosMarkup();}}finally{busy=false;setBusy();}}\nfunction setBusy(){$$(\'button[type="submit"], input[type="file"]\').forEach(b=>b.disabled=busy);if($(\'#place-order\'))$(\'#place-order\').disabled=busy||!quoteResult||!!quoteResult.minimum_remaining||!draft.payment_id;}\nasync function refreshAdmin(){await loadAdmin();renderAdmin();}\ndocument.addEventListener(\'click\',async e=>{const b=e.target.closest(\'[data-action]\');if(!b)return;e.preventDefault();if(busy)return;const a=b.dataset.action,id=Number(b.dataset.id);try{\n if(a===\'close\')close();\n else if(a===\'view\'){captureDraft();view=b.dataset.id;await loadCatalog();renderStore();window.scrollTo({top:0,behavior:\'smooth\'});}\n else if(a===\'category\'){category=b.dataset.id;view=\'products\';renderStore();}\n else if(a===\'reset-filters\'){filters={};search=\'\';category=\'\';renderStore();}\n else if(a===\'product\')productModal(id);\n else if(a===\'quick-add\'){const p=catalog.products.find(p=>p.id===id);if(p.variants.length)productModal(id);else addCart(id);}\n else if(a===\'quick-variant\')productModal(id,b.dataset.variant);\n else if(a===\'choose-variant\')chooseVariant(b.dataset.id);\n else if(a===\'add-selected\'){addCart(id,editing.variantId);close();}\n else if(a===\'gallery\'){const p=catalog.products.find(p=>p.id===editing.id);editing.index=id;$(\'#detail-image\').innerHTML=photo(p.images[id],\'\',p.name);}\n else if(a===\'remove-cart\'||a===\'quantity\'){captureDraft();if(a===\'remove-cart\')cart.splice(id,1);else{cart[id].quantity+=Number(b.dataset.delta);if(cart[id].quantity<1)cart.splice(id,1);}saveCart();renderStore();}\n else if(a===\'clear-cart\'){if(confirm(t(\'clearConfirm\'))){cart=[];saveCart();renderStore();}}\n else if(a===\'apply-promo\')await refreshQuote();\n else if(a===\'tab\'){tab=b.dataset.id;await refreshAdmin();}\n else if(a===\'logout\'){session=await api(\'/api/logout\',{method:\'POST\',body:{}});admin=null;renderLogin();}\n else if(a===\'edit-product\')editProduct(id);\n else if(a===\'edit-category\')editCategory(id);\n else if(a===\'edit-promo\')editPromo(id);\n else if(a===\'edit-pickup\')editPickup(id);\n else if(a===\'edit-rate\')editRate(id);\n else if(a===\'edit-order\')editOrder(id);\n else if(a===\'archive-product\'||a.startsWith(\'delete-\')){const paths={\'archive-product\':\'products\',\'delete-category\':\'categories\',\'delete-pickup\':\'pickup-points\',\'delete-rate\':\'shipping-rates\'};if(!paths[a])return;if(confirm(a===\'archive-product\'?\'Архивировать товар?\':\'Удалить запись? История заказов сохранится.\')){await api(\'/api/admin/\'+paths[a]+\'/\'+id,{method:\'DELETE\'});close();await refreshAdmin();toast(\'Готово\');}}\n else if(a===\'add-trait\')$(\'#traits-list\').insertAdjacentHTML(\'beforeend\',pairRow());\n else if(a===\'remove-row\')b.closest(\'.pair-row\').remove();\n else if(a===\'add-variant\')$(\'#variants-list\').insertAdjacentHTML(\'beforeend\',variantRow());\n else if(a===\'add-option\')$(\'.variant-pairs\',b.closest(\'.variant-editor\')).insertAdjacentHTML(\'beforeend\',pairRow());\n else if(a===\'remove-variant\')b.closest(\'.variant-editor\').remove();\n else if(a.startsWith(\'photo-\')){if(a===\'photo-delete\')editing.images.splice(id,1);else{const to=id+(a===\'photo-left\'?-1:1);[editing.images[id],editing.images[to]]=[editing.images[to],editing.images[id]];}$(\'#photo-list\').innerHTML=photosMarkup();}\n else if(a===\'clear-category-image\'){$(\'#category-form\').elements.image.value=\'\';$(\'#category-preview\').innerHTML=\'\';}\n else if(a===\'clear-brand\'){const k=b.dataset.id;$(\'#settings-form\').elements[k].value=\'\';$(\'#\'+k+\'-preview\').innerHTML=\'\';}\n }catch(err){formError(err);}});\nlet quoteTimer;\ndocument.addEventListener(\'input\',e=>{const el=e.target;if(el.id===\'search\'){search=el.value;$(\'#product-grid\').innerHTML=cards(matchingProducts());$(\'#results-count\').textContent=t(\'count\',{n:matchingProducts().length});}if(el.id===\'admin-search\'){adminSearch=el.value;$(\'#admin-list\').innerHTML=productTable();}if(el.closest(\'#checkout-form\')||el.id===\'promo\'){captureDraft();checkoutKey=null;quoteResult=null;++quoteSequence;if($(\'#place-order\'))$(\'#place-order\').disabled=true;clearTimeout(quoteTimer);quoteTimer=setTimeout(refreshQuote,350);}});\ndocument.addEventListener(\'change\',async e=>{const el=e.target;try{\n if(el.dataset.filter!==undefined){filters[el.dataset.filter]=el.value;$(\'#product-grid\').innerHTML=cards(matchingProducts());$(\'#results-count\').textContent=t(\'count\',{n:matchingProducts().length});}\n if(el.id===\'sort\'){sorting=el.value;$(\'#product-grid\').innerHTML=cards(matchingProducts());}\n if(el.id===\'order-filter\'){orderFilter=el.value;$(\'#admin-list\').innerHTML=orderTable(admin.orders.filter(o=>!orderFilter||o.status===orderFilter));}\n if(el.name===\'mode\'){captureDraft();$(\'#fulfillment-fields\').innerHTML=fulfillmentFields();checkoutKey=null;await refreshQuote();}\n else if(el.closest(\'#checkout-form\')){captureDraft();checkoutKey=null;await refreshQuote();}\n if(el.id===\'product-images\')await uploadPhotos([...el.files]);\n if((el.id===\'category-image\'||el.dataset.branding)&&el.files[0]){busy=true;setBusy();const uploaded=await uploadOne(el.files[0]);if(el.id===\'category-image\'){$(\'#category-form\').elements.image.value=uploaded.id;$(\'#category-preview\').innerHTML=photo(uploaded.id,\'brand-preview\');}else{const key=el.dataset.branding;$(\'#settings-form\').elements[key].value=uploaded.id;$(\'#\'+key+\'-preview\').innerHTML=photo(uploaded.id,\'brand-preview\');}busy=false;setBusy();}\n }catch(err){busy=false;setBusy();formError(err);}});\ndocument.addEventListener(\'dragover\',e=>{if(e.target.closest(\'#dropzone\'))e.preventDefault();});\ndocument.addEventListener(\'drop\',async e=>{if(e.target.closest(\'#dropzone\')){e.preventDefault();if(busy)return;try{await uploadPhotos([...e.dataTransfer.files]);}catch(err){formError(err);}}});\n$(\'#modal\').addEventListener(\'cancel\',e=>{if(busy)e.preventDefault();else editing=null;});\ndocument.addEventListener(\'submit\',async e=>{e.preventDefault();if(busy)return;const form=e.target;if(!form.reportValidity())return;const values=Object.fromEntries(new FormData(form));busy=true;setBusy();if($(\'#form-error\'))$(\'#form-error\').textContent=\'\';try{\n if(form.id===\'login-form\'){session=await api(\'/api/login\',{method:\'POST\',body:values});await loadAdmin();renderAdmin();return;}\n if(form.id===\'checkout-form\'){captureDraft();checkoutKey=checkoutKey||crypto.randomUUID();const o=await api(\'/api/orders\',{method:\'POST\',body:{items:cart,promo:draft.promo||\'\',fulfillment:draft,payment_id:draft.payment_id,language:lang,use_bonus:!!draft.use_bonus,request_key:checkoutKey}});cart=[];saveCart();draft={};checkoutStep=0;await loadCatalog();view=\'orders\';renderStore();modal(t(\'orderCreated\',{id:o.id}),`<div class="success-mark">${icon(\'check\')}</div><p class="notice">${esc(loc(catalog.settings,\'payment_info\'))}</p>${orderDetails(o)}`,btn(t(\'done\'),\'close\',\'\',\'primary\'));return;}\n let path=\'\',payload=values,method=editing?.id?\'PUT\':\'POST\';\n if(form.id===\'product-form\'){payload={...values,expected_revision:editing.revision,traits:readPairs($(\'#traits-list\')),traits_de:readTranslations($(\'#traits-list\')),category_ids:admin.categories.filter(c=>form.elements[\'category-\'+c.id].checked).map(c=>c.id),images:editing.images,variants:$$(\'.variant-editor\').map(el=>({id:el.dataset.variantId,options:readPairs($(\'.variant-pairs\',el)),options_de:readTranslations($(\'.variant-pairs\',el)),stock:$(\'[data-stock]\',el).value,price:$(\'[data-price]\',el).value})),featured:form.elements.featured.checked,is_new:form.elements.is_new.checked};path=\'products\';}\n if(form.id===\'category-form\'){payload={...values,hidden:form.elements.hidden.checked};path=\'categories\';}\n if(form.id===\'promo-form\'){payload={...values,enabled:form.elements.enabled.checked};path=\'promos\';}\n if(form.id===\'pickup-form\'){payload={...values,active:form.elements.active.checked};path=\'pickup-points\';}\n if(form.id===\'rate-form\'){payload={...values,active:form.elements.active.checked,inherit_free_shipping:form.elements.inherit_free_shipping.checked};path=\'shipping-rates\';}\n if(form.id===\'order-form\'){path=\'orders\';method=\'PATCH\';}\n if(form.id===\'settings-form\'||form.id===\'delivery-form\'){path=\'settings\';method=\'PUT\';if(form.id===\'delivery-form\')payload={...values,delivery_enabled:form.elements.delivery_enabled.checked,free_shipping_enabled:form.elements.free_shipping_enabled.checked};}\n if(form.id===\'settings-form\')payload.links=$$(\'.link-editor\',form).map(row=>({name:$(\'[data-link-name]\',row).value,name_de:$(\'[data-link-de]\',row).value,url:$(\'[data-link-url]\',row).value}));\n if(!path)return;\n await api(\'/api/admin/\'+path+(editing?.id&&path!==\'settings\'?\'/\'+editing.id:\'\'),{method,body:payload});busy=false;close();await refreshAdmin();toast(\'Изменения сохранены\');\n }catch(err){formError(err);}finally{busy=false;setBusy();}});\nasync function boot(){try{session=await api(\'/api/session\');const tg=window.Telegram?.WebApp;if(tg?.initData){session=await api(\'/api/telegram\',{method:\'POST\',body:{initData:tg.initData}});tg.ready();tg.expand();}await loadCatalog();if(isAdmin){if(session.admin){await loadAdmin();renderAdmin();}else renderLogin();}else renderStore();}catch(e){$(\'#app\').innerHTML=empty(t(\'loadError\'),e.message,`<a class="btn primary" href="/">${t(\'reload\')}</a>`);}}\n// Changes in another admin window become visible without restarting the application.\nsetInterval(async()=>{if(isAdmin||document.hidden||busy||$(\'#modal\').open)return;try{await loadCatalog();if(renderedCatalog!==JSON.stringify(catalog)){if(view===\'home\'||view===\'products\'){if(![\'INPUT\',\'SELECT\',\'TEXTAREA\'].includes(document.activeElement?.tagName))renderStore();}else if(view===\'cart\'){renderedCatalog=JSON.stringify(catalog);await refreshQuote();}}}catch{}},5000);\n', 'features.js': '\'use strict\';\nlet checkoutStep=0,bannerIndex=0,productAdminFilter=\'\',orderSearch=\'\',customerSearch=\'\';\nfunction languageSwitch(){return `<div class="language-switch" aria-label="${t(\'language\')}">${[\'ua\',\'ru\'].map(l=>`<button type="button" data-action="language" data-id="${l}" class="${lang===l?\'active\':\'\'}" aria-pressed="${lang===l}">${l.toUpperCase()}</button>`).join(\'\')}</div>`;}\nfunction applySettings(){const s=catalog.settings;for(const [key,variable]of [[\'accent\',\'--accent\'],[\'accent_secondary\',\'--secondary\'],[\'background\',\'--paper\'],[\'text_color\',\'--ink\']])if(s[key])document.documentElement.style.setProperty(variable,s[key]);document.documentElement.lang=isAdmin?\'ru\':lang;document.title=loc(s);let fav=$(\'link[rel=icon]\');if(fav)fav.href=s.favicon?imageUrl(s.favicon):\'/assets/mark.svg\';statusNames=Object.fromEntries((catalog.order_statuses||[]).map(s=>[s.code,isAdmin?s.name:loc(s)]));}\nasync function loadCatalog(){catalog=await api(\'/api/catalog\');if(!languageChosen)lang=catalog.settings.default_language||\'ru\';applySettings();}\nasync function loadAdmin(){admin=await api(\'/api/admin/data\');catalog.settings=admin.settings;catalog.order_statuses=admin.order_statuses;applySettings();}\nfunction brand(){return `<a class="brand" href="/">${catalog.settings.logo?photo(catalog.settings.logo,\'brand-logo\'):\'<span class="brand-mark">\'+icon(\'products\')+\'</span>\'}<span>${esc(isAdmin?catalog.settings.name:loc(catalog.settings))}</span></a>`;}\nfunction toast(message){$(\'#toast\').textContent=frontMessage(message);$(\'#toast\').classList.add(\'show\');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$(\'#toast\').classList.remove(\'show\'),3600);}\nfunction modal(title,body,footer=\'\'){const d=$(\'#modal\');d.innerHTML=`<header class="modal-head"><h2>${esc(title)}</h2>${btn(\'×\',\'close\',\'\',\'icon-btn\',`aria-label="${isAdmin?\'Закрыть\':t(\'close\')}"`)}</header><div class="modal-body">${body}</div>${footer?`<footer class="modal-footer">${footer}</footer>`:\'\'}`;if(!d.open)d.showModal();}\nfunction categoryPath(c,source=catalog.categories){let names=[isAdmin?c.name:loc(c)],seen=new Set([c.id]),id=c.parent_id;while(id){const p=source.find(x=>x.id===id);if(!p||seen.has(id))break;seen.add(id);names.unshift(isAdmin?p.name:loc(p));id=p.parent_id;}return names.join(\' / \');}\nfunction matchingProducts(){const cats=category?categoryIds(category):null;return catalog.products.filter(p=>(!cats||p.category_ids.some(id=>cats.has(id)))&&(!search||[loc(p),loc(p,\'description\'),p.sku,...translatedPairs(p.traits,p.traits_de).flat(),...p.variants.map(optionsText)].join(\' \').toLocaleLowerCase().includes(search.toLocaleLowerCase()))&&Object.entries(filters).every(([k,v])=>!v||p.traits[k]===v||p.variants.some(x=>x.options[k]===v))&&(!Object.entries(filters).some(([k,v])=>v&&p.variants.some(x=>k in x.options))||p.variants.some(v=>Object.entries(filters).every(([k,val])=>!val||!(k in v.options)||v.options[k]===val)))).sort((a,b)=>sorting===\'price-up\'?minPrice(a)-minPrice(b):sorting===\'price-down\'?minPrice(b)-minPrice(a):sorting===\'name\'?loc(a).localeCompare(loc(b),locale()):b.id-a.id);}\nfunction filterMarkup(){const list=new Map();for(const p of catalog.products)for(const [traits,de]of [[p.traits,p.traits_de],...p.variants.map(v=>[v.options,v.options_de])])for(const [k,val]of Object.entries(traits)){if(!list.has(k))list.set(k,{name:lang===\'de\'?de?.[k]?.name||k:k,values:new Map()});list.get(k).values.set(val,lang===\'de\'?de?.[k]?.value||val:val);}return [...list].map(([k,x])=>select(\'\',esc(x.name),[[\'\',t(\'all\')],...[...x.values]],filters[k]||\'\',`data-filter="${esc(k)}"`)).join(\'\');}\nfunction cards(products){return products.length?products.map(p=>`<article class="product-card"><button class="product-image" data-action="product" data-id="${p.id}" aria-label="${esc(loc(p))}">${photo(p.images[0],\'\',loc(p))}<span class="card-badges">${p.is_new?badge(\'new\',t(\'new\')):\'\'}${p.discount_percent?badge(\'sale\',\'−\'+p.discount_percent+\'%\'):\'\'}</span>${!p.stock||p.availability!==\'available\'?`<span class="stock-label">${t(\'out\')}</span>`:\'\'}</button><div class="card-info"><small>${esc(loc(catalog.categories.find(c=>p.category_ids.includes(c.id))))}</small><button class="product-name" data-action="product" data-id="${p.id}">${esc(loc(p))}</button><div class="card-price"><b>${p.variants.some(v=>v.price!==null&&v.price!==p.price)?t(\'from\')+\' \':\'\'}${money(minPrice(p))}</b>${p.old_price>minPrice(p)?`<del>${money(p.old_price)}</del>`:\'\'}${btn(icon(\'plus\'),\'quick-add\',p.id,\'add-btn\',`aria-label="${t(\'add\')}" `+(!p.stock||p.availability!==\'available\'?\'disabled\':\'\'))}</div>${p.variants.length?`<div class="variant-preview">${p.variants.slice(0,4).map(v=>`<button type="button" data-action="quick-variant" data-id="${p.id}" data-variant="${esc(v.id)}" ${v.stock&&p.availability===\'available\'?\'\':\'disabled\'}>${esc(translatedPairs(v.options,v.options_de).map(x=>x[1]).join(\' / \'))}</button>`).join(\'\')}${p.variants.length>4?btn(\'+\'+(p.variants.length-4),\'product\',p.id,\'ghost small\'):\'\'}</div>`:\'\'}</div></article>`).join(\'\'):empty(t(search||category||Object.values(filters).some(Boolean)?\'noResults\':\'noProducts\'),t(search||category||Object.values(filters).some(Boolean)?\'noResultsText\':\'noProductsText\'));}\nfunction categoriesMarkup(){return catalog.categories.length?`<div class="category-strip">${btn(t(\'all\'),\'category\',\'\',\'chip \'+(!category?\'active\':\'\'))}${catalog.categories.map(c=>btn(`${c.image?photo(c.image,\'category-thumb\'):esc(c.icon)} ${esc(categoryPath(c))}`,\'category\',c.id,\'chip \'+(String(c.id)===String(category)?\'active\':\'\'))).join(\'\')}</div>`:\'\';}\nfunction catalogMarkup(){const selected=catalog.categories.find(c=>String(c.id)===String(category));return `<section class="catalog-section" id="catalog"><div class="section-heading"><div><p class="eyebrow">${t(\'find\')}</p><h2>${esc(selected?loc(selected):t(\'catalog\'))}</h2>${selected?`<p class="muted">${esc(loc(selected,\'description\'))}</p>`:\'\'}</div><span id="results-count" class="muted">${t(\'count\',{n:matchingProducts().length})}</span></div>${categoriesMarkup()}<div class="catalog-tools"><label class="search">${icon(\'search\')}<input id="search" placeholder="${t(\'search\')}" value="${esc(search)}" aria-label="${t(\'search\')}"></label>${select(\'sort\',t(\'sort\'),[[\'new\',t(\'newFirst\')],[\'price-up\',t(\'priceUp\')],[\'price-down\',t(\'priceDown\')],[\'name\',t(\'byName\')]],sorting,\'id="sort"\')}</div>${filterMarkup()?`<details class="filters" ${Object.values(filters).some(Boolean)?\'open\':\'\'}><summary>${t(\'filters\')} <span>＋</span></summary><div class="filter-grid">${filterMarkup()}${btn(t(\'reset\'),\'reset-filters\',\'\',\'ghost\')}</div></details>`:\'\'}<div class="product-grid" id="product-grid">${cards(matchingProducts())}</div></section>`;}\nfunction homeMarkup(){const s=catalog.settings,slides=(s.banners||[]).filter(b=>b.active),b=slides[bannerIndex%Math.max(1,slides.length)],image=b?.image||s.banner;return `<section class="hero ${image?\'has-banner\':\'\'}">${image?photo(image,\'hero-photo\'):\'<div class="hero-art" aria-hidden="true"><div class="orb orb-one"></div><div class="orb orb-two"></div><span class="art-mark">↗</span></div>\'}<div class="hero-copy"><span class="hero-label">${esc(loc(s,\'subtitle\'))}</span><h1>${esc(b?loc(b,\'title\')||loc(s,\'hero_title\'):loc(s,\'hero_title\'))}</h1><p>${esc(b?loc(b,\'text\'):loc(s,\'hero_text\'))}</p>${b?.url?`<a class="btn dark" href="${esc(b.url)}" target="_blank" rel="noopener">${t(\'visit\')} ${icon(\'arrow\')}</a>`:btn(t(\'toCatalog\')+\' \'+icon(\'arrow\'),\'view\',\'products\',\'dark\')}</div>${slides.length>1?`<div class="banner-dots">${slides.map((x,i)=>btn(\'●\',\'banner-slide\',i,\'dot-button \'+(i===bannerIndex%slides.length?\'active\':\'\'),`aria-label="${t(\'banner\',{n:i+1})}"`)).join(\'\')}</div>`:\'\'}</section><div class="store-benefits"><span>${icon(\'products\')} ${t(\'online\')}</span>${s.delivery_enabled?`<span>${icon(\'delivery\')} ${t(\'delivery\')}</span>`:\'\'}${s.pickup_enabled&&catalog.pickup_points.length?`<span>${icon(\'pin\')} ${t(\'pickup\')}</span>`:\'\'}</div>${catalogMarkup()}`;}\nfunction supportLink(){return catalog.settings.support?`<a href="https://t.me/${esc(catalog.settings.support.slice(1))}" target="_blank" rel="noopener">${t(\'support\')} ↗</a>`:\'\';}\nfunction renderStore(){renderedCatalog=JSON.stringify(catalog);applySettings();const screens={home:homeMarkup,products:catalogMarkup,cart:cartMarkup,profile:profileMarkup,orders:()=>`<div id="order-history"><p class="muted">${t(\'loadingOrders\')}</p></div>`},nav=[\'home\',\'products\',\'cart\',\'profile\',\'orders\'];$(\'#app\').innerHTML=`<div class="announcement">${esc(loc(catalog.settings,\'subtitle\'))}</div><header class="store-header">${brand()}<nav class="desktop-nav">${nav.filter(x=>x!==\'cart\').map(k=>btn(t(k),\'view\',k,\'nav-link \'+(view===k?\'active\':\'\'))).join(\'\')}</nav><div class="row">${languageSwitch()}${btn(icon(\'cart\')+`<span class="cart-count">${count()}</span>`,\'view\',\'cart\',\'header-cart\',`aria-label="${t(\'cart\')}"`)}</div></header><main class="store-main">${screens[view]()}</main><footer class="store-footer">${brand()}<div><p>${esc(loc(catalog.settings,\'description\'))||t(\'footer\')}</p><p>${esc(loc(catalog.settings,\'contact_text\'))}</p></div>${supportLink()}${(catalog.settings.links||[]).map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(loc(l))} ↗</a>`).join(\'\')}<a href="/admin">${t(\'manage\')}</a></footer><nav class="bottom-nav" aria-label="${t(\'home\')}">${nav.map(k=>`<button type="button" class="${view===k?\'active\':\'\'}" data-action="view" data-id="${k}" ${view===k?\'aria-current="page"\':\'\'}><span>${icon(k)}${k===\'cart\'&&count()?`<i>${count()}</i>`:\'\'}</span><small>${t(k)}</small></button>`).join(\'\')}</nav>`;if(view===\'orders\')loadOrders();if(view===\'cart\'&&cart.length)refreshQuote();}\nfunction profileMarkup(){return header(t(\'yourProfile\'),t(\'nearby\'))+`<section class="profile-card panel"><div class="profile-avatar">${icon(\'profile\')}</div><h2>${esc(session.user?.first_name||t(\'guest\'))}</h2><p class="muted">${session.user?.username?\'@\'+esc(session.user.username):session.user?\'Telegram\':t(\'guestTitle\')}</p><p>${t(session.user?\'tgHistory\':\'webHistory\')}</p>${btn(t(\'myOrders\')+\' \'+icon(\'arrow\'),\'view\',\'orders\',\'primary\')}<div class="profile-language"><h3>${t(\'language\')}</h3>${languageSwitch()}<p class="muted tiny">${t(\'chooseLanguage\')}</p></div>${session.admin?\'<a class="btn secondary wide" href="/admin">\'+t(\'manage\')+\'</a>\':\'\'}${supportLink()}</section>`;}\nfunction cartLines(){return `<div class="cart-list">${cart.map((item,i)=>{const {p,v,price,valid,stock}=cartProduct(item);return `<article class="cart-item">${photo(p?.images[0],\'cart-photo\',p?loc(p):t(\'out\'))}<div class="cart-info"><h3>${esc(p?loc(p):t(\'out\'))}</h3><p class="muted">${esc(v?optionsText(v):\'\')}</p><b>${money(price)}</b>${!valid||stock<item.quantity?`<p class="error">${t(\'unavailable\')}</p>`:\'\'}<div class="quantity">${btn(\'−\',\'quantity\',i,\'icon-btn\',`data-delta="-1" aria-label="${t(\'less\')}"`)}<span>${item.quantity}</span>${btn(\'+\',\'quantity\',i,\'icon-btn\',`data-delta="1" aria-label="${t(\'more\')}" ${!valid||item.quantity>=stock?\'disabled\':\'\'}`)}</div></div>${btn(\'×\',\'remove-cart\',i,\'icon-btn\',`aria-label="${t(\'remove\')}"`)}</article>`;}).join(\'\')}</div>`;}\nfunction initDraft(){const s=catalog.settings;if(!draft.mode)draft.mode=s.delivery_enabled&&catalog.shipping_rates.length?\'delivery\':\'pickup\';if(!draft.rate_id&&catalog.shipping_rates.length)draft.rate_id=String(catalog.shipping_rates[0].id);if(!draft.point_id&&catalog.pickup_points.length)draft.point_id=String(catalog.pickup_points[0].id);if(!draft.payment_id&&catalog.payment_methods.length)draft.payment_id=String(catalog.payment_methods[0].id);}\nfunction cartMarkup(){if(!cart.length)return header(t(\'cart\'),t(\'finds\'))+empty(t(\'emptyCart\'),t(\'emptyCartText\'),btn(t(\'toCatalog\'),\'view\',\'products\',\'primary\'));initDraft();return header(t(\'cart\'),t(\'finds\'),btn(t(\'clear\'),\'clear-cart\',\'\',\'ghost\'))+`<div class="checkout-layout"><section>${cartLines()}<form id="checkout-form" class="panel checkout-form" novalidate><nav class="checkout-steps" aria-label="${t(\'place\')}">${[\'receive\',\'details\',\'payment\',\'review\'].map((key,i)=>`<button type="button" data-action="checkout-step" data-id="${i}" ${i>checkoutStep?\'disabled\':\'\'} class="${i===checkoutStep?\'active\':i<checkoutStep?\'complete\':\'\'}"><span>${i<checkoutStep?\'✓\':i+1}</span><small>${t(key)}</small></button>`).join(\'\')}</nav><div class="step-content">${checkoutStepMarkup()}</div>${errorBox()}<div class="wizard-buttons">${checkoutStep>0?btn(\'← \'+t(\'back\'),\'checkout-back\',\'\',\'secondary\'):\'\'}${checkoutStep<3?btn(t(\'next\')+\' \'+icon(\'arrow\'),\'checkout-next\',\'\',\'primary\'):\'\'}</div></form></section><aside class="checkout-summary panel"><h2>${t(\'yourOrder\')}</h2><div class="promo-control">${field(\'promo\',t(\'promo\'),draft.promo||\'\',\'text\',\'id="promo" maxlength="40"\')}${btn(t(\'apply\'),\'apply-promo\',\'\',\'secondary\')}</div><div id="quote-summary"><p class="muted">${t(\'calculating\')}</p></div><p class="payment-note">${esc(loc(catalog.settings,\'payment_info\'))}</p>${checkoutStep===3?`<button type="submit" form="checkout-form" id="place-order" class="btn primary wide" disabled>${t(\'place\')} ${icon(\'arrow\')}</button>`:\'\'}<p class="muted tiny">${t(\'paymentNote\')}</p></aside></div>`;}\nfunction checkoutStepMarkup(){const c=catalog.settings;if(checkoutStep===0)return `<h2>${t(\'howReceive\')}</h2><div class="fulfillment-switch">${c.delivery_enabled?`<label><input type="radio" name="mode" value="delivery" ${draft.mode===\'delivery\'?\'checked\':\'\'}>${icon(\'delivery\')} ${t(\'delivery\')}</label>`:\'\'}${c.pickup_enabled?`<label><input type="radio" name="mode" value="pickup" ${draft.mode===\'pickup\'?\'checked\':\'\'}>${icon(\'pin\')} ${t(\'pickup\')}</label>`:\'\'}</div><div id="fulfillment-fields">${fulfillmentFields()}</div>`;if(checkoutStep===1)return `<h2>${t(\'yourData\')}</h2><div class="form-grid">${field(\'first_name\',t(\'firstName\'),draft.first_name||session.user?.first_name||\'\',\'text\',\'required autocomplete="given-name" maxlength="160"\')}${field(\'last_name\',t(\'lastName\'),draft.last_name||\'\',\'text\',\'required autocomplete="family-name" maxlength="160"\')}${field(\'contact\',t(\'contact\'),draft.contact||(session.user?.username?\'@\'+session.user.username:\'\'),\'text\',\'required autocomplete="tel" maxlength="160"\')}${draft.mode===\'delivery\'?`${field(\'city\',t(\'city\'),draft.city||\'\',\'text\',\'required autocomplete="address-level2" maxlength="120"\')}${field(\'postal_code\',t(\'postal\'),draft.postal_code||\'\',\'text\',\'required autocomplete="postal-code" maxlength="30"\')}${field(\'street\',t(\'street\'),draft.street||\'\',\'text\',\'required autocomplete="address-line1" maxlength="180"\')}${field(\'house\',t(\'house\'),draft.house||\'\',\'text\',\'required maxlength="30"\')}${field(\'apartment\',t(\'apartment\'),draft.apartment||\'\',\'text\',\'maxlength="30"\')}`:`<div class="notice full">${pointSummary()}</div>`}</div>${area(\'comment\',t(\'comment\'),draft.comment||\'\',\'maxlength="1000"\')}`;if(checkoutStep===2)return `<h2>${t(\'choosePay\')}</h2><div class="method-list">${catalog.payment_methods.map(m=>`<label class="method-card"><input type="radio" name="payment_id" value="${m.id}" ${String(m.id)===String(draft.payment_id)?\'checked\':\'\'} required><span><b>${esc(loc(m))}</b><small>${esc(loc(m,\'description\'))}</small><p class="description">${esc(loc(m,\'instructions\'))}</p></span></label>`).join(\'\')||`<p class="error">${t(\'noPayment\')}</p>`}</div>`;return `<h2>${t(\'checkOrder\')}</h2><div class="review-block"><div class="row spread"><b>${t(\'receive\')}</b>${btn(t(\'edit\'),\'checkout-step\',0,\'ghost small\')}</div><p>${t(draft.mode)}</p><p>${draft.mode===\'pickup\'?pointSummary():esc(loc(catalog.shipping_rates.find(r=>String(r.id)===String(draft.rate_id))))}</p></div><div class="review-block"><div class="row spread"><b>${t(\'details\')}</b>${btn(t(\'edit\'),\'checkout-step\',1,\'ghost small\')}</div><p>${esc([draft.first_name,draft.last_name].join(\' \'))}</p><p>${esc(draft.contact)}</p>${draft.mode===\'delivery\'?`<p>${esc([draft.city,draft.postal_code,draft.street,draft.house,draft.apartment].filter(Boolean).join(\', \'))}</p>`:\'\'}<p>${esc(draft.comment)}</p></div><div class="review-block"><div class="row spread"><b>${t(\'payment\')}</b>${btn(t(\'edit\'),\'checkout-step\',2,\'ghost small\')}</div><p>${esc(loc(catalog.payment_methods.find(m=>String(m.id)===String(draft.payment_id))))}</p></div>`;}\nfunction pointSummary(){const p=catalog.pickup_points.find(p=>String(p.id)===String(draft.point_id));return p?`${esc(loc(p))} · ${esc(loc(p,\'city\'))}, ${esc(loc(p,\'address\'))}<br>${esc(loc(p,\'hours\'))}`:t(\'noPickup\');}\nfunction fulfillmentFields(){if(draft.mode===\'pickup\')return `<h3>${t(\'choosePoint\')}</h3><div class="pickup-list">${catalog.pickup_points.map(p=>`<label class="pickup-option"><input type="radio" name="point_id" value="${p.id}" ${String(p.id)===String(draft.point_id)?\'checked\':\'\'} required><span><b>${esc(loc(p))}</b><span>${esc(loc(p,\'city\'))}, ${esc(loc(p,\'address\'))}</span><small>${esc(loc(p,\'hours\'))}</small><small>${esc(loc(p,\'description\'))}</small>${p.map_url?`<a href="${esc(p.map_url)}" target="_blank" rel="noopener">${t(\'map\')} ↗</a>`:\'\'}</span></label>`).join(\'\')||`<p class="error">${t(\'noPickup\')}</p>`}</div>`;return `<h3>${t(\'chooseShipping\')}</h3><div class="method-list">${catalog.shipping_rates.map(m=>`<label class="method-card"><input type="radio" name="rate_id" value="${m.id}" ${String(m.id)===String(draft.rate_id)?\'checked\':\'\'} required><span><span class="row spread"><b>${esc(loc(m))}</b><b>${money(m.price)}</b></span><small>${esc(loc(m,\'description\'))}</small><small>${esc(loc(m,\'eta\'))}${m.city?\' · \'+esc(m.city):\'\'}</small></span></label>`).join(\'\')||`<p class="error">${t(\'noShipping\')}</p>`}</div>`;}\nfunction totals(q){return `<div class="totals"><div><span>${t(\'subtotal\')}</span><span>${money(q.subtotal,q.currency)}</span></div><div><span>${t(\'delivery\')}</span><span>${q.shipping?money(q.shipping,q.currency):t(\'free\')}</span></div><div><span>${t(\'discount\')}</span><span>−${money(q.discount,q.currency)}</span></div>${q.bonus_spent?`<div><span>${t(\'bonusSpent\')}</span><span>−${money(q.bonus_spent,q.currency)}</span></div>`:\'\'}<div class="total"><b>${t(\'total\')}</b><b>${money(q.total,q.currency)}</b></div></div>`;}\nasync function refreshQuote(){if(view!==\'cart\'||!cart.length)return;captureDraft();const seq=++quoteSequence;quoteResult=null;if($(\'#place-order\'))$(\'#place-order\').disabled=true;try{const q=await api(\'/api/quote\',{method:\'POST\',body:{items:cart,promo:draft.promo||\'\',payment_id:draft.payment_id,use_bonus:!!draft.use_bonus,fulfillment:draft}});if(seq!==quoteSequence||view!==\'cart\')return;quoteResult=q;$(\'#quote-summary\').innerHTML=totals(q)+(draft.mode===\'delivery\'&&q.free_shipping_remaining!==null?`<div class="shipping-progress"><p>${q.free_shipping_remaining?t(\'freeLeft\',{amount:money(q.free_shipping_remaining)}):t(\'freeYes\')}</p><progress aria-label="${t(\'delivery\')}" max="${q.free_shipping_threshold}" value="${Math.max(0,q.free_shipping_threshold-q.free_shipping_remaining)}"></progress></div>`:\'\')+(q.minimum_remaining?`<p class="error">${t(\'minimumLeft\',{amount:money(q.minimum_remaining)})}</p>`:\'\');if($(\'#place-order\'))$(\'#place-order\').disabled=busy||!!q.minimum_remaining||!draft.payment_id;}catch(e){if(seq===quoteSequence&&$(\'#quote-summary\'))$(\'#quote-summary\').innerHTML=`<p class="error">${esc(e.message)}</p>`;}}\nfunction productModal(id,variantId=\'\'){const p=catalog.products.find(p=>p.id===id);if(!p)return;editing={type:\'preview\',id,index:0,variantId};modal(loc(p),`<div class="product-detail"><div><div class="detail-image" id="detail-image">${photo(p.images[0],\'\',loc(p))}</div><div class="gallery">${p.images.map((im,i)=>btn(photo(im),\'gallery\',i,\'gallery-item\',`aria-label="${t(\'image\',{n:i+1})}"`)).join(\'\')}</div></div><div class="detail-copy"><span class="eyebrow">${esc(p.sku)}</span><h2>${esc(loc(p))}</h2><div class="detail-price" id="variant-price">${money(p.price)}</div><p class="description">${esc(loc(p,\'description\'))}</p>${p.variants.length?`<h3>${t(\'chooseVariant\')}</h3><div class="variant-options">${p.variants.map(v=>`<button type="button" data-action="choose-variant" data-id="${esc(v.id)}" class="variant-option ${variantId===v.id?\'active\':\'\'}" ${v.stock&&p.availability===\'available\'?\'\':\'disabled\'}><b>${esc(optionsText(v))}</b><small>${money(v.price??p.price)} · ${v.stock?t(\'stock\',{n:v.stock}):t(\'out\')}</small></button>`).join(\'\')}</div>`:`<p class="muted">${p.stock&&p.availability===\'available\'?t(\'stock\',{n:p.stock}):t(\'out\')}</p>`}${Object.keys(p.traits).length?`<dl class="traits">${translatedPairs(p.traits,p.traits_de).map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join(\'\')}</dl>`:\'\'}</div></div>`,btn(t(\'add\')+\' \'+icon(\'plus\'),\'add-selected\',id,\'primary\',\'id="add-selected" \'+(!p.stock||p.availability!==\'available\'||p.variants.length&&!variantId?\'disabled\':\'\')));if(variantId)chooseVariant(variantId);}\nfunction orderDetails(o){const f=o.fulfillment||{},point=f.point||{},payment=o.payment||{};return `<div class="order-items">${o.items.map(i=>`<div class="order-line">${photo(i.image?.[0],\'tiny-photo\')}<span><b>${esc(isAdmin?i.name:loc(i))}</b><small>${esc(isAdmin?Object.values(i.options||{}).join(\' · \'):optionsText(i))} · ${isAdmin?(i.quantity||1)+\' шт.\':t(\'pieces\',{n:i.quantity||1})}</small></span><b>${money(i.price*(i.quantity||1),o.currency)}</b></div>`).join(\'\')}</div>${totals(o)}<div class="fulfillment-detail"><b>${isAdmin?(f.mode===\'pickup\'?\'Самовывоз\':\'Доставка\'):t(f.mode===\'pickup\'?\'pickup\':\'delivery\')}</b><p>${esc([f.first_name,f.last_name].filter(Boolean).join(\' \'))}</p><p>${esc(f.contact||o.recipient)}</p>${f.mode===\'pickup\'?`<p>${esc(loc(point))} · ${esc(loc(point,\'city\'))}, ${esc(loc(point,\'address\'))}</p><p>${esc(loc(point,\'hours\'))}</p>`:f.mode===\'delivery\'?`<p>${esc([f.city,f.postal_code,f.street,f.house,f.apartment].filter(Boolean).join(\', \'))}</p><p>${esc(loc(f.rate))}</p>`:\'\'}${f.comment?`<p>${esc(f.comment)}</p>`:\'\'}<p><b>${isAdmin?\'Оплата\':t(\'payment\')}: ${esc(loc(payment))}</b></p><p class="description">${esc(loc(payment,\'instructions\'))}</p>${o.reference?`<p>${isAdmin?\'Отправление / примечание\':t(\'reference\')}: ${esc(o.reference)}</p>`:\'\'}</div>`;}\nasync function loadOrders(){try{const orders=await api(\'/api/orders\');noticeOrderChanges(orders);if(!$(\'#order-history\'))return;$(\'#order-history\').innerHTML=header(t(\'myOrders\'),t(\'history\'))+(orders.length?orders.map(o=>`<details class="order-card panel"><summary><span><b>${t(\'order\',{id:o.id})}</b><small>${new Date(o.created*1000).toLocaleString(locale())} · ${money(o.total,o.currency)}</small></span>${badge(o.status)}</summary>${orderDetails(o)}</details>`).join(\'\'):empty(t(\'noOrders\'),t(\'noOrdersText\'),btn(t(\'toCatalog\'),\'view\',\'products\',\'primary\')));}catch(e){toast(e.message);}}\n// Mobile-first administration. Customer-facing language remains independently selectable.\nconst mobileAdminNav=[[\'dashboard\',\'Главная\'],[\'orders\',\'Заказы\'],[\'products\',\'Товары\'],[\'clients\',\'Клиенты\'],[\'more\',\'Ещё\']];\nfunction renderAdmin(){if(!session.admin)return renderLogin();document.documentElement.lang=\'ru\';const screens={dashboard:dashboardMarkup,products:productsAdmin,categories:categoriesAdmin,orders:ordersAdmin,clients:clientsAdmin,promos:promosAdmin,delivery:deliveryAdmin,pickup:pickupAdmin,payments:paymentsAdmin,statuses:statusesAdmin,banners:bannersAdmin,languages:languagesAdmin,settings:settingsAdmin,audit:auditAdmin,more:moreAdmin,referrals:referralsAdmin};$(\'#app\').innerHTML=`<div class="admin-shell"><aside class="sidebar">${brand()}<p class="eyebrow">Панель управления</p><nav>${Object.entries(adminTabs).map(([k,l])=>btn(icon(k)+l,\'tab\',k,\'side-link \'+(tab===k?\'active\':\'\'))).join(\'\')}</nav><div class="sidebar-bottom"><a href="/" target="_blank" rel="noopener">Открыть магазин ↗</a>${btn(\'Выйти\',\'logout\',\'\',\'ghost\')}</div></aside><div class="admin-body"><header class="admin-header"><span>${esc(admin.settings.name)} <span class="muted">/ ${adminTabs[tab]||tab}</span></span><a href="/" target="_blank" rel="noopener">Витрина ↗</a></header><main class="admin-main">${(screens[tab]||moreAdmin)()}</main></div><nav class="admin-bottom-nav" aria-label="Навигация администратора">${mobileAdminNav.map(([key,label])=>`<button type="button" data-action="tab" data-id="${key}" class="${tab===key||(key===\'more\'&&!mobileAdminNav.some(([k])=>k===tab))?\'active\':\'\'}">${icon(key===\'clients\'?\'profile\':key===\'more\'?\'settings\':key)}<small>${label}</small>${key===\'orders\'&&admin.orders.some(o=>o.status===\'new\')?\'<i></i>\':\'\'}</button>`).join(\'\')}</nav></div>`;}\nfunction dashboardMarkup(){const d=admin.today||{orders:0,sales:0,new_users:0,average:0,currencies:[]};return header(\'Сегодня\',new Date().toLocaleDateString(\'ru-RU\',{timeZone:admin.settings.timezone,day:\'numeric\',month:\'long\'}))+`<div class="metrics four">${[[\'Продажи\',d.currencies.length>1?\'Разные валюты\':money(d.sales,d.currencies[0]||admin.settings.currency),\'Оплаченные заказы за сегодня\'],[\'Заказы\',d.orders,\'Созданы сегодня\'],[\'Новые пользователи\',d.new_users,\'Новые профили / браузеры\'],[\'Средний чек\',d.currencies.length>1?\'—\':money(d.average,d.currencies[0]||admin.settings.currency),\'Оплаченные заказы за сегодня\']].map(([label,value,note])=>`<div class="metric"><span>${label}</span><b>${value}</b><small>${note}</small></div>`).join(\'\')}</div><div class="quick-actions">${btn(\'+ Товар\',\'edit-product\',\'\',\'primary\')}${btn(\'+ Категория\',\'edit-category\',\'\',\'secondary\')}${btn(\'+ Промокод\',\'edit-promo\',\'\',\'secondary\')}${btn(\'+ Точка самовывоза\',\'edit-pickup\',\'\',\'secondary\')}</div><div class="section-heading"><h2>Последние заказы</h2>${btn(\'Все →\',\'tab\',\'orders\',\'ghost\')}</div>${orderTable(admin.orders.slice(0,6))}${admin.notification_errors?\'<div class="notice">Есть недоставленные уведомления Telegram. Проверьте подключение бота.</div>\':\'\'}`;}\nfunction moreAdmin(){const items=[[\'referrals\',\'Реферальная программа\',\'Бонусы, приглашения и история\'],[\'categories\',\'Категории\',\'Структура каталога\'],[\'delivery\',\'Доставка\',\'Тарифы и бесплатная доставка\'],[\'pickup\',\'Самовывоз\',\'Точки, адреса и график\'],[\'payments\',\'Способы оплаты\',\'Выбор и инструкции покупателю\'],[\'statuses\',\'Статусы заказов\',\'Названия и этапы обработки\'],[\'promos\',\'Промокоды\',\'Скидки и лимиты\'],[\'banners\',\'Баннеры\',\'Главная страница\'],[\'languages\',\'Языки\',\'Українська / Русский\'],[\'settings\',\'Настройки магазина\',\'Оформление, контакты и ссылки\'],[\'audit\',\'Журнал действий\',\'История изменений\']];return header(\'Ещё\',\'Все инструменты магазина\')+`<div class="more-grid">${items.map(([key,title,sub])=>btn(`<span>${icon(key)}</span><span><b>${title}</b><small>${sub}</small></span>→`,\'tab\',key,\'more-card\')).join(\'\')}</div>`;}\nfunction productsAdmin(){return header(\'Товары\',\'Каталог\',btn(\'+ Товар\',\'edit-product\',\'\',\'primary\'))+`<label class="search">${icon(\'search\')}<input id="admin-search" value="${esc(adminSearch)}" placeholder="Название или артикул"></label><div class="admin-filter-chips">${[[\'\',\'Все\'],[\'stock\',\'В наличии\'],[\'empty\',\'Нет в наличии\'],[\'hidden\',\'Скрытые\']].map(([key,label])=>btn(label,\'product-filter\',key,\'chip \'+(productAdminFilter===key?\'active\':\'\'))).join(\'\')}</div><div id="admin-list">${productTable()}</div>`;}\nfunction productTable(){const list=admin.products.filter(p=>(p.name+\' \'+p.name_de+\' \'+p.sku).toLowerCase().includes(adminSearch.toLowerCase())&&(!productAdminFilter||(productAdminFilter===\'stock\'&&p.stock>0&&p.availability===\'available\'&&p.status===\'active\')||(productAdminFilter===\'empty\'&&(!p.stock||p.availability!==\'available\'))||(productAdminFilter===\'hidden\'&&p.status!==\'active\')));return list.length?`<div class="management-cards">${list.map(p=>`<article class="management-card product-admin-card"><div class="row">${photo(p.images[0],\'admin-card-photo\')}<div class="grow"><h3>${esc(p.name)}</h3><p class="muted tiny">${esc(p.name_de||p.sku)}</p><b>${money(minPrice(p))}</b></div></div><div class="card-meta"><span>Остаток: ${p.stock}</span><span>${p.variants.length?\'Вариантов: \'+p.variants.length:\'\'}</span>${badge(p.status,{active:\'Активный\',hidden:\'Скрытый\',archived:\'Архив\'}[p.status])}</div>${btn(\'Редактировать →\',\'edit-product\',p.id,\'secondary wide\')}</article>`).join(\'\')}</div>`:empty(\'Товары не найдены\',\'Добавьте товар или измените фильтры.\');}\nfunction filterAdminOrders(){return admin.orders.filter(o=>{const state=admin.order_statuses.find(s=>s.code===o.status);return (!orderFilter||state?.kind===orderFilter||(orderFilter===\'process\'&&state?.kind===\'paid\'))&&[o.id,o.recipient,o.customer?.username,o.customer?.first_name,...o.items.map(i=>i.name)].join(\' \').toLowerCase().includes(orderSearch.toLowerCase());});}\nfunction ordersAdmin(){return header(\'Заказы\',\'Обработка покупок\')+`<label class="search">${icon(\'search\')}<input id="order-search" value="${esc(orderSearch)}" placeholder="Номер, товар или пользователь"></label><div class="admin-filter-chips">${[[\'\',\'Все\'],[\'new\',\'Новые\'],[\'process\',\'В работе\'],[\'done\',\'Выполненные\'],[\'cancelled\',\'Отменённые\']].map(([key,label])=>btn(label,\'order-group\',key,\'chip \'+(orderFilter===key?\'active\':\'\'))).join(\'\')}</div><div id="admin-list">${orderTable(filterAdminOrders())}</div>`;}\nfunction orderTable(list){return list.length?`<div class="management-cards order-management">${list.map(o=>`<article class="management-card"><div class="row spread"><h3>Заказ #${o.id}</h3>${badge(o.status,admin.statuses[o.status]||o.status)}</div><p>👤 ${esc(o.customer?.username?\'@\'+o.customer.username:o.customer?.first_name||o.recipient)}</p><div class="card-meta"><b>${money(o.total,o.currency)}</b><span>${o.fulfillment?.mode===\'pickup\'?\'📍 Самовывоз\':\'🚚 Доставка\'}</span></div><p class="tiny muted">${new Date(o.created*1000).toLocaleString(\'ru-RU\',{timeZone:admin.settings.timezone})}</p>${btn(\'Открыть →\',\'edit-order\',o.id,\'secondary wide\')}</article>`).join(\'\')}</div>`:empty(\'Заказов нет\',\'Новые заказы появятся здесь.\');}\nfunction clientsAdmin(){return header(\'Клиенты\',\'Профили и история заказов\')+`<label class="search">${icon(\'search\')}<input id="customer-search" value="${esc(customerSearch)}" placeholder="Имя, Telegram, ID или контакт"></label><div id="customer-list">${customerCards()}</div>`;}\nfunction customerCards(){const list=(admin.customers||[]).filter(c=>[c.owner,c.name,c.telegram?.first_name,c.telegram?.username,c.contact].join(\' \').toLowerCase().includes(customerSearch.toLowerCase()));return list.length?`<div class="management-cards">${list.map(c=>`<article class="management-card"><h3>${esc(c.name||c.telegram?.first_name||\'WEB-покупатель\')}</h3><p>${esc(c.telegram?.username?\'@\'+c.telegram.username:c.contact||\'Без заказов\')}</p><p class="muted tiny">${esc(c.owner)}</p><div class="card-meta"><b>Заказов: ${c.order_count}</b><span>${Object.entries(c.totals).map(([currency,sum])=>money(sum,currency)).join(\' · \')}</span></div><p class="tiny muted">С ${new Date(c.first_seen*1000).toLocaleDateString(\'ru-RU\')} · ${c.language.toUpperCase()}</p>${btn(\'История заказов →\',\'customer-orders\',c.owner,\'secondary wide\')}</article>`).join(\'\')}</div>`:empty(\'Клиенты не найдены\',\'Измените поисковый запрос.\');}\nfunction deliveryAdmin(){const s=admin.settings;return header(\'Доставка\',\'Способы и условия\',btn(\'+ Способ\',\'edit-rate\',\'\',\'primary\'))+`<form id="delivery-form" class="panel settings-form"><div class="row wrap">${check(\'delivery_enabled\',\'Доставка включена\',s.delivery_enabled)}${check(\'free_shipping_enabled\',\'Бесплатная доставка включена\',s.free_shipping_enabled)}</div>${field(\'free_shipping_from\',\'Общий порог бесплатной доставки\',s.free_shipping_from/100,\'number\',\'min="0" step="0.01" required\')}<p class="tiny muted">Сумма товаров после скидки. Выключатель выше отключает бесплатную доставку для всех способов. У каждого способа можно задать собственный порог.</p>${errorBox()}<button class="btn primary" type="submit">Сохранить</button></form><div class="management-cards">${admin.shipping_rates.map(r=>`<article class="management-card"><div class="row spread"><h3>${esc(r.name)}</h3>${badge(r.active?\'active\':\'hidden\',r.active?\'Включён\':\'Выключен\')}</div><p class="muted">${esc(r.description)}</p><p>${money(r.price)} · ${esc(r.eta||\'Срок не указан\')}</p><p class="tiny muted">${r.inherit_free_shipping?\'Общий порог\':r.free_shipping_from?\'Бесплатно от \'+money(r.free_shipping_from):\'Без бесплатной доставки\'}${r.city?\' · \'+esc(r.city):\'\'}</p><div class="row">${btn(\'Изменить\',\'edit-rate\',r.id,\'secondary\')}${btn(\'Удалить\',\'delete-rate\',r.id,\'ghost\')}</div></article>`).join(\'\')}</div>`;}\nfunction pickupAdmin(){return header(\'Самовывоз\',\'Точки и адреса\',btn(\'+ Точка\',\'edit-pickup\',\'\',\'primary\'))+`<form id="pickup-enabled-form" class="panel settings-form">${check(\'pickup_enabled\',\'Самовывоз включён\',admin.settings.pickup_enabled)}<button class="btn primary" type="submit">Сохранить</button></form><div class="management-cards">${admin.pickup_points.map(p=>`<article class="management-card"><div class="row spread"><h3>${esc(p.name)}</h3>${badge(p.active?\'active\':\'hidden\',p.active?\'Включена\':\'Выключена\')}</div><p>${esc(p.city)}, ${esc(p.address)}</p><p>${esc(p.hours)}</p><p class="muted">${esc(p.description)}</p><div class="row">${btn(\'Изменить\',\'edit-pickup\',p.id,\'secondary\')}${btn(\'Удалить\',\'delete-pickup\',p.id,\'ghost\')}</div></article>`).join(\'\')}</div>`;}\nfunction editRate(id){const r=admin.shipping_rates.find(x=>x.id===id)||{price:0,free_shipping_from:0,inherit_free_shipping:true,active:true};editing={type:\'rate\',id:id||0};modal(\'Способ доставки\',`<form id="rate-form"><div class="form-grid">${field(\'name\',\'Название RU\',r.name||\'\',\'text\',\'required maxlength="160"\')}${field(\'name_de\',\'Назва UA (укр)\',r.name_de||\'\',\'text\',\'maxlength="160"\')}${field(\'price\',\'Цена\',r.price/100,\'number\',\'required min="0" step="0.01"\')}${field(\'free_shipping_from\',\'Бесплатно от (0 — отключено)\',r.free_shipping_from/100,\'number\',\'required min="0" step="0.01"\')}${field(\'eta\',\'Срок доставки RU\',r.eta||\'\',\'text\',\'maxlength="160"\')}${field(\'eta_de\',\'Час доставки UA (укр)\',r.eta_de||\'\',\'text\',\'maxlength="160"\')}${field(\'city\',\'Только для города (пусто — все)\',r.city||\'\',\'text\',\'maxlength="120"\')}${field(\'position\',\'Порядок\',r.position||0,\'number\',\'min="0"\')}${area(\'description\',\'Описание RU\',r.description||\'\',\'maxlength="2000"\')}${area(\'description_de\',\'Опис UA (укр)\',r.description_de||\'\',\'maxlength="2000"\')}</div>${check(\'inherit_free_shipping\',\'Использовать общий порог магазина\',r.inherit_free_shipping)}${check(\'active\',\'Включён\',r.active)}${errorBox()}</form>`,editorFooter(\'rate-form\'));}\nfunction paymentsAdmin(){return header(\'Способы оплаты\',\'Покупатель выбирает при оформлении\',btn(\'+ Способ\',\'edit-payment\',\'\',\'primary\'))+`<div class="notice">Здесь задаются способы и инструкции. Автоматическое списание денег требует отдельного подключения платёжного провайдера.</div><div class="management-cards">${admin.payment_methods.map(m=>`<article class="management-card"><div class="row spread"><h3>${esc(m.name)}</h3>${badge(m.active?\'active\':\'hidden\',m.active?\'Включён\':\'Выключен\')}</div><p class="muted">${esc(m.description)}</p><p class="description">${esc(m.instructions)}</p><div class="row">${btn(\'Изменить\',\'edit-payment\',m.id,\'secondary\')}${btn(\'Удалить\',\'remove-payment\',m.id,\'ghost\')}</div></article>`).join(\'\')||empty(\'Добавьте способ оплаты\',\'Без активного способа оплаты оформить заказ нельзя.\')}</div>`;}\nfunction editPayment(id){const m=admin.payment_methods.find(x=>x.id===id)||{active:true};editing={type:\'payment\',id:id||0};modal(\'Способ оплаты\',`<form id="payment-form"><div class="form-grid">${field(\'name\',\'Название RU\',m.name||\'\',\'text\',\'required maxlength="160"\')}${field(\'name_de\',\'Назва UA (укр)\',m.name_de||\'\',\'text\',\'maxlength="160"\')}${area(\'description\',\'Описание RU\',m.description||\'\',\'maxlength="2000"\')}${area(\'description_de\',\'Опис UA (укр)\',m.description_de||\'\',\'maxlength="2000"\')}${area(\'instructions\',\'Инструкция / реквизиты RU\',m.instructions||\'\',\'maxlength="2000"\')}${area(\'instructions_de\',\'Інструкція з оплати UA (укр)\',m.instructions_de||\'\',\'maxlength="2000"\')}${field(\'position\',\'Порядок\',m.position||0,\'number\',\'min="0"\')}</div>${check(\'active\',\'Включён\',m.active)}${errorBox()}</form>`,editorFooter(\'payment-form\'));}\nfunction statusesAdmin(){return header(\'Статусы заказов\',\'Управление этапами\',btn(\'+ Статус\',\'edit-status\',\'\',\'primary\'))+`<div class="notice">Тип определяет поведение остатков и отчётов. Начальный статус нельзя отключить. Тип существующего статуса неизменяемый.</div><div class="management-cards">${admin.order_statuses.map(s=>`<article class="management-card"><h3>${esc(s.name)} / ${esc(s.name_de)}</h3><p class="muted">${esc(s.kind)} · ${s.active?\'Включён\':\'Выключен\'}</p>${btn(\'Изменить\',\'edit-status\',s.code,\'secondary\')}</article>`).join(\'\')}</div>`;}\nfunction editStatus(code){const s=admin.order_statuses.find(s=>s.code===code)||{kind:\'process\',active:true};editing={type:\'status\',code:s.code||\'\'};modal(\'Статус заказа\',`<form id="status-form"><div class="form-grid">${field(\'name\',\'Название RU\',s.name||\'\',\'text\',\'required maxlength="120"\')}${field(\'name_de\',\'Назва UA (укр)\',s.name_de||\'\',\'text\',\'required maxlength="120"\')}${select(\'kind\',\'Тип\',s.code?[[s.kind,s.kind]]:[[\'process\',\'В работе\'],[\'paid\',\'Оплачен\'],[\'done\',\'Выполнен\'],[\'cancelled\',\'Отменён\']],s.kind)}${field(\'position\',\'Порядок\',s.position||0,\'number\',\'min="0"\')}</div>${check(\'active\',\'Включён\',s.active)}${errorBox()}</form>`,editorFooter(\'status-form\'));}\nfunction editOrder(id){const o=admin.orders.find(x=>x.id===id);editing={type:\'order\',id};modal(\'Заказ #\'+id,`<div class="order-admin-header"><p>👤 ${esc(o.customer?.username?\'@\'+o.customer.username:o.customer?.first_name||o.recipient)}</p><p class="tiny muted">${esc(o.telegram_id||o.owner)} · ${new Date(o.created*1000).toLocaleString(\'ru-RU\',{timeZone:admin.settings.timezone})} · ${o.language.toUpperCase()}</p></div>`+orderDetails(o)+`<form id="order-form"><div class="form-grid">${select(\'status\',\'Статус\',[o.status,...(admin.transitions[o.status]||[])].map(s=>[s,admin.statuses[s]||s]),o.status)}${field(\'reference\',\'Номер отправления / примечание покупателю\',o.reference,\'text\',\'maxlength="500"\')}${area(\'note\',\'Внутренняя заметка\',o.note,\'maxlength="5000"\')}</div>${errorBox()}</form>`,editorFooter(\'order-form\'));}\nfunction linkRow(l={}){return `<div class="link-editor"><div class="form-grid">${field(\'\',\'Подпись RU\',l.name||\'\',\'text\',\'required data-link-name\')}${field(\'\',\'Підпис UA (укр)\',l.name_de||\'\',\'text\',\'data-link-de\')}${field(\'\',\'URL https://\',l.url||\'\',\'url\',\'required pattern="https://.*" data-link-url\')}</div>${btn(\'Удалить ссылку\',\'remove-link\',\'\',\'ghost small\')}</div>`;}\nfunction settingsAdmin(){const s=admin.settings;return header(\'Настройки магазина\',\'Контент и оформление\')+`<form id="settings-form" class="panel settings-form"><h2>Магазин</h2><div class="form-grid">${field(\'name\',\'Название RU\',s.name,\'text\',\'required maxlength="160"\')}${field(\'name_de\',\'Назва UA (укр)\',s.name_de||\'\',\'text\',\'maxlength="160"\')}${field(\'subtitle\',\'Подпись RU\',s.subtitle,\'text\',\'maxlength="160"\')}${field(\'subtitle_de\',\'Підпис UA (укр)\',s.subtitle_de||\'\',\'text\',\'maxlength="160"\')}${area(\'description\',\'Описание RU\',s.description||\'\',\'maxlength="2000"\')}${area(\'description_de\',\'Опис UA (укр)\',s.description_de||\'\',\'maxlength="2000"\')}${area(\'contact_text\',\'Контакты RU\',s.contact_text||\'\',\'maxlength="2000"\')}${area(\'contact_text_de\',\'Контакти UA (укр)\',s.contact_text_de||\'\',\'maxlength="2000"\')}${field(\'support\',\'Поддержка Telegram\',s.support,\'text\',\'placeholder="@username"\')}${select(\'currency\',\'Валюта\',[[\'EUR\',\'EUR\'],[\'UAH\',\'UAH\'],[\'USD\',\'USD\']],s.currency)}${field(\'timezone\',\'Часовой пояс отчётов\',s.timezone,\'text\',\'required placeholder="Europe/Berlin"\')}${field(\'minimum_order\',\'Минимальная сумма после скидки\',s.minimum_order/100,\'number\',\'min="0" step="0.01" required\')}</div><h2>Дизайн</h2><div class="form-grid">${[[\'accent\',\'Главный цвет\'],[\'accent_secondary\',\'Дополнительный цвет\'],[\'background\',\'Фон\'],[\'text_color\',\'Текст\']].map(([k,label])=>field(k,label,s[k],\'color\')).join(\'\')}${[\'logo\',\'favicon\',\'banner\'].map(k=>`<div class="field"><span>${{logo:\'Логотип\',favicon:\'Favicon\',banner:\'Резервный главный баннер\'}[k]}</span><div id="${k}-preview">${s[k]?photo(s[k],\'brand-preview\'):\'\'}</div><input type="hidden" name="${k}" value="${esc(s[k])}"><input type="file" accept="image/jpeg,image/png,image/webp" data-branding="${k}">${btn(\'Убрать\',\'clear-brand\',k,\'ghost small\')}</div>`).join(\'\')}${field(\'hero_title\',\'Заголовок RU\',s.hero_title,\'text\',\'maxlength="160"\')}${field(\'hero_title_de\',\'Заголовок UA (укр)\',s.hero_title_de||\'\',\'text\',\'maxlength="160"\')}${area(\'hero_text\',\'Текст главной RU\',s.hero_text,\'maxlength="2000"\')}${area(\'hero_text_de\',\'Текст UA (укр)\',s.hero_text_de||\'\',\'maxlength="2000"\')}${area(\'payment_info\',\'Информация об оплате RU\',s.payment_info,\'maxlength="2000"\')}${area(\'payment_info_de\',\'Інформація про оплату UA (укр)\',s.payment_info_de||\'\',\'maxlength="2000"\')}</div><div class="row spread"><h2>Ссылки</h2>${btn(\'+ Ссылка\',\'add-link\',\'\',\'secondary small\')}</div><div id="links-list">${(s.links||[]).map(linkRow).join(\'\')}</div>${errorBox()}<button type="submit" class="btn primary">Сохранить настройки</button></form>`;}\nfunction languagesAdmin(){return header(\'Языки\',\'Українська / Русский\')+`<form id="languages-form" class="panel settings-form">${select(\'default_language\',\'Язык новых посетителей\',[[\'ru\',\'Русский\'],[\'de\',\'Deutsch\']],admin.settings.default_language)}<p class="muted">Выбор покупателя сохраняется и имеет приоритет. Переводы названий, описаний, категорий, вариантов, доставки, оплаты и баннеров заполняются в соответствующих формах. Порожнє поле UA використовує RU.</p><button type="submit" class="btn primary">Сохранить</button></form>`;}\nfunction bannersAdmin(){return header(\'Баннеры\',\'Главная страница\',btn(\'+ Баннер\',\'edit-banner\',\'\',\'primary\'))+`<div class="management-cards">${(admin.settings.banners||[]).map((b,i)=>`<article class="management-card">${photo(b.image,\'banner-preview\')}<h3>${esc(b.title||\'Баннер \'+(i+1))}</h3><p>${b.active?\'Включён\':\'Выключен\'}</p><div class="row wrap">${btn(\'Изменить\',\'edit-banner\',b.id,\'secondary\')}${btn(\'↑\',\'banner-up\',i,\'ghost\',i===0?\'disabled\':\'\')}${btn(\'↓\',\'banner-down\',i,\'ghost\',i===admin.settings.banners.length-1?\'disabled\':\'\')}${btn(\'Удалить\',\'remove-banner\',b.id,\'ghost\')}</div></article>`).join(\'\')}</div>`;}\nfunction editBanner(id){const b=admin.settings.banners.find(b=>b.id===id)||{active:true};editing={type:\'banner\',bannerId:b.id||\'\'};modal(\'Баннер\',`<form id="banner-form"><div class="field"><span>Изображение</span><div id="banner-editor-preview">${b.image?photo(b.image,\'banner-preview\'):\'\'}</div><input type="hidden" name="image" value="${esc(b.image||\'\')}"><input type="file" id="banner-image" accept="image/jpeg,image/png,image/webp"></div><div class="form-grid">${field(\'title\',\'Заголовок RU\',b.title||\'\',\'text\',\'maxlength="160"\')}${field(\'title_de\',\'Заголовок UA (укр)\',b.title_de||\'\',\'text\',\'maxlength="160"\')}${area(\'text\',\'Текст RU\',b.text||\'\',\'maxlength="2000"\')}${area(\'text_de\',\'Текст UA (укр)\',b.text_de||\'\',\'maxlength="2000"\')}${field(\'url\',\'Ссылка (необязательно)\',b.url||\'\',\'url\',\'pattern="https://.*"\')}</div>${check(\'active\',\'Включён\',b.active)}${errorBox()}</form>`,editorFooter(\'banner-form\'));}\nfunction auditAdmin(){return header(\'Журнал действий\',\'Последние 200 событий\')+`<div class="audit-cards">${admin.audit.map(a=>`<article class="management-card"><b>${esc(a.action)}</b><p class="muted tiny">${new Date(a.created*1000).toLocaleString(\'ru-RU\')} · ${esc(a.entity)}</p></article>`).join(\'\')}</div>`;}\n// Extend established catalog editors without changing their image/stock behavior.\nfunction pairRow(k=\'\',v=\'\',de={}){return `<div class="pair-row"><div class="pair-fields"><input data-key value="${esc(k)}" placeholder="Название RU" maxlength="80" required aria-label="Название RU"><input data-value value="${esc(v)}" placeholder="Значение RU" maxlength="200" required aria-label="Значение RU"><input data-key-de value="${esc(de.name||\'\')}" placeholder="Назва UA (укр) (необязательно)" maxlength="80" aria-label="Назва UA (укр)"><input data-value-de value="${esc(de.value||\'\')}" placeholder="Значення UA (укр) (необязательно)" maxlength="200" aria-label="Значення UA (укр)"></div>${btn(\'×\',\'remove-row\',\'\',\'icon-btn\',\'aria-label="Удалить характеристику"\')}</div>`;}\nfunction readTranslations(root){const result={};for(const row of $$(\'.pair-row\',root)){const key=$(\'[data-key]\',row).value.trim(),name=$(\'[data-key-de]\',row)?.value.trim()||\'\',value=$(\'[data-value-de]\',row)?.value.trim()||\'\';if(name||value)Object.defineProperty(result,key,{value:{name,value},enumerable:true});}return result;}\nfunction variantRow(v={id:\'\',options:{\'\':\'\'},stock:0,price:null}){return `<section class="variant-editor" data-variant-id="${esc(v.id)}"><div class="row spread"><b>Вариант</b>${btn(\'Удалить вариант\',\'remove-variant\',\'\',\'ghost small\')}</div><div class="variant-pairs">${Object.entries(v.options).map(([k,val])=>pairRow(k,val,v.options_de?.[k])).join(\'\')}</div>${btn(\'+ Параметр\',\'add-option\',\'\',\'ghost small\')}<div class="form-grid">${field(\'variant_stock\',\'Доступный остаток\',v.stock,\'number\',\'min="0" max="1000000" required data-stock\')}${field(\'variant_price\',\'Отдельная цена (необязательно)\',v.price===null?\'\':(v.price/100).toFixed(2),\'number\',\'min="0" step="0.01" data-price\')}</div></section>`;}\nconst previousEditProduct=editProduct;\neditProduct=function(id){previousEditProduct(id);const p=admin.products.find(p=>p.id===id)||{};$(\'#product-form>.form-grid\').insertAdjacentHTML(\'beforeend\',field(\'name_de\',\'Назва UA (укр)\',p.name_de||\'\',\'text\',\'maxlength="120"\')+area(\'description_de\',\'Опис UA (укр)\',p.description_de||\'\',\'maxlength="5000"\'));$(\'#traits-list\').innerHTML=Object.entries(p.traits||{}).map(([k,v])=>pairRow(k,v,p.traits_de?.[k])).join(\'\');};\nconst previousEditCategory=editCategory;\neditCategory=function(id){previousEditCategory(id);const c=admin.categories.find(c=>c.id===id)||{};$(\'#category-form>.form-grid\').insertAdjacentHTML(\'beforeend\',field(\'name_de\',\'Назва UA (укр)\',c.name_de||\'\',\'text\',\'maxlength="120"\')+area(\'description_de\',\'Опис UA (укр)\',c.description_de||\'\',\'maxlength="2000"\'));};\nconst previousEditPickup=editPickup;\neditPickup=function(id){previousEditPickup(id);const p=admin.pickup_points.find(p=>p.id===id)||{};$(\'#pickup-form>.form-grid\').insertAdjacentHTML(\'beforeend\',[[\'name\',\'Назва UA (укр)\'],[\'city\',\'Місто UA (укр)\'],[\'address\',\'Адреса UA (укр)\'],[\'hours\',\'Години роботи UA (укр)\'],[\'description\',\'Опис UA (укр)\']].map(([k,label])=>k===\'description\'?area(k+\'_de\',label,p[k+\'_de\']||\'\',\'maxlength="2000"\'):field(k+\'_de\',label,p[k+\'_de\']||\'\',\'text\',\'maxlength="200"\')).join(\'\'));};\nfunction validateStep(){const form=$(\'#checkout-form\');const invalid=[...form.elements].find(el=>el.willValidate&&!el.validity.valid);if(invalid){formError(new Error(lang===\'de\'?\'Bitte füllen Sie alle Pflichtfelder korrekt aus.\':\'Заполните обязательные поля корректно.\'));invalid.focus();return false;}if(checkoutStep===0){if(draft.mode===\'delivery\'&&(!catalog.settings.delivery_enabled||!catalog.shipping_rates.some(r=>String(r.id)===String(draft.rate_id)))){formError(new Error(t(\'noShipping\')));return false;}if(draft.mode===\'pickup\'&&(!catalog.settings.pickup_enabled||!catalog.pickup_points.some(p=>String(p.id)===String(draft.point_id)))){formError(new Error(t(\'noPickup\')));return false;}}if(checkoutStep===2&&!catalog.payment_methods.some(m=>String(m.id)===String(draft.payment_id))){formError(new Error(t(\'noPayment\')));return false;}return true;}\nasync function changeCheckoutStep(next){captureDraft();if(next>checkoutStep&&!validateStep())return;if(next>checkoutStep&&checkoutStep===1){await refreshQuote();if(!quoteResult)return;}checkoutStep=Math.max(0,Math.min(3,next));renderStore();$(\'#checkout-form\').scrollIntoView({behavior:\'smooth\',block:\'start\'});}\ndocument.addEventListener(\'click\',async e=>{const b=e.target.closest(\'[data-action]\');if(!b)return;const a=b.dataset.action,owned=[\'language\',\'checkout-next\',\'checkout-back\',\'checkout-step\',\'product-filter\',\'order-group\',\'customer-orders\',\'edit-payment\',\'remove-payment\',\'edit-status\',\'add-link\',\'remove-link\',\'edit-banner\',\'remove-banner\',\'banner-up\',\'banner-down\',\'banner-slide\'];if(!owned.includes(a))return;e.preventDefault();e.stopImmediatePropagation();if(busy)return;try{\n if(a===\'language\'){captureDraft();lang=b.dataset.id;languageChosen=true;localStorage.setItem(\'store-language\',lang);++quoteSequence;renderStore();await api(\'/api/language\',{method:\'POST\',body:{language:lang}});}\n else if(a===\'checkout-next\')await changeCheckoutStep(checkoutStep+1);\n else if(a===\'checkout-back\')await changeCheckoutStep(checkoutStep-1);\n else if(a===\'checkout-step\'&&Number(b.dataset.id)<=checkoutStep)await changeCheckoutStep(Number(b.dataset.id));\n else if(a===\'product-filter\'){productAdminFilter=b.dataset.id;renderAdmin();}\n else if(a===\'order-group\'){orderFilter=b.dataset.id;renderAdmin();}\n else if(a===\'customer-orders\'){modal(\'Заказы клиента\',orderTable(admin.orders.filter(o=>o.owner===b.dataset.id)));}\n else if(a===\'edit-payment\')editPayment(Number(b.dataset.id));\n else if(a===\'remove-payment\'){if(confirm(\'Удалить способ оплаты? История заказов сохранится.\')){await api(\'/api/admin/payment-methods/\'+Number(b.dataset.id),{method:\'DELETE\'});await refreshAdmin();}}\n else if(a===\'edit-status\')editStatus(b.dataset.id);\n else if(a===\'add-link\')$(\'#links-list\').insertAdjacentHTML(\'beforeend\',linkRow());\n else if(a===\'remove-link\')b.closest(\'.link-editor\').remove();\n else if(a===\'edit-banner\')editBanner(b.dataset.id);\n else if(a===\'banner-slide\'){bannerIndex=Number(b.dataset.id);renderStore();}\n else if([\'remove-banner\',\'banner-up\',\'banner-down\'].includes(a)){const banners=structuredClone(admin.settings.banners);if(a===\'remove-banner\'){if(!confirm(\'Удалить баннер?\'))return;const i=banners.findIndex(x=>x.id===b.dataset.id);banners.splice(i,1);}else{const i=Number(b.dataset.id),to=i+(a===\'banner-up\'?-1:1);[banners[i],banners[to]]=[banners[to],banners[i]];}await api(\'/api/admin/settings\',{method:\'PUT\',body:{banners}});await refreshAdmin();}\n }catch(err){formError(err);}},true);\ndocument.addEventListener(\'input\',e=>{if(e.target.id===\'order-search\'){orderSearch=e.target.value;$(\'#admin-list\').innerHTML=orderTable(filterAdminOrders());}if(e.target.id===\'customer-search\'){customerSearch=e.target.value;$(\'#customer-list\').innerHTML=customerCards();}});\ndocument.addEventListener(\'change\',async e=>{if(e.target.id!==\'banner-image\'||!e.target.files[0]||busy)return;busy=true;setBusy();try{const r=await uploadOne(e.target.files[0]);$(\'#banner-form\').elements.image.value=r.id;$(\'#banner-editor-preview\').innerHTML=photo(r.id,\'banner-preview\');}catch(err){formError(err);}finally{busy=false;setBusy();}});\ndocument.addEventListener(\'submit\',async e=>{const form=e.target;if(form.id===\'checkout-form\'&&checkoutStep!==3){e.preventDefault();e.stopImmediatePropagation();if(!busy)await changeCheckoutStep(checkoutStep+1);return;}if(![\'payment-form\',\'status-form\',\'languages-form\',\'pickup-enabled-form\',\'banner-form\'].includes(form.id))return;e.preventDefault();e.stopImmediatePropagation();if(busy||!form.reportValidity())return;const values=Object.fromEntries(new FormData(form));busy=true;setBusy();try{let path=\'settings\',method=\'PUT\',payload=values;if(form.id===\'payment-form\'){path=\'payment-methods\'+(editing.id?\'/\'+editing.id:\'\');method=editing.id?\'PUT\':\'POST\';payload.active=form.elements.active.checked;}if(form.id===\'status-form\'){path=\'order-statuses\'+(editing.code?\'/\'+editing.code:\'\');method=editing.code?\'PUT\':\'POST\';payload.active=form.elements.active.checked;}if(form.id===\'pickup-enabled-form\')payload={pickup_enabled:form.elements.pickup_enabled.checked};if(form.id===\'banner-form\'){if(!values.image)throw Error(\'Завантажте зображення банера / Завантажте зображення банера\');const banners=structuredClone(admin.settings.banners),item={...values,id:editing.bannerId||crypto.randomUUID(),active:form.elements.active.checked},index=banners.findIndex(b=>b.id===editing.bannerId);if(index>=0)banners[index]=item;else banners.push(item);payload={banners};}await api(\'/api/admin/\'+path,{method,body:payload});busy=false;close();await refreshAdmin();toast(\'Изменения сохранены\');}catch(err){formError(err);}finally{busy=false;setBusy();}},true);\nlet knownOrderStatuses=null;\nfunction noticeOrderChanges(orders){const next=Object.fromEntries(orders.map(o=>[o.id,o.status]));if(knownOrderStatuses)for(const o of orders)if(knownOrderStatuses[o.id]&&knownOrderStatuses[o.id]!==o.status)toast(t(\'orderStatus\',{id:o.id,status:statusNames[o.status]||o.status}));knownOrderStatuses=next;}\nsetInterval(async()=>{if(isAdmin||document.hidden||!session.csrf||busy)return;try{if(view===\'orders\')await loadOrders();else noticeOrderChanges(await api(\'/api/orders\'));}catch{}},10000);\n\n', 'i18n.js': "'use strict';\nlet lang='ru',languageChosen=false;\ntry{const saved=localStorage.getItem('store-language');if(['ua','ru'].includes(saved)){lang=saved;languageChosen=true;}}catch{}\nconst messages={ orderStatus:['Заказ #{id}: {status}','Замовлення #{id}: {status}'], home:['Главная','Головна'],products:['Товары','Товари'],cart:['Корзина','Кошик'],profile:['Профиль','Профіль'],orders:['Заказы','Замовлення'], close:['Закрыть','Закрити'],back:['Назад','Назад'],next:['Далее','Далі'],done:['Готово','Готово'],catalog:['Каталог','Каталог'],find:['Найди своё','Знайди своє'],all:['Все','Всі'], search:['Поиск товаров','Пошук товарів'],sort:['Сортировка','Сортування'],newFirst:['Сначала новые','Спочатку нові'],priceUp:['Цена: по возрастанию','Ціна: за зростанням'],priceDown:['Цена: по убыванию','Ціна: за спаданням'],byName:['По названию','За назвою'],filters:['Фильтры','Фільтри'],reset:['Сбросить','Скинути'], new:['Новинка','Новинка'],out:['Нет в наличии','Немає в наявності'],from:['от','від'],add:['Добавить в корзину','Додати до кошика'],added:['Добавлено в корзину','Додано до кошика'],chooseVariant:['Выберите вариант','Оберіть варіант'],stock:['В наличии: {n}','В наявності: {n}'], count:['Товаров: {n}','Товарів: {n}'],noProducts:['Товаров пока нет','Товарів поки немає'],noProductsText:['Товары появятся здесь после добавления в каталог.','Товари з\\\'являться тут після додавання в каталог.'],noResults:['Ничего не найдено','Нічого не знайдено'],noResultsText:['Измените поиск или фильтры.','Змініть пошук або фільтри.'], toCatalog:['Перейти в каталог','Перейти до каталогу'],online:['Выбирай онлайн','Обирай онлайн'],delivery:['Доставка','Доставка'],pickup:['Самовывоз','Самовивіз'],support:['Поддержка','Підтримка'],manage:['Управление магазином','Керування магазином'],footer:['Выбирай. Заказывай. Наслаждайся.','Обирай. Замовляй. Насолоджуйся.'], emptyCart:['Корзина пуста','Кошик порожній'],emptyCartText:['Выберите товары — мы сохраним их здесь.','Оберіть товари — ми збережемо їх тут.'],finds:['Твои находки','Твої знахідки'],clear:['Очистить','Очистити'],clearConfirm:['Очистить корзину?','Очистити кошик?'],remove:['Удалить товар','Видалити товар'],less:['Уменьшить количество','Зменшити кількість'],more:['Увеличить количество','Збільшити кількість'],unavailable:['Обновите количество или удалите товар','Оновіть кількість або видаліть товар'], receive:['Получение','Отримання'],details:['Данные','Дані'],payment:['Оплата','Оплата'],review:['Проверка','Перевірка'],howReceive:['Как получить заказ?','Як отримати замовлення?'],choosePoint:['Выберите точку самовывоза','Оберіть точку самовивозу'],chooseShipping:['Выберите способ доставки','Оберіть спосіб доставки'],noShipping:['Нет доступных способов доставки. Свяжитесь с магазином.','Немає доступних способів доставки. Зв\\\'яжіться з магазином.'],noPickup:['Нет доступных точек самовывоза.','Немає доступних точок самовивозу.'],noPayment:['Нет доступных способов оплаты. Свяжитесь с магазином.','Немає доступних способів оплати. Зв\\\'яжіться з магазином.'], firstName:['Имя','Ім\\\'я'],lastName:['Фамилия','Прізвище'],contact:['Телефон / контакт','Телефон / контакт'],city:['Город','Місто'],postal:['Индекс','Індекс'],street:['Улица','Вулиця'],house:['Дом','Будинок'],apartment:['Квартира (необязательно)','Квартира (необов\\\'язково)'],comment:['Комментарий (необязательно)','Коментар (необов\\\'язково)'],map:['На карте','На карті'],address:['Адрес доставки','Адреса доставки'],yourData:['Данные получателя','Дані одержувача'], yourOrder:['Ваш заказ','Ваше замовлення'],promo:['Промокод','Промокод'],apply:['Применить','Застосувати'],subtotal:['Товары','Товари'],discount:['Скидка','Знижка'],total:['Итого','Разом'],free:['Бесплатно','Безкоштовно'],freeLeft:['🚚 До бесплатной доставки осталось {amount}','🚚 До безкоштовної доставки залишилося {amount}'],freeYes:['🎉 Вам доступна бесплатная доставка!','🎉 Вам доступна безкоштовна доставка!'],minimumLeft:['До минимальной суммы заказа осталось {amount}','До мінімальної суми замовлення залишилося {amount}'],calculating:['Рассчитываем сумму…','Розраховуємо суму…'],place:['Оформить заказ','Оформити замовлення'],paymentNote:['Заказ будет создан без автоматического списания денег.','Замовлення буде створено без автоматичного списання грошей.'],choosePay:['Выберите способ оплаты','Оберіть спосіб оплати'],checkOrder:['Проверьте заказ','Перевірте замовлення'],edit:['Изменить','Змінити'],orderCreated:['Заказ #{id} создан','Замовлення #{id} створено'], yourProfile:['Ваш профиль','Ваш профіль'],nearby:['Всё важное — рядом','Усе важливе — поруч'],guest:['Гость','Гість'],guestTitle:['Покупки без регистрации','Покупки без реєстрації'],tgHistory:['Заказы привязаны к вашему Telegram-профилю.','Замовлення прив\\\'язані до вашого Telegram-профілю.'],webHistory:['История доступна в этом браузере, пока сохранена сессия.','Історія доступна в цьому браузері, поки збережена сесія.'],myOrders:['Мои заказы','Мої замовлення'],history:['История покупок','Історія покупок'],loadingOrders:['Загружаем заказы…','Завантажуємо замовлення…'],noOrders:['Заказов пока нет','Замовлень поки немає'],noOrdersText:['Здесь появятся детали и статусы ваших покупок.','Тут з\\\'являться деталі та статуси ваших покупок.'],order:['Заказ #{id}','Замовлення #{id}'],pieces:['{n} шт.','{n} шт.'],reference:['Отправление / примечание','Відправлення / примітка'],language:['Язык','Мова'],chooseLanguage:['Язык сохранится для следующих посещений.','Мова збережеться для наступних відвідувань.'], reload:['Попробовать снова','Спробувати знову'],loadError:['Не удалось загрузить магазин','Не вдалося завантажити магазин'],serverError:['Сервер недоступен','Сервер недоступний'],requestError:['Не удалось выполнить запрос','Не вдалося виконати запит'],cartStock:['В корзине уже весь доступный остаток','У кошику вже весь доступний залишок'],changeVariant:['Выберите доступный вариант','Оберіть доступний варіант'],image:['Фото {n}','Фото {n}'],noImage:['Без фото','Без фото'],banner:['Баннер {n}','Банер {n}'],visit:['Подробнее','Детальніше'],expires:['Сессия устарела. Обновите страницу.','Сесія застаріла. Оновіть сторінку.']};\nfunction ukrainian(){return lang==='ua'&&!(typeof isAdmin!=='undefined'&&isAdmin);}\nfunction t(key,values={}){const pair=messages[key];let result=pair?pair[ukrainian()?1:0]:key;for(const [k,v]of Object.entries(values))result=result.replaceAll('{'+k+'}',String(v));return result;}\nfunction loc(obj,key='name'){return ukrainian()?(obj?.[key+'_de']||obj?.[key]||''):(obj?.[key]||'');}\nfunction locale(){return ukrainian()?'uk-UA':'ru-RU';}\nfunction translatedPairs(original={},translated={}){return Object.entries(original).map(([k,v])=>[ukrainian()?(translated[k]?.name||k):k,ukrainian()?(translated[k]?.value||v):v]);}\nfunction optionsText(v){return translatedPairs(v?.options,v?.options_de).map(([k,val])=>k+': '+val).join(' · ');}\nfunction frontMessage(message){const keys={'Подарунок у кошику':'added','Додано до кошика':'added','Оберіть варіант':'chooseVariant','У кошику вже весь доступний залишок':'cartStock','Сервер недоступний':'serverError','Не вдалося виконати запит':'requestError'};return keys[message]?t(keys[message]):message;}\n", 'index.html': '<!doctype html>\n<html lang="ru">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n  <meta name="theme-color" content="#090212">\n  <title>Мой магазин</title>\n  <link rel="icon" href="/assets/mark.svg" type="image/svg+xml">\n  <link rel="stylesheet" href="/assets/app.css?v=9">\n  <script src="https://telegram.org/js/telegram-web-app.js" defer></script>\n  <script src="/assets/i18n.js?v=9" defer></script>\n  <script src="/assets/app.js?v=9" defer></script>\n  <script src="/assets/features.js?v=9" defer></script>\n  <script src="/assets/referrals.js?v=9" defer></script>\n</head>\n<body>\n  <div id="app"><div class="boot">◈<p>Завантаження / Загрузка…</p></div></div>\n  <dialog id="modal"></dialog>\n  <div id="toast" role="status" aria-live="polite"></div>\n</body>\n</html>\n', 'mark.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#222921"/><path d="M18 24h28l2 27H16l2-27Zm8 0v-7a6 6 0 0 1 12 0v7" fill="none" stroke="#c9ecb7" stroke-width="3" stroke-linejoin="round"/></svg>', 'referrals.js': '\'use strict\';\nObject.assign(messages,{\n referrals:[\'Приглашай друзей\',\'Freunde einladen\'],bonusBalance:[\'Бонусный баланс\',\'Bonusguthaben\'],bonusSpent:[\'Оплата бонусами\',\'Mit Bonus bezahlt\'],bonusUse:[\'Использовать бонусы\',\'Bonus verwenden\'],bonusAvailable:[\'Доступно к списанию: {amount}\',\'Einlösbar: {amount}\'],bonusRules:[\'Бонусы начисляются после выполнения заказа. Их можно потратить на товары; вывод деньгами недоступен.\',\'Boni werden nach Abschluss der Bestellung gutgeschrieben. Sie gelten für Artikel; eine Auszahlung ist nicht möglich.\'],bonusTg:[\'Откройте магазин внутри Telegram для участия и использования бонусов.\',\'Öffnen Sie den Shop in Telegram, um teilzunehmen und Boni zu nutzen.\'],bonusOff:[\'Программа временно выключена. Ваш баланс сохранён.\',\'Das Programm ist vorübergehend deaktiviert. Ihr Guthaben bleibt erhalten.\'],refCode:[\'Ваш код\',\'Ihr Code\'],refCopy:[\'Скопировать ссылку\',\'Link kopieren\'],refCopied:[\'Ссылка скопирована\',\'Link kopiert\'],refCopyManual:[\'Скопируйте ссылку из поля\',\'Kopieren Sie den Link aus dem Feld\'],refInvited:[\'Приглашено: {n}\',\'Eingeladen: {n}\'],refEarned:[\'Начислено всего: {amount}\',\'Insgesamt gutgeschrieben: {amount}\'],refClaim:[\'Код приглашения\',\'Einladungscode\'],refAccepted:[\'Приглашение принято\',\'Einladung angenommen\'],refAlready:[\'Пригласивший закреплён за вашим профилем.\',\'Ihr Einladender ist Ihrem Profil zugeordnet.\'],refBefore:[\'Принять приглашение можно только до первого заказа.\',\'Einladungen können nur vor der ersten Bestellung angenommen werden.\'],refHistory:[\'Последние операции\',\'Letzte Buchungen\'],refEmpty:[\'Операций пока нет\',\'Noch keine Buchungen\'],reward:[\'За покупку друга\',\'Für einen Einkauf eines Freundes\'],welcome:[\'Приветственный бонус\',\'Willkommensbonus\'],spend:[\'Списание\',\'Einlösung\'],refund:[\'Возврат при отмене\',\'Erstattung bei Stornierung\'],refReward:[\'Вам: {amount} за {orders} друга.\',\'Für Sie: {amount} für {orders} eines Freundes.\'],refFirst:[\'первый выполненный заказ\',\'die erste abgeschlossene Bestellung\'],refAll:[\'каждый выполненный заказ\',\'jede abgeschlossene Bestellung\'],refWelcome:[\'Другу после первого подходящего заказа: {amount}.\',\'Für Ihren Freund nach der ersten qualifizierten Bestellung: {amount}.\'],refMinimum:[\'Минимальная сумма товаров для начисления: {amount}.\',\'Mindestwarenwert für eine Gutschrift: {amount}.\'],refCap:[\'Максимальный бонус за заказ: {amount}.\',\'Maximaler Bonus pro Bestellung: {amount}.\'],refSpendRule:[\'Бонусами можно оплатить до {n}% товаров после промокода.\',\'Boni können bis zu {n}% des Warenwerts nach Gutscheinen decken.\'],refNoPromo:[\'Совмещение с промокодом отключено.\',\'Nicht mit Gutscheinen kombinierbar.\'],refSpendOff:[\'Списание бонусов временно отключено.\',\'Das Einlösen von Boni ist vorübergehend deaktiviert.\'],openTelegram:[\'Открыть в Telegram\',\'In Telegram öffnen\']\n});\nlet referralState=null;\ntry{const code=new URL(location.href).searchParams.get(\'ref\');if(/^[a-f0-9]{24}$/.test(code||\'\'))localStorage.setItem(\'pending-referral\',code);}catch{}\nconst baseLoadCatalog=loadCatalog;\nloadCatalog=async function(){await baseLoadCatalog();if(isAdmin)return;referralState=await api(\'/api/referrals\');const code=localStorage.getItem(\'pending-referral\');if(code&&referralState.eligible&&referralState.config.enabled){try{await api(\'/api/referrals/claim\',{method:\'POST\',body:{code}});toast(t(\'refAccepted\'));}catch(e){toast(e.message);}localStorage.removeItem(\'pending-referral\');referralState=await api(\'/api/referrals\');}};\nfunction referralLink(code){const bot=referralState?.config.bot_username;if(bot)return \'https://t.me/\'+bot+\'?start=r_\'+code;return location.origin+\'/?ref=\'+encodeURIComponent(code);}\nfunction referralRules(c){const amount=c.reward_type===\'percent\'?c.reward_percent+\'%\':money(c.reward_fixed);return `<p>${esc(t(\'refReward\',{amount,orders:t(c.first_only?\'refFirst\':\'refAll\')}))}</p>${c.welcome?`<p>${esc(t(\'refWelcome\',{amount:money(c.welcome)}))}</p>`:\'\'}${c.minimum?`<p>${esc(t(\'refMinimum\',{amount:money(c.minimum)}))}</p>`:\'\'}${c.reward_cap?`<p>${esc(t(\'refCap\',{amount:money(c.reward_cap)}))}</p>`:\'\'}<p>${t(\'bonusRules\')}</p><p>${c.spend_enabled?t(\'refSpendRule\',{n:c.spend_percent}):t(\'refSpendOff\')}</p>${!c.combine_promo?`<p>${t(\'refNoPromo\')}</p>`:\'\'}`;}\nfunction referralMarkup(){const r=referralState;if(!r||(!r.config.enabled&&!r.balance&&!r.history.length))return \'\';const c=r.config;return `<section class="panel referral-panel"><h2>${t(\'referrals\')}</h2>${!c.enabled?`<p class="notice">${t(\'bonusOff\')}</p>`:\'\'}${!r.eligible?`<p>${t(\'bonusTg\')}</p>${c.bot_username?`<a class="btn primary" href="https://t.me/${esc(c.bot_username)}${localStorage.getItem(\'pending-referral\')?\'?start=r_\'+encodeURIComponent(localStorage.getItem(\'pending-referral\')):\'\'}">${t(\'openTelegram\')}</a>`:\'\'}`:`<p class="eyebrow">${t(\'bonusBalance\')}</p><h2>${money(r.balance)}</h2><div class="row wrap"><span>${t(\'refInvited\',{n:r.invited})}</span><span>${t(\'refEarned\',{amount:money(r.earned)})}</span></div>${c.enabled?`<label class="field">${t(\'refCode\')}<input readonly value="${esc(referralLink(r.code))}" id="referral-link"></label>${btn(t(\'refCopy\'),\'copy-referral\',\'\',\'primary\')}<p class="tiny muted">${esc(r.code)}</p>${r.has_inviter?`<p>${t(\'refAlready\')}</p>`:`<form id="referral-claim-form">${field(\'code\',t(\'refClaim\'),\'\',\'text\',\'required maxlength="48"\')}<button class="btn secondary" type="submit">${t(\'apply\')}</button><p class="tiny muted">${t(\'refBefore\')}</p>${errorBox()}</form>`}`:\'\'}<h3>${t(\'refHistory\')}</h3>${r.history.length?r.history.map(h=>`<div class="row spread"><span>${t(h.kind)}<small class="muted"> · ${new Date(h.created*1000).toLocaleDateString(locale())}</small></span><b>${h.amount>0?\'+\':\'\'}${money(h.amount)}</b></div>`).join(\'\'):`<p class="muted">${t(\'refEmpty\')}</p>`}`}<div class="tiny muted">${referralRules(c)}</div></section>`;}\nconst baseProfile=profileMarkup;profileMarkup=function(){return baseProfile()+referralMarkup();};\nconst baseCart=cartMarkup;cartMarkup=function(){const html=baseCart();if(!cart.length||!referralState?.eligible||!referralState.config.enabled||!referralState.config.spend_enabled||!referralState.balance)return html;return html.replace(\'<div id="quote-summary">\',`<div class="bonus-control">${check(\'use_bonus\',t(\'bonusUse\'),!!draft.use_bonus)}<p class="tiny muted">${t(\'bonusBalance\')}: ${money(referralState.balance)}</p><p id="bonus-available" class="tiny muted"></p></div><div id="quote-summary">`);};\nconst baseQuote=refreshQuote;refreshQuote=async function(){await baseQuote();if($(\'#bonus-available\')&&quoteResult)$(\'#bonus-available\').textContent=t(\'bonusAvailable\',{amount:money(quoteResult.bonus_limit)});};\nconst defaultReferralConfig={enabled:false,reward_type:\'percent\',reward_percent:5,reward_fixed:500,reward_cap:0,minimum:0,first_only:true,welcome:0,spend_enabled:true,spend_percent:30,combine_promo:true,bot_username:\'\'};\nfunction referralsAdmin(){const r=admin.referrals||{config:defaultReferralConfig,accounts:[],ledger:[]},c=r.config;return header(\'Реферальная программа\',\'Приглашения и бонусы\')+`<form id="referral-settings-form" class="panel settings-form">${check(\'enabled\',\'Программа включена\',c.enabled)}<p class="muted">Участники входят через Telegram. Начисление — только после выполнения заказа, без доставки, после промокода и списанных бонусов. Настройки начисления фиксируются при создании заказа.</p><div class="form-grid">${field(\'bot_username\',\'Username бота (без @)\',c.bot_username,\'text\',\'maxlength="32" placeholder="ShopBot"\')}${select(\'reward_type\',\'Бонус пригласившему\',[[\'percent\',\'Процент\'],[\'fixed\',\'Фиксированная сумма\']],c.reward_type)}${field(\'reward_percent\',\'Процент бонуса\',c.reward_percent,\'number\',\'required min="0" max="100" step="1"\')}${field(\'reward_fixed\',\'Фиксированный бонус\',c.reward_fixed/100,\'number\',\'required min="0" step="0.01"\')}${field(\'reward_cap\',\'Максимум за заказ (0 — без отдельного лимита)\',c.reward_cap/100,\'number\',\'required min="0" step="0.01"\')}${field(\'minimum\',\'Минимальная сумма для начисления\',c.minimum/100,\'number\',\'required min="0" step="0.01"\')}${field(\'welcome\',\'Другу за первый подходящий заказ\',c.welcome/100,\'number\',\'required min="0" step="0.01"\')}${field(\'spend_percent\',\'Максимальная доля оплаты бонусами, %\',c.spend_percent,\'number\',\'required min="0" max="100" step="1"\')}</div>${check(\'first_only\',\'Начислять пригласившему только за первый подходящий заказ\',c.first_only)}${check(\'spend_enabled\',\'Разрешить оплату бонусами\',c.spend_enabled)}${check(\'combine_promo\',\'Разрешить бонусы вместе с промокодом\',c.combine_promo)}<p class="tiny muted">1 единица бонусного баланса = 1 единица валюты магазина. Бонус не превышает оплаченную стоимость товаров. При отмене списанные бонусы возвращаются. Отключение сохраняет баланс; уже созданные заказы используют прежние условия начисления. Вывода денег нет.</p>${errorBox()}<button class="btn primary" type="submit">Сохранить</button></form><h2>Участники (${r.accounts.length})</h2><div class="management-cards">${r.accounts.map(a=>`<article class="management-card"><h3>${esc(a.telegram.username?\'@\'+a.telegram.username:a.telegram.first_name||a.owner)}</h3><p class="tiny muted">${esc(a.owner)} · ${esc(a.code)}</p><p>Пригласивший: ${esc(a.inviter||\'—\')}</p><div class="row spread"><b>${money(a.balance)}</b><span>Приглашено: ${a.invited}</span></div></article>`).join(\'\')}</div><h2>Последние операции</h2><div class="management-cards">${r.ledger.map(l=>`<article class="management-card"><b>${esc(l.owner)} · Заказ #${l.order_id}</b><p>${esc({reward:\'Бонус за друга\',welcome:\'Приветственный бонус\',spend:\'Списание\',refund:\'Возврат\'}[l.kind]||l.kind)}: ${money(l.amount)}</p><p class="tiny muted">${new Date(l.created*1000).toLocaleString(\'ru-RU\')}</p></article>`).join(\'\')||\'<p class="muted">Операций пока нет.</p>\'}</div>`;}\ndocument.addEventListener(\'change\',e=>{if(e.target.name===\'use_bonus\'){draft.use_bonus=e.target.checked;checkoutKey=null;refreshQuote();}});\ndocument.addEventListener(\'click\',async e=>{if(!e.target.closest(\'[data-action="copy-referral"]\'))return;e.preventDefault();try{await navigator.clipboard.writeText(referralLink(referralState.code));toast(t(\'refCopied\'));}catch{$(\'#referral-link\').select();toast(t(\'refCopyManual\'));}});\ndocument.addEventListener(\'submit\',async e=>{const f=e.target;if(![\'referral-settings-form\',\'referral-claim-form\'].includes(f.id))return;e.preventDefault();e.stopImmediatePropagation();if(busy||!f.reportValidity())return;busy=true;setBusy();try{const data=Object.fromEntries(new FormData(f));if(f.id===\'referral-settings-form\'){for(const key of [\'enabled\',\'first_only\',\'spend_enabled\',\'combine_promo\'])data[key]=f.elements[key].checked;await api(\'/api/admin/referrals\',{method:\'PUT\',body:data});await refreshAdmin();toast(\'Настройки сохранены\');}else{await api(\'/api/referrals/claim\',{method:\'POST\',body:data});referralState=await api(\'/api/referrals\');renderStore();toast(t(\'refAccepted\'));}}catch(err){formError(err);}finally{busy=false;setBusy();}},true);\nboot();\n'}

"""Universal store: single-process application. Money is stored in minor units.

Run `python server.py init-admin`, then `python server.py`.
No credentials or customer data from the previous store are imported.
"""
import asyncio
import referrals
import contextlib
from datetime import datetime, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from localization import translate_error, notification
import getpass
import hashlib
import hmac
import io
import json
import logging
import os
import re
import secrets
import sqlite3
import time
import warnings
from collections import defaultdict, deque
from decimal import Decimal, InvalidOperation
from pathlib import Path
from urllib.parse import parse_qsl

from aiohttp import web, ClientSession, ClientTimeout
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
DATA = Path(os.getenv('DATA_DIR', str(ROOT / 'data')))
STATUSES = {'new': 'Новий', 'confirmed': 'Підтверджено', 'paid': 'Оплачено',
            'transferred': 'Виконано', 'cancelled': 'Скасовано'}
TRANSITIONS = {'new': ['confirmed', 'cancelled'], 'confirmed': ['paid', 'cancelled'],
               'paid': ['transferred'], 'transferred': [], 'cancelled': []}
DEFAULT_SETTINGS = {'name': 'Fog Dog', 'subtitle': 'Выбирай своё',
                    'currency': 'EUR', 'support': '', 'accent': '#a64aff',
                    'hero_title': 'То, что тебе подходит.',
                    'hero_text': 'Найди своё среди наших товаров.',
                    'payment_info': 'Способ оплаты согласуем после подтверждения заказа.',
                    'logo': '', 'banner': '', 'delivery_enabled': True,
                    'pickup_enabled': True, 'delivery_cost': 499, 'free_shipping_from': 5000,
                    'free_shipping_enabled': True, 'minimum_order': 0, 'default_language': 'ua',
                    'name_de': '', 'subtitle_de': 'Finde deinen Stil', 'hero_title_de': 'Was zu dir passt.',
                    'hero_text_de': 'Entdecke deine Favoriten in unserem Sortiment.',
                    'payment_info_de': 'Die Zahlungsdetails werden nach der Bestellbestätigung vereinbart.',
                    'description': '', 'description_de': '', 'contact_text': '', 'contact_text_de': '',
                    'favicon': '', 'accent_secondary': '#230f36', 'background': '#090212', 'text_color': '#e0d8ea',
                    'links': [], 'banners': [], 'timezone': 'Europe/Berlin'}
SCHEMA = '''
CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires INTEGER NOT NULL, admin INTEGER NOT NULL DEFAULT 0, owner TEXT NOT NULL, telegram TEXT);
CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', parent_id INTEGER REFERENCES categories(id), position INTEGER NOT NULL DEFAULT 0, hidden INTEGER NOT NULL DEFAULT 0, image TEXT NOT NULL DEFAULT '', icon TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, sku TEXT NOT NULL UNIQUE, category_id INTEGER REFERENCES categories(id), price INTEGER NOT NULL, old_price INTEGER NOT NULL DEFAULT 0, description TEXT NOT NULL DEFAULT '', traits TEXT NOT NULL DEFAULT '{}', images TEXT NOT NULL DEFAULT '[]', featured INTEGER NOT NULL DEFAULT 0, is_new INTEGER NOT NULL DEFAULT 0, hidden INTEGER NOT NULL DEFAULT 0, availability TEXT NOT NULL DEFAULT 'available', deleted INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL, stock INTEGER NOT NULL DEFAULT 0, category_ids TEXT NOT NULL DEFAULT '[]', variants TEXT NOT NULL DEFAULT '[]', revision INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, extension TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS promos (id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, percent INTEGER NOT NULL CHECK(percent BETWEEN 1 AND 100), minimum INTEGER NOT NULL DEFAULT 0, max_uses INTEGER NOT NULL DEFAULT 100, used INTEGER NOT NULL DEFAULT 0, enabled INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, owner TEXT NOT NULL, request_key TEXT NOT NULL, recipient TEXT NOT NULL, telegram_id TEXT, total INTEGER NOT NULL, subtotal INTEGER NOT NULL, discount INTEGER NOT NULL, currency TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', items TEXT NOT NULL, promo_id INTEGER, note TEXT NOT NULL DEFAULT '', reference TEXT NOT NULL DEFAULT '', created INTEGER NOT NULL, updated INTEGER NOT NULL, shipping INTEGER NOT NULL DEFAULT 0, fulfillment TEXT NOT NULL DEFAULT '{}', UNIQUE(owner,request_key));
CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, action TEXT NOT NULL, entity TEXT NOT NULL, created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS pickup_points (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, address TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', hours TEXT NOT NULL DEFAULT '', map_url TEXT NOT NULL DEFAULT '', active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS shipping_rates (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL DEFAULT '', price INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS outbox (id INTEGER PRIMARY KEY, chat_id TEXT NOT NULL, message TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, next_try INTEGER NOT NULL DEFAULT 0, sent INTEGER NOT NULL DEFAULT 0);
'''

def now():
    return int(time.time())

def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()

def migrate(db, directory):
    legacy = db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='gifts'").fetchone()
    if not legacy:
        return
    backup = directory / f'before-universal-{now()}.sqlite3'
    with sqlite3.connect(backup) as dest:
        db.backup(dest)
    with db:
        db.execute('BEGIN IMMEDIATE')
        db.execute('ALTER TABLE collections RENAME TO categories')
        db.execute('ALTER TABLE gifts RENAME TO products')
        db.execute('ALTER TABLE products RENAME COLUMN collection_id TO category_id')
        db.execute('ALTER TABLE products DROP COLUMN nft_url')
        for table, definition in [
            ('categories', "image TEXT NOT NULL DEFAULT ''"), ('categories', "icon TEXT NOT NULL DEFAULT ''"),
            ('products', 'stock INTEGER NOT NULL DEFAULT 0'), ('products', "category_ids TEXT NOT NULL DEFAULT '[]'"),
            ('products', "variants TEXT NOT NULL DEFAULT '[]'"), ('products', 'revision INTEGER NOT NULL DEFAULT 1'), ('orders', 'shipping INTEGER NOT NULL DEFAULT 0'),
            ('orders', "fulfillment TEXT NOT NULL DEFAULT '{}'"),
        ]:
            db.execute(f'ALTER TABLE {table} ADD COLUMN {definition}')
        for row in db.execute('SELECT id,category_id,availability FROM products').fetchall():
            db.execute("UPDATE products SET category_ids=?,stock=?,availability='available' WHERE id=?",
                       (json.dumps([row['category_id']] if row['category_id'] else []), int(row['availability'] == 'available'), row['id']))
        old_config = json.loads(db.execute("SELECT value FROM config WHERE key='settings'").fetchone()[0])
        legacy_defaults = {'name': 'Gift Atelier', 'subtitle': 'Колекційні подарунки Telegram',
            'hero_title': 'Подарунок із характером.',
            'hero_text': 'Обирай колекційний подарунок. Ми підтвердимо деталі та передамо його особисто.'}
        for key, old_default in legacy_defaults.items():
            if old_config.get(key) == old_default:
                old_config[key] = DEFAULT_SETTINGS[key]
        db.execute("UPDATE config SET value=? WHERE key='settings'", (json.dumps({**DEFAULT_SETTINGS, **old_config}),))
        for row in db.execute('SELECT id,items FROM orders').fetchall():
            items = json.loads(row['items'])
            for item in items:
                item.update({'quantity': 1, 'variant_id': '', 'options': {}})
            db.execute('UPDATE orders SET items=? WHERE id=?', (json.dumps(items), row['id']))
        db.execute("DELETE FROM sessions")
        db.execute('PRAGMA user_version=2')

def migrate_v3(db, directory):
    columns = {r[1] for r in db.execute('PRAGMA table_info(products)')}
    if 'name_de' in columns:
        return
    existing = db.execute("SELECT value FROM config WHERE key='settings'").fetchone()
    if existing:
        with sqlite3.connect(directory / f'before-mobile-v3-{now()}.sqlite3') as dest:
            db.backup(dest)
    with db:
        db.execute('BEGIN IMMEDIATE')
        additions = {
            'products': ["name_de TEXT NOT NULL DEFAULT ''", "description_de TEXT NOT NULL DEFAULT ''", "traits_de TEXT NOT NULL DEFAULT '{}'"],
            'categories': ["name_de TEXT NOT NULL DEFAULT ''", "description_de TEXT NOT NULL DEFAULT ''"],
            'pickup_points': [f"{k}_de TEXT NOT NULL DEFAULT ''" for k in ('name','city','address','description','hours')],
            'shipping_rates': ["name_de TEXT NOT NULL DEFAULT ''", "description TEXT NOT NULL DEFAULT ''", "description_de TEXT NOT NULL DEFAULT ''",
                "eta TEXT NOT NULL DEFAULT ''", "eta_de TEXT NOT NULL DEFAULT ''", 'free_shipping_from INTEGER NOT NULL DEFAULT 0',
                'inherit_free_shipping INTEGER NOT NULL DEFAULT 1', 'position INTEGER NOT NULL DEFAULT 0'],
            'orders': ["payment TEXT NOT NULL DEFAULT '{}'", "language TEXT NOT NULL DEFAULT 'ua'", "customer TEXT NOT NULL DEFAULT '{}'"],
        }
        for table, definitions in additions.items():
            for definition in definitions:
                db.execute(f'ALTER TABLE {table} ADD COLUMN {definition}')
        db.execute("CREATE TABLE payment_methods (id INTEGER PRIMARY KEY, name TEXT NOT NULL, name_de TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '', description_de TEXT NOT NULL DEFAULT '', instructions TEXT NOT NULL DEFAULT '', instructions_de TEXT NOT NULL DEFAULT '', active INTEGER NOT NULL DEFAULT 1, position INTEGER NOT NULL DEFAULT 0)")
        db.execute("CREATE TABLE customers (owner TEXT PRIMARY KEY, first_seen INTEGER NOT NULL, last_seen INTEGER NOT NULL, telegram TEXT NOT NULL DEFAULT '{}', language TEXT NOT NULL DEFAULT 'ua')")
        db.execute("CREATE TABLE order_statuses (code TEXT PRIMARY KEY, name TEXT NOT NULL, name_de TEXT NOT NULL, kind TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, position INTEGER NOT NULL DEFAULT 0)")
        for index, (code, name, de, kind) in enumerate([
            ('new','Новый','Neu','new'), ('confirmed','В работе','In Bearbeitung','process'),
            ('paid','Оплачен','Bezahlt','paid'), ('transferred','Выполнен','Abgeschlossen','done'), ('cancelled','Отменён','Storniert','cancelled')]):
            db.execute('INSERT INTO order_statuses VALUES (?,?,?,?,1,?)', (code,name,de,kind,index))
        if existing:
            cfg = json.loads(existing[0])
            # Preserve the old standard method as an editable database record, not an implicit fallback.
            db.execute('INSERT INTO shipping_rates(name,name_de,price,inherit_free_shipping) VALUES (?,?,?,1)',
                       ('Стандартная доставка','Standardversand',cfg.get('delivery_cost',499)))
            db.execute('INSERT INTO payment_methods(name,name_de,instructions,instructions_de) VALUES (?,?,?,?)',
                       ('По согласованию','Nach Vereinbarung',cfg.get('payment_info',''),DEFAULT_SETTINGS['payment_info_de']))
            previous_defaults = {'name':'Мій магазин','subtitle':'Обирай своє','hero_title':'Те, що тобі пасує.',
                'hero_text':'Знайди своє серед наших товарів.', 'payment_info':'Спосіб оплати узгоджуємо після підтвердження замовлення.'}
            for key, value in previous_defaults.items():
                if cfg.get(key) == value:
                    cfg[key] = DEFAULT_SETTINGS[key]
            db.execute("UPDATE config SET value=? WHERE key='settings'", (json.dumps({**DEFAULT_SETTINGS, **cfg}),))
        for row in db.execute('SELECT owner,MIN(created) AS first_seen,MAX(updated) AS last_seen FROM orders GROUP BY owner').fetchall():
            db.execute('INSERT OR IGNORE INTO customers(owner,first_seen,last_seen) VALUES (?,?,?)', tuple(row))
        db.execute('PRAGMA user_version=3')


def status_rows(db):
    return rows(db, 'SELECT * FROM order_statuses ORDER BY position,code')

def allowed_transitions(db):
    states = status_rows(db)
    allowed = {'new': {'process','cancelled'}, 'process': {'process','paid','done','cancelled'}, 'paid': {'done'}, 'done': set(), 'cancelled': set()}
    return {x['code']: [y['code'] for y in states if y['active'] and y['code'] != x['code'] and y['kind'] in allowed[x['kind']]] for x in states}

def db_open(directory=DATA):
    directory.mkdir(parents=True, exist_ok=True)
    (directory / 'images').mkdir(exist_ok=True)
    db = sqlite3.connect(directory / 'store.sqlite3')
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    db.execute('PRAGMA journal_mode=WAL')
    migrate(db, directory)
    db.executescript(SCHEMA)
    migrate_v3(db, directory)
    referrals.migrate(db, directory)
    db.execute('INSERT OR IGNORE INTO config VALUES (?,?)', ('settings', json.dumps(DEFAULT_SETTINGS)))
    db.commit()
    return db

def rows(db, sql, params=()):
    return [dict(x) for x in db.execute(sql, params)]

def settings(db):
    return {**DEFAULT_SETTINGS, **json.loads(db.execute("SELECT value FROM config WHERE key='settings'").fetchone()[0])}

def audit(db, action, entity):
    db.execute('INSERT INTO audit(action,entity,created) VALUES (?,?,?)', (action, str(entity), now()))

def fail(message, status=400):
    raise ApiError(message, status)

class ApiError(Exception):
    def __init__(self, message, status=400):
        self.message, self.status = message, status

def text(value, limit=500, required=False):
    if not isinstance(value, str) or len(value) > limit:
        fail('Некоректний текст або перевищено довжину поля')
    value = value.strip()
    if required and not value:
        fail('Заповніть обов’язкові поля')
    return value

def integer(value, minimum=0, maximum=1000000):
    if isinstance(value, bool):
        fail('Очікується ціле число')
    try:
        result = int(str(value))
    except (ValueError, TypeError):
        fail('Очікується ціле число')
    if not minimum <= result <= maximum:
        fail('Число поза дозволеним діапазоном')
    return result

def money(value):
    try:
        val = Decimal(str(value))
        if not val.is_finite() or val < 0 or val > 10000000 or val != val.quantize(Decimal('.01')):
            fail('Ціна має бути від 0 до 10 000 000, не більше двох знаків після коми')
        return int(val * 100)
    except (InvalidOperation, ValueError, TypeError):
        fail('Некоректна ціна')

def telegram_user(raw, token):
    try:
        pairs = parse_qsl(raw, strict_parsing=True)
        data = dict(pairs)
        if len(pairs) != len(data):
            fail('Некоректний Telegram initData', 401)
        supplied = data.pop('hash')
        secret = hmac.new(b'WebAppData', token.encode(), hashlib.sha256).digest()
        check = '\n'.join(f'{k}={v}' for k, v in sorted(data.items()))
        expected = hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()
        if not token or not hmac.compare_digest(supplied, expected) or not -30 <= now() - int(data['auth_date']) <= 3600:
            fail('Telegram-сесія застаріла. Відкрийте Mini App повторно.', 401)
        user = json.loads(data['user'])
        integer(user['id'], 1, 10**16)
        return {key: user[key] for key in ('id', 'first_name', 'username') if key in user}
    except (KeyError, TypeError, ValueError):
        fail('Некоректний Telegram initData', 401)

async def body(request):
    try:
        value = await request.json()
        if not isinstance(value, dict):
            fail('Очікується JSON-об’єкт')
        return value
    except (json.JSONDecodeError, UnicodeDecodeError):
        fail('Некоректний JSON')

def get_session(request, admin=False):
    row = request.app['db'].execute('SELECT * FROM sessions WHERE token=? AND expires>?',
                                   (digest(request.cookies.get('store_session', '')), now())).fetchone()
    if not row or (admin and not row['admin']):
        fail('Увійдіть до адмінпанелі' if admin else 'Оновіть сторінку', 401)
    if request.method not in ('GET', 'HEAD') and not hmac.compare_digest(request.headers.get('X-CSRF-Token', ''), row['csrf']):
        fail('Оновіть сторінку: недійсний токен сесії', 403)
    return row

@web.middleware
async def guard(request, handler):
    try:
        if request.path.startswith('/api/'):
            db = request.app['db']
            # Do not trust user-supplied IDs or proxy headers as rate-limit keys.
            stamp = time.monotonic()
            kind = 'login' if request.path == '/api/login' else ('checkout' if request.path == '/api/orders' and request.method == 'POST' else 'api')
            key = (request.remote, kind)
            buckets = request.app['limits']
            if len(buckets) > 10000:
                for old in list(buckets):
                    if not buckets[old] or buckets[old][-1] < stamp - 60:
                        del buckets[old]
            queue = buckets[key]
            while queue and queue[0] < stamp - 60:
                queue.popleft()
            if len(queue) >= (8 if key[1] in ('login', 'checkout') else 240):
                fail('Забагато запитів. Спробуйте за хвилину.', 429)
            queue.append(stamp)
            origin = request.headers.get('Origin')
            expected = request.app['public_url'] or f'{request.scheme}://{request.host}'
            if request.method not in ('GET', 'HEAD') and origin and origin.rstrip('/') != expected:
                fail('Запит з іншого сайту заборонено', 403)
            if request.path.startswith('/api/admin/'):
                get_session(request, admin=True)
        response = await handler(request)
    except (ApiError, referrals.ReferralError) as exc:
        response = web.json_response({'error': translate_error(exc.message, request.headers.get('X-Language', 'ua'))}, status=exc.status)
    except sqlite3.IntegrityError:
        response = web.json_response({'error': translate_error('Такий артикул або код уже існує, або запис використовується.', request.headers.get('X-Language','ua'))}, status=409)
    except web.HTTPException:
        raise
    except Exception:
        logging.exception('Request failed: %s', request.path)
        response = web.json_response({'error': translate_error('Помилка сервера. Дані не збережено.',request.headers.get('X-Language','ua'))}, status=500)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'same-origin'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' https://telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'"
    if request.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response

def new_session(request, old=None, admin=False, user=None):
    db = request.app['db']
    token, csrf = secrets.token_urlsafe(32), secrets.token_urlsafe(32)
    owner = f"tg:{user['id']}" if user else (old['owner'] if old else f'web:{secrets.token_hex(16)}')
    tg = json.dumps(user) if user else (old['telegram'] if old else None)
    ttl = 8 * 3600 if admin else 30 * 86400
    lang = request.headers.get('X-Language', settings(db)['default_language'])
    lang = lang if lang in ('ru','ua') else 'ru'
    with db:
        db.execute('DELETE FROM sessions WHERE expires<?', (now(),))
        if old:
            db.execute('DELETE FROM sessions WHERE token=?', (old['token'],))
        db.execute('INSERT INTO sessions VALUES (?,?,?,?,?,?)', (digest(token), csrf, now() + ttl, int(admin), owner, tg))
        db.execute("INSERT INTO customers(owner,first_seen,last_seen,telegram,language) VALUES (?,?,?,?,?) ON CONFLICT(owner) DO UPDATE SET last_seen=excluded.last_seen,telegram=excluded.telegram,language=excluded.language", (owner,now(),now(),tg or '{}',lang))
    response = web.json_response({'csrf': csrf, 'admin': admin, 'user': json.loads(tg) if tg else None})
    response.set_cookie('store_session', token, httponly=True, secure=request.app['secure'], samesite='Lax', max_age=ttl, path='/')
    return response

async def session(request):
    db = request.app['db']
    old = db.execute('SELECT * FROM sessions WHERE token=? AND expires>?', (digest(request.cookies.get('store_session', '')), now())).fetchone()
    if old:
        return web.json_response({'csrf': old['csrf'], 'admin': bool(old['admin']), 'user': json.loads(old['telegram']) if old['telegram'] else None})
    return new_session(request)

async def login(request):
    old = get_session(request)
    data = await body(request)
    config = request.app['db'].execute("SELECT value FROM config WHERE key='admin_password'").fetchone()
    if not config:
        fail('Спочатку виконайте на сервері: python server.py init-admin', 503)
    password = text(data.get('password', ''), 256, True)
    saved = json.loads(config[0])
    actual = await asyncio.to_thread(hashlib.scrypt, password.encode(), salt=bytes.fromhex(saved['salt']), n=16384, r=8, p=1)
    if not hmac.compare_digest(actual.hex(), saved['hash']):
        fail('Неправильний пароль', 401)
    return new_session(request, old, True)

async def logout(request):
    return new_session(request, get_session(request))

async def connect_telegram(request):
    old = get_session(request)
    data = await body(request)
    user = telegram_user(text(data.get('initData', ''), 16000, True), os.getenv('BOT_TOKEN', ''))
    # Only a cryptographically verified Telegram identity may grant this role.
    return new_session(request, old, user['id'] in request.app['telegram_admin_ids'], user)

def product_record(row):
    obj = dict(row)
    for key in ('images', 'traits', 'category_ids', 'variants', 'traits_de'):
        obj[key] = json.loads(obj[key])
    obj['status'] = 'archived' if obj['deleted'] else ('hidden' if obj['hidden'] else 'active')
    if obj['variants']:
        obj['stock'] = sum(v['stock'] for v in obj['variants'])
    display_price = min((v['price'] if v['price'] is not None else obj['price'] for v in obj['variants']), default=obj['price'])
    obj['discount_percent'] = round((1 - display_price / obj['old_price']) * 100) if obj['old_price'] > display_price else 0
    return obj

def visible_categories(db):
    all_rows = rows(db, 'SELECT * FROM categories ORDER BY position,id')
    hidden = {r['id'] for r in all_rows if r['hidden']}
    for _ in all_rows:
        hidden.update(r['id'] for r in all_rows if r['parent_id'] in hidden)
    return [r for r in all_rows if r['id'] not in hidden], hidden

def is_visible(product, hidden):
    return not product['deleted'] and not product['hidden'] and (not product['category_ids'] or any(c not in hidden for c in product['category_ids']))

async def catalog(request):
    db = request.app['db']
    categories, hidden = visible_categories(db)
    products = [product_record(r) for r in db.execute('SELECT * FROM products ORDER BY featured DESC,id DESC')]
    products = [p for p in products if is_visible(p, hidden)]
    for p in products:
        p['category_ids'] = [c for c in p['category_ids'] if c not in hidden]
    return web.json_response({'products': products, 'categories': categories, 'settings': settings(db),
        'pickup_points': rows(db, 'SELECT * FROM pickup_points WHERE active=1 ORDER BY id'),
        'shipping_rates': rows(db, 'SELECT * FROM shipping_rates WHERE active=1 ORDER BY position,id'),
        'payment_methods': rows(db, 'SELECT * FROM payment_methods WHERE active=1 ORDER BY position,id'), 'order_statuses': status_rows(db)})

def order_record(row, private=False):
    obj = dict(row)
    obj['items'] = json.loads(obj['items'])
    obj['fulfillment'] = json.loads(obj['fulfillment'])
    obj['payment'] = json.loads(obj['payment'])
    obj['customer'] = json.loads(obj['customer'])
    obj.pop('referral_snapshot', None)
    if not private:
        for key in ('note', 'owner', 'request_key', 'telegram_id', 'promo_id'):
            obj.pop(key, None)
    return obj

async def my_orders(request):
    s = get_session(request)
    return web.json_response([order_record(r) for r in request.app['db'].execute('SELECT * FROM orders WHERE owner=? ORDER BY id DESC', (s['owner'],))])

def queue_notification(db, chat, message):
    if chat:
        for chunk in telegram_chunks(message):
            db.execute('INSERT INTO outbox(chat_id,message) VALUES (?,?)', (str(chat), chunk))

def calculate(db, data, submitting=False, owner=None):
    entries = data.get('items', [])
    if not isinstance(entries, list) or not 1 <= len(entries) <= 100:
        fail('Додайте від 1 до 100 позицій у кошик')
    _, hidden = visible_categories(db)
    items, seen = [], set()
    for entry in entries:
        if not isinstance(entry, dict):
            fail('Некоректна позиція кошика')
        id_ = integer(entry.get('id'), 1)
        variant_id = text(entry.get('variant_id', ''), 80)
        quantity = integer(entry.get('quantity', 1), 1, 10000)
        if (id_, variant_id) in seen:
            fail('Об’єднайте повторні позиції кошика')
        seen.add((id_, variant_id))
        row = db.execute('SELECT * FROM products WHERE id=?', (id_,)).fetchone()
        p = product_record(row) if row else None
        if not p or not is_visible(p, hidden) or p['availability'] != 'available':
            fail('Товар недоступний. Оновіть кошик.', 409)
        variant = next((v for v in p['variants'] if v['id'] == variant_id), None)
        if (p['variants'] and not variant) or (not p['variants'] and variant_id):
            fail('Оберіть доступний варіант товару', 409)
        stock = variant['stock'] if variant else p['stock']
        if quantity > stock:
            fail(f'Недостатньо товару «{p["name"]}»: залишок {stock}', 409)
        price = variant['price'] if variant and variant['price'] is not None else p['price']
        items.append({'id': id_, 'variant_id': variant_id, 'options': variant['options'] if variant else {},
                      'quantity': quantity, 'price': price, 'name': p['name'], 'name_de': p['name_de'], 'options_de': variant.get('options_de',{}) if variant else {}, 'sku': p['sku'], 'image': p['images'][:1]})
    subtotal = sum(i['price'] * i['quantity'] for i in items)
    discount, promo_id = 0, None
    code = text(data.get('promo', ''), 40).upper()
    if code:
        promo = db.execute('SELECT * FROM promos WHERE code=? AND enabled=1', (code,)).fetchone()
        if not promo or promo['used'] >= promo['max_uses'] or subtotal < promo['minimum']:
            fail('Промокод недоступний або сума замовлення замала')
        discount, promo_id = subtotal * promo['percent'] // 100, promo['id']
    bonus_spent, bonus_balance, bonus_limit = referrals.spending(db, owner, data.get('use_bonus', False), subtotal-discount, bool(promo_id))
    config = settings(db)
    fulfillment = data.get('fulfillment', {})
    if not isinstance(fulfillment, dict):
        fail('Некоректні дані доставки')
    mode = fulfillment.get('mode', 'delivery')
    shipping = 0
    threshold = None
    snapshot = {'mode': mode}
    if mode == 'pickup':
        if not config['pickup_enabled']:
            fail('Самовивіз вимкнено')
        point = db.execute('SELECT * FROM pickup_points WHERE id=? AND active=1', (integer(fulfillment.get('point_id', 0)),)).fetchone()
        if not point:
            fail('Оберіть доступну точку самовивозу')
        snapshot['point'] = dict(point)
    elif mode == 'delivery':
        if not config['delivery_enabled']:
            fail('Доставку вимкнено')
        city = text(fulfillment.get('city', ''), 120, submitting)
        rate_id = integer(fulfillment.get('rate_id') or 0)
        rate = db.execute('SELECT * FROM shipping_rates WHERE id=? AND active=1', (rate_id,)).fetchone() if rate_id else None
        if not rate_id:
            fail('Выберите способ доставки')
        if not rate or (rate['city'] and (submitting or city) and rate['city'].casefold() != city.casefold()):
            fail('Тариф недоступний для обраного міста')
        shipping = rate['price']
        limit = config['free_shipping_from'] if rate['inherit_free_shipping'] else rate['free_shipping_from']
        threshold = limit if config['free_shipping_enabled'] and limit > 0 else None
        if threshold is not None and subtotal-discount-bonus_spent >= threshold:
            shipping = 0
        snapshot.update({'city': city, 'rate': dict(rate)})
        for key, limit, required in [('postal_code', 30, True), ('street', 180, True), ('house', 30, True), ('apartment', 30, False)]:
            snapshot[key] = text(fulfillment.get(key, ''), limit, submitting and required)
    else:
        fail('Оберіть доставку або самовивіз')
    for key in ('first_name', 'last_name', 'contact'):
        snapshot[key] = text(fulfillment.get(key, ''), 160, submitting)
    snapshot['comment'] = text(fulfillment.get('comment', ''), 1000)
    payment_id = integer(data.get('payment_id') or fulfillment.get('payment_id') or 0)
    payment = db.execute('SELECT * FROM payment_methods WHERE id=? AND active=1', (payment_id,)).fetchone() if payment_id else None
    if (submitting or payment_id) and not payment:
        fail('Выберите доступный способ оплаты')
    minimum_remaining = max(0, config['minimum_order']-(subtotal-discount-bonus_spent))
    if submitting and minimum_remaining:
        fail('Сумма товаров после скидки меньше минимальной суммы заказа')
    return {'items': items, 'subtotal': subtotal, 'discount': discount, 'shipping': shipping,
            'bonus_spent': bonus_spent, 'bonus_balance': bonus_balance, 'bonus_limit': bonus_limit,
            'total': subtotal-discount-bonus_spent+shipping, 'currency': config['currency'], 'promo_id': promo_id,
            'free_shipping_remaining': max(0, threshold-(subtotal-discount-bonus_spent)) if threshold is not None else None,
            'free_shipping_threshold': threshold, 'minimum_remaining': minimum_remaining,
            'payment': dict(payment) if payment else {}, 'fulfillment': snapshot}

async def quote(request):
    s = get_session(request)
    result = calculate(request.app['db'], await body(request), owner=s['owner'])
    result.pop('promo_id')
    return web.json_response(result)

def adjust_stock(db, item, delta):
    row = db.execute('SELECT * FROM products WHERE id=?', (item['id'],)).fetchone()
    if not row:
        fail('Товар замовлення не знайдено', 409)
    variants = json.loads(row['variants'])
    if item.get('variant_id'):
        v = next((v for v in variants if v['id'] == item['variant_id']), None)
        if not v:
            fail('Варіант замовлення не знайдено', 409)
        v['stock'] += delta
        if v['stock'] < 0:
            fail('Недостатній залишок', 409)
        db.execute('UPDATE products SET variants=?,stock=?,revision=revision+1 WHERE id=?', (json.dumps(variants), sum(v['stock'] for v in variants), item['id']))
    else:
        db.execute('UPDATE products SET stock=stock+?,revision=revision+1 WHERE id=?', (delta, item['id']))

async def checkout(request):
    s = get_session(request)
    data = await body(request)
    key = text(data.get('request_key', ''), 100, True)
    lang = data.get('language', request.headers.get('X-Language','ua'))
    if lang not in ('ru','ua'):
        fail('Неподдерживаемый язык')
    db = request.app['db']
    existing = db.execute('SELECT * FROM orders WHERE owner=? AND request_key=?', (s['owner'], key)).fetchone()
    if existing:
        return web.json_response(order_record(existing))
    with db:
        db.execute('BEGIN IMMEDIATE')
        result = calculate(db, data, submitting=True, owner=s['owner'])
        tg = json.loads(s['telegram']) if s['telegram'] else {}
        recipient = result['fulfillment']['contact']
        id_ = db.execute('INSERT INTO orders(owner,request_key,recipient,telegram_id,total,subtotal,discount,currency,items,promo_id,shipping,fulfillment,created,updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            (s['owner'], key, recipient, str(tg['id']) if tg else None, result['total'], result['subtotal'], result['discount'], result['currency'],
             json.dumps(result['items']), result['promo_id'], result['shipping'], json.dumps(result['fulfillment']), now(), now())).lastrowid
        db.execute('UPDATE orders SET payment=?,language=?,customer=? WHERE id=?', (json.dumps(result['payment']),lang,json.dumps(tg),id_))
        snap = referrals.snapshot(db, s['owner'], result['subtotal']-result['discount']-result['bonus_spent'])
        db.execute('UPDATE orders SET bonus_spent=?,referral_snapshot=? WHERE id=?', (result['bonus_spent'],json.dumps(snap),id_))
        referrals.entry(db,s['owner'],id_,'spend',-result['bonus_spent'])
        db.execute('UPDATE customers SET last_seen=?,language=? WHERE owner=?', (now(),lang,s['owner']))
        for item in result['items']:
            adjust_stock(db, item, -item['quantity'])
        if result['promo_id']:
            db.execute('UPDATE promos SET used=used+1 WHERE id=?', (result['promo_id'],))
        for admin_chat in dict.fromkeys(x.strip() for x in (os.getenv('ADMIN_CHAT_ID') or '').split(',') if x.strip()):
            queue_notification(db, admin_chat, format_admin_order(id_, result, tg))
        queue_notification(db, tg.get('id'), notification('created',lang,id_))
        audit(db, 'Створено замовлення', id_)
    return web.json_response(order_record(db.execute('SELECT * FROM orders WHERE id=?', (id_,)).fetchone()), status=201)

async def admin_data(request):
    db = request.app['db']
    return web.json_response({'products': [product_record(r) for r in db.execute('SELECT * FROM products ORDER BY id DESC')],
                             'categories': rows(db, 'SELECT * FROM categories ORDER BY position,id'),
                             'orders': [order_record(r, True) for r in db.execute('SELECT * FROM orders ORDER BY id DESC')],
                             'promos': rows(db, 'SELECT * FROM promos ORDER BY id DESC'),
                             'audit': rows(db, 'SELECT * FROM audit ORDER BY id DESC LIMIT 200'),
                             'referrals': referrals.admin_summary(db),
                             'notification_errors': db.execute('SELECT COUNT(*) FROM outbox WHERE sent=0 AND attempts>0').fetchone()[0],
                             'pickup_points': rows(db, 'SELECT * FROM pickup_points ORDER BY id'),
                             'shipping_rates': rows(db, 'SELECT * FROM shipping_rates ORDER BY id'),
                             'payment_methods': rows(db, 'SELECT * FROM payment_methods ORDER BY position,id'),
                             'customers': customer_stats(db), 'today': today_stats(db), 'order_statuses': status_rows(db),
                             'settings': settings(db), 'statuses': {x['code']:x['name'] for x in status_rows(db)}, 'transitions': allowed_transitions(db)})

def customer_stats(db):
    customers = rows(db, 'SELECT * FROM customers ORDER BY first_seen DESC')
    orders = [dict(r) for r in db.execute('SELECT owner,total,currency,created,recipient,fulfillment FROM orders ORDER BY id')]
    for c in customers:
        c['telegram'] = json.loads(c['telegram'])
        purchases = [o for o in orders if o['owner']==c['owner']]
        c['order_count'] = len(purchases)
        c['contact'] = purchases[-1]['recipient'] if purchases else ''
        last = json.loads(purchases[-1]['fulfillment']) if purchases else {}
        c['name'] = ' '.join(filter(None,[last.get('first_name'),last.get('last_name')])) or c['telegram'].get('first_name','')
        c['totals'] = {}
        for o in purchases:
            c['totals'][o['currency']] = c['totals'].get(o['currency'],0)+o['total']
    return customers

def today_stats(db):
    zone = ZoneInfo(settings(db)['timezone'])
    start = int(datetime.now(zone).replace(hour=0,minute=0,second=0,microsecond=0).timestamp())
    todays = rows(db,'SELECT * FROM orders WHERE created>=?',(start,))
    states={s['code']:s['kind'] for s in status_rows(db)}
    sales = [o for o in todays if states.get(o['status']) in ('paid','done')]
    total = sum(o['total'] for o in sales)
    return {'orders':len(todays),'sales':total,'average':total//len(sales) if sales else 0,
            'currencies':list({o['currency'] for o in sales}),
            'new_users':db.execute('SELECT COUNT(*) FROM customers WHERE first_seen>=?',(start,)).fetchone()[0], 'timezone':str(zone)}

def translations(value, original):
    if not isinstance(value,dict) or len(value)>30:
        fail('Некорректный перевод характеристик')
    result={}
    for key, pair in value.items():
        if key not in original or not isinstance(pair,dict):
            fail('Перевод должен соответствовать исходной характеристике')
        result[key]={'name':text(pair.get('name',''),80),'value':text(pair.get('value',''),200)}
    return result

def safe_url(value, optional=False):
    value=text(value,1000,not optional)
    if value and not re.fullmatch(r'https://[^\s<>]+',value):
        fail('Ссылка должна начинаться с https://')
    return value

def image_ids(db, value):
    if not isinstance(value, list) or len(value) > 10:
        fail('Дозволено до 10 фотографій')
    for item in value:
        if not isinstance(item, str) or not db.execute('SELECT 1 FROM images WHERE id=?', (item,)).fetchone():
            fail('Спочатку завантажте фотографію')
    return list(dict.fromkeys(value))

def attributes(value):
    if not isinstance(value, dict) or len(value) > 30:
        fail('Дозволено до 30 характеристик')
    result = {text(k, 80, True): text(v, 200, True) for k, v in value.items()}
    if len(result) != len(value):
        fail('Назви характеристик повторюються')
    return result

async def save_product(request):
    data, db = await body(request), request.app['db']
    id_ = integer(request.match_info.get('id', 0))
    old = db.execute('SELECT * FROM products WHERE id=?', (id_,)).fetchone() if id_ else None
    if id_ and not old:
        fail('Товар не знайдено', 404)
    if old and 'expected_revision' in data and integer(data['expected_revision']) != old['revision']:
        fail('Товар змінився після відкриття форми. Відкрийте його знову, щоб не перезаписати актуальні залишки.', 409)
    cats = data.get('category_ids', [])
    if not isinstance(cats, list) or len(cats) > 50:
        fail('Некоректні категорії')
    cats = list(dict.fromkeys(integer(c, 1) for c in cats))
    for c in cats:
        if not db.execute('SELECT 1 FROM categories WHERE id=?', (c,)).fetchone():
            fail('Категорію не знайдено')
    price, old_price = money(data.get('price', 0)), money(data.get('old_price') or 0)
    if old_price and old_price <= price:
        fail('Стара ціна має бути вищою за поточну')
    variants = data.get('variants', [])
    if not isinstance(variants, list) or len(variants) > 250:
        fail('Дозволено до 250 варіантів')
    normalized, identities, combinations = [], set(), set()
    option_keys = None
    for v in variants:
        if not isinstance(v, dict):
            fail('Некоректний варіант')
        vid = text(v.get('id') or secrets.token_hex(8), 80, True)
        options = attributes(v.get('options', {}))
        combo = json.dumps(options, sort_keys=True)
        if not options or vid in identities or combo in combinations:
            fail('Варіанти повинні мати унікальні значення та ідентифікатори')
        if option_keys is not None and set(options) != option_keys:
            fail('В усіх варіантах мають бути однакові назви параметрів')
        option_keys = set(options)
        identities.add(vid); combinations.add(combo)
        normalized.append({'id': vid, 'options': options, 'stock': integer(v.get('stock', 0)),
                           'price': money(v['price']) if v.get('price') not in (None, '') else None, 'options_de': translations(v.get('options_de', {}), options)})
    # Pending orders must still be cancellable after catalog edits.
    for order in db.execute("SELECT o.items FROM orders o JOIN order_statuses s ON s.code=o.status WHERE s.kind IN ('new','process','paid')"):
        for item in json.loads(order['items']):
            if item['id'] != id_:
                continue
            vid = item.get('variant_id', '')
            previous = next((v for v in json.loads(old['variants']) if v['id'] == vid), None) if old else None
            current = next((v for v in normalized if v['id'] == vid), None)
            if (vid and (not current or (previous and current['options'] != previous['options']))) or (not vid and normalized):
                fail('Завершіть або скасуйте активні замовлення перед зміною структури варіантів', 409)
    status = data.get('status', 'active')
    available = data.get('availability', 'available')
    if status not in ('active', 'hidden', 'archived') or available not in ('available', 'unavailable'):
        fail('Некоректний статус товару')
    stock = sum(v['stock'] for v in normalized) if normalized else integer(data.get('stock', 0))
    values = {'name': text(data.get('name', ''), 120, True), 'sku': text(data.get('sku') or f'P-{secrets.token_hex(5)}', 100, True),
              'category_id': cats[0] if cats else None, 'category_ids': json.dumps(cats), 'price': price, 'old_price': old_price,
              'description': text(data.get('description', ''), 5000), 'traits': json.dumps(attributes(data.get('traits', {}))),
              'images': json.dumps(image_ids(db, data.get('images', []))), 'variants': json.dumps(normalized), 'stock': stock,
              'featured': int(bool(data.get('featured'))), 'is_new': int(bool(data.get('is_new'))),
              'hidden': int(status != 'active'), 'deleted': int(status == 'archived'), 'name_de': text(data.get('name_de', ''),120), 'description_de': text(data.get('description_de',''),5000),
              'traits_de': json.dumps(translations(data.get('traits_de',{}), data.get('traits',{}))),
              'availability': available, 'revision': old['revision']+1 if old else 1}
    with db:
        if old:
            db.execute('UPDATE products SET '+','.join(f'{k}=?' for k in values)+' WHERE id=?', (*values.values(), id_))
        else:
            values['created'] = now()
            id_ = db.execute('INSERT INTO products('+','.join(values)+') VALUES ('+','.join('?' for _ in values)+')', tuple(values.values())).lastrowid
        audit(db, 'Збережено товар', id_)
    return web.json_response({'id': id_})

async def delete_product(request):
    db, id_ = request.app['db'], integer(request.match_info['id'], 1)
    if not db.execute('SELECT 1 FROM products WHERE id=?', (id_,)).fetchone():
        fail('Товар не знайдено', 404)
    with db:
        db.execute('UPDATE products SET deleted=1,hidden=1,revision=revision+1 WHERE id=?', (id_,))
        audit(db, 'Архівовано товар', id_)
    return web.json_response({'ok': True})

async def bulk_products(request):
    data, db = await body(request), request.app['db']
    ids = data.get('ids', [])
    if not isinstance(ids, list) or not 1 <= len(ids) <= 500:
        fail('Оберіть товари')
    ids = [integer(x, 1) for x in ids]
    field = data.get('field')
    if field not in ('hidden', 'featured'):
        fail('Невідома масова дія')
    with db:
        for id_ in ids:
            db.execute(f'UPDATE products SET {field}=?,revision=revision+1 WHERE id=? AND deleted=0', (int(bool(data.get('value'))), id_))
        audit(db, f'Масове оновлення: {field}', ','.join(map(str, ids)))
    return web.json_response({'ok': True})

async def save_category(request):
    data, db = await body(request), request.app['db']
    id_ = integer(request.match_info.get('id', 0))
    parent = integer(data['parent_id'], 1) if data.get('parent_id') else None
    if id_ and not db.execute('SELECT 1 FROM categories WHERE id=?', (id_,)).fetchone():
        fail('Категорію не знайдено', 404)
    cursor, seen = parent, {id_}
    while cursor:
        if cursor in seen:
            fail('Категорія не може бути власною підкатегорією')
        seen.add(cursor)
        row = db.execute('SELECT parent_id FROM categories WHERE id=?', (cursor,)).fetchone()
        if not row:
            fail('Батьківську категорію не знайдено')
        cursor = row[0]
    values = (text(data.get('name', ''), 120, True), text(data.get('description', ''), 2000), parent,
              integer(data.get('position', 0)), int(bool(data.get('hidden'))),
              text(data.get('image', ''), 80), text(data.get('icon', ''), 24), text(data.get('name_de',''),120), text(data.get('description_de',''),2000))
    if values[5]:
        image_ids(db, [values[5]])
    with db:
        if id_:
            db.execute('UPDATE categories SET name=?,description=?,parent_id=?,position=?,hidden=?,image=?,icon=?,name_de=?,description_de=? WHERE id=?', (*values, id_))
        else:
            id_ = db.execute('INSERT INTO categories(name,description,parent_id,position,hidden,image,icon,name_de,description_de) VALUES (?,?,?,?,?,?,?,?,?)', values).lastrowid
        audit(db, 'Збережено категорію', id_)
    return web.json_response({'id': id_})

async def delete_category(request):
    db, id_ = request.app['db'], integer(request.match_info['id'], 1)
    if db.execute('SELECT 1 FROM categories WHERE parent_id=?', (id_,)).fetchone():
        fail('Спочатку перемістіть або видаліть підкатегорії', 409)
    with db:
        for p in db.execute('SELECT id,category_ids FROM products').fetchall():
            cats = [c for c in json.loads(p['category_ids']) if c != id_]
            db.execute('UPDATE products SET category_ids=?,category_id=?,revision=revision+1 WHERE id=?', (json.dumps(cats), cats[0] if cats else None, p['id']))
        db.execute('DELETE FROM categories WHERE id=?', (id_,))
        audit(db, 'Видалено категорію', id_)
    return web.json_response({'ok': True})

async def save_order(request):
    data, db = await body(request), request.app['db']
    id_ = integer(request.match_info['id'], 1)
    order = db.execute('SELECT * FROM orders WHERE id=?', (id_,)).fetchone()
    if not order:
        fail('Замовлення не знайдено', 404)
    status = data.get('status', order['status'])
    if status != order['status'] and status not in allowed_transitions(db).get(order['status'], []):
        fail('Цей перехід статусу недоступний', 409)
    target = db.execute('SELECT * FROM order_statuses WHERE code=?', (status,)).fetchone()
    if not target:
        fail('Статус не найден')
    note, reference = text(data.get('note', order['note']), 5000), text(data.get('reference', order['reference']), 500)
    with db:
        db.execute('UPDATE orders SET status=?,note=?,reference=?,updated=? WHERE id=?', (status, note, reference, now(), id_))
        if status != order['status']:
            referrals.finish(db, order, target['kind'])
            if target['kind'] == 'cancelled':
                for item in json.loads(order['items']):
                    adjust_stock(db, item, item.get('quantity', 1))
            if target['kind'] == 'cancelled' and order['promo_id']:
                db.execute('UPDATE promos SET used=MAX(0,used-1) WHERE id=?', (order['promo_id'],))
            queue_notification(db, order['telegram_id'], notification('status',order['language'],id_,target['name_de'] if order['language']=='ua' else target['name']))
        audit(db, f'Заказ: {target["name"]}', id_)
    return web.json_response({'ok': True})

async def save_promo(request):
    data, db = await body(request), request.app['db']
    id_ = integer(request.match_info.get('id', 0))
    code = text(data.get('code', ''), 40, True).upper()
    if not re.fullmatch(r'[A-Z0-9_-]{2,40}', code):
        fail('Код: від 2 до 40 латинських літер, цифр, - або _')
    values = (code, integer(data.get('percent', 0), 1, 100), money(data.get('minimum', 0)),
              integer(data.get('max_uses', 100), 1), int(bool(data.get('enabled', True))))
    with db:
        if id_:
            db.execute('UPDATE promos SET code=?,percent=?,minimum=?,max_uses=?,enabled=? WHERE id=?', (*values, id_))
        else:
            id_ = db.execute('INSERT INTO promos(code,percent,minimum,max_uses,enabled) VALUES (?,?,?,?,?)', values).lastrowid
        audit(db, 'Збережено промокод', id_)
    return web.json_response({'id': id_})

async def save_settings(request):
    data, db = await body(request), request.app['db']
    current = settings(db)
    for key, default in DEFAULT_SETTINGS.items():
        if key not in data:
            continue
        if isinstance(default, bool):
            if not isinstance(data[key], bool):
                fail('Некоректний перемикач')
            current[key] = data[key]
        elif key in ('delivery_cost', 'free_shipping_from', 'minimum_order'):
            current[key] = money(data[key])
        elif key == 'links':
            if not isinstance(data[key],list) or len(data[key])>20:
                fail('Можно добавить до 20 ссылок')
            current[key] = [{'name': text(x.get('name',''),120,True), 'name_de':text(x.get('name_de',''),120), 'url':safe_url(x.get('url',''))} for x in data[key] if isinstance(x,dict)]
        elif key == 'banners':
            if not isinstance(data[key],list) or len(data[key])>12:
                fail('Можно добавить до 12 баннеров')
            current[key] = []
            for banner in data[key]:
                if not isinstance(banner,dict):
                    fail('Некорректный баннер')
                image = text(banner.get('image',''),80,True)
                image_ids(db,[image])
                current[key].append({'id':text(banner.get('id') or secrets.token_hex(6),80),'image':image,
                    'title':text(banner.get('title',''),160),'title_de':text(banner.get('title_de',''),160),
                    'text':text(banner.get('text',''),2000),'text_de':text(banner.get('text_de',''),2000),
                    'url':safe_url(banner.get('url',''),optional=True), 'active':bool(banner.get('active',True))})
        else:
            current[key] = text(data[key], 2000 if key in ('hero_text','hero_text_de','payment_info','payment_info_de','description','description_de','contact_text','contact_text_de') else 160)
    if not current['name']:
        fail('Вкажіть назву магазину')
    if current['currency'] not in ('UAH', 'USD', 'EUR'):
        fail('Підтримувані валюти: UAH, USD, EUR')
    if current['currency'] != settings(db)['currency'] and db.execute('SELECT 1 FROM products').fetchone():
        fail('Валюту потрібно обрати до додавання товарів. Автоматичної конвертації немає.')
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', current['accent']):
        fail('Оберіть коректний колір')
    if current['support'] and not re.fullmatch(r'@[A-Za-z][A-Za-z0-9_]{4,31}', current['support']):
        fail('Контакт підтримки має вигляд @username')
    if current['default_language'] not in ('ru','ua'):
        fail('Неподдерживаемый язык')
    try:
        ZoneInfo(current['timezone'])
    except (ZoneInfoNotFoundError, ValueError):
        fail('Неизвестный часовой пояс')
    for key in ('accent_secondary','background','text_color'):
        if not re.fullmatch(r'#[0-9a-fA-F]{6}',current[key]):
            fail('Некорректный цвет')
    for key in ('logo', 'banner', 'favicon'):
        if current[key]:
            image_ids(db, [current[key]])
    with db:
        db.execute("UPDATE config SET value=? WHERE key='settings'", (json.dumps(current),))
        audit(db, 'Оновлено налаштування', 'store')
    return web.json_response({'ok': True})

async def save_pickup(request):
    data, db = await body(request), request.app['db']
    values = {k: text(data.get(k, ''), 2000 if k == 'description' else 200, k in ('name', 'city', 'address'))
              for k in ('name', 'city', 'address', 'description', 'hours', 'map_url')}
    if values['map_url'] and not re.fullmatch(r'https://[^\s]+', values['map_url']):
        fail('Посилання на карту має починатися з https://')
    values.update({k+'_de':text(data.get(k+'_de',''),2000 if k=='description' else 200) for k in ('name','city','address','description','hours')})
    values['active'] = int(bool(data.get('active', True)))
    return save_simple(request, db, 'pickup_points', values)

async def save_rate(request):
    data, db = await body(request), request.app['db']
    values = {'name':text(data.get('name',''),160,True), 'name_de':text(data.get('name_de',''),160),
        'city':text(data.get('city',''),120),'price':money(data.get('price',0)),
        'active':int(bool(data.get('active',True))), 'free_shipping_from':money(data.get('free_shipping_from',0)),
        'inherit_free_shipping':int(bool(data.get('inherit_free_shipping',True))), 'position':integer(data.get('position',0))}
    values.update({k:text(data.get(k,''),2000 if 'description' in k else 160) for k in ('description','description_de','eta','eta_de')})
    return save_simple(request, db, 'shipping_rates', values)

async def save_payment(request):
    data, db = await body(request), request.app['db']
    values = {k:text(data.get(k,''),2000 if k.startswith(('description','instructions')) else 160,k=='name')
        for k in ('name','name_de','description','description_de','instructions','instructions_de')}
    values.update({'active':int(bool(data.get('active',True))),'position':integer(data.get('position',0))})
    return save_simple(request, db, 'payment_methods', values)

async def delete_payment(request):
    return delete_simple(request,'payment_methods')

async def save_status(request):
    data, db = await body(request), request.app['db']
    code = request.match_info.get('id') or 's_'+secrets.token_hex(5)
    old = db.execute('SELECT * FROM order_statuses WHERE code=?',(code,)).fetchone()
    kind = data.get('kind','process')
    if kind not in ('process','paid','done','cancelled') and not (old and old['kind']=='new' and kind=='new'):
        fail('Недопустимый тип статуса')
    if old and kind != old['kind']:
        fail('Тип существующего статуса менять нельзя; создайте новый')
    active=int(bool(data.get('active',True)))
    if code=='new' and not active:
        fail('Начальный статус нельзя отключить')
    with db:
        db.execute('INSERT INTO order_statuses VALUES (?,?,?,?,?,?) ON CONFLICT(code) DO UPDATE SET name=excluded.name,name_de=excluded.name_de,active=excluded.active,position=excluded.position',
            (code,text(data.get('name',''),120,True),text(data.get('name_de',''),120,True),kind,active,integer(data.get('position',0))))
        audit(db,'Обновлён статус',code)
    return web.json_response({'id':code})

async def set_language(request):
    s=get_session(request)
    data=await body(request)
    if data.get('language') not in ('ru','ua'):
        fail('Неподдерживаемый язык')
    with request.app['db']:
        request.app['db'].execute('UPDATE customers SET language=? WHERE owner=?',(data['language'],s['owner']))
    return web.json_response({'ok':True})

def save_simple(request, db, table, values):
    id_ = integer(request.match_info.get('id', 0))
    with db:
        if id_:
            if not db.execute(f'SELECT 1 FROM {table} WHERE id=?', (id_,)).fetchone():
                fail('Запис не знайдено', 404)
            db.execute(f'UPDATE {table} SET '+','.join(f'{k}=?' for k in values)+' WHERE id=?', (*values.values(), id_))
        else:
            id_ = db.execute(f'INSERT INTO {table}('+','.join(values)+') VALUES ('+','.join('?' for _ in values)+')', tuple(values.values())).lastrowid
        audit(db, 'Оновлено доставку / самовивіз', id_)
    return web.json_response({'id': id_})

async def delete_pickup(request):
    return delete_simple(request, 'pickup_points')

async def delete_rate(request):
    return delete_simple(request, 'shipping_rates')

def delete_simple(request, table):
    db, id_ = request.app['db'], integer(request.match_info['id'], 1)
    with db:
        db.execute(f'DELETE FROM {table} WHERE id=?', (id_,))
        audit(db, 'Видалено доставку / самовивіз', id_)
    return web.json_response({'ok': True})

def process_image(raw, directory):
    with warnings.catch_warnings():
        warnings.simplefilter('error', Image.DecompressionBombWarning)
        try:
            with Image.open(io.BytesIO(raw)) as source:
                if source.format not in ('JPEG', 'PNG', 'WEBP'):
                    fail('Підтримуються JPEG, PNG і WebP')
                if source.width * source.height > 20000000:
                    fail('Фото має перевищення 20 мегапікселів')
                extension = {'JPEG': 'jpg', 'PNG': 'png', 'WEBP': 'webp'}[source.format]
                source.load()
                image = ImageOps.exif_transpose(source).convert('RGBA')
                image.thumbnail((1600, 1600))
                id_ = secrets.token_hex(16)
                image.save(directory / f'{id_}.webp', 'WEBP', quality=90, method=4)
                (directory / f'{id_}.original.{extension}').write_bytes(raw)
                return id_, extension
        except (OSError, Image.DecompressionBombError, Image.DecompressionBombWarning):
            fail('Файл не є безпечним зображенням')

async def upload(request):
    if not request.content_type.startswith('multipart/'):
        fail('Очікується файл зображення')
    reader = await request.multipart()
    part = await reader.next()
    if not part or part.name != 'file':
        fail('Оберіть файл')
    raw = bytearray()
    while chunk := await part.read_chunk():
        raw.extend(chunk)
        if len(raw) > 12 * 1024 * 1024:
            fail('Фото має бути не більше 12 МБ', 413)
    async with request.app['image_lock']:
        id_, extension = await asyncio.to_thread(process_image, bytes(raw), request.app['data'] / 'images')
    with request.app['db']:
        request.app['db'].execute('INSERT INTO images VALUES (?,?)', (id_, extension))
        audit(request.app['db'], 'Завантажено фото', id_)
    return web.json_response({'id': id_})

async def original_image(request):
    get_session(request, True)
    id_ = request.match_info['id']
    row = request.app['db'].execute('SELECT extension FROM images WHERE id=?', (id_,)).fetchone()
    if not row:
        raise web.HTTPNotFound()
    return web.FileResponse(request.app['data'] / 'images' / f'{id_}.original.{row[0]}', headers={'Content-Disposition': f'attachment; filename="{id_}.{row[0]}"'})

async def thumbnail(request):
    id_ = request.match_info['id']
    if not re.fullmatch('[a-f0-9]{32}', id_):
        raise web.HTTPNotFound()
    return web.FileResponse(request.app['data'] / 'images' / f'{id_}.webp', headers={'Cache-Control': 'public,max-age=31536000,immutable'})

async def notifications(app):
    if not os.getenv('BOT_TOKEN'):
        return
    async with ClientSession(timeout=ClientTimeout(total=15)) as client:
        while True:
            row = app['db'].execute('SELECT * FROM outbox WHERE sent=0 AND next_try<=? AND attempts<12 ORDER BY id LIMIT 1', (now(),)).fetchone()
            if row:
                ok = False
                try:
                    async with client.post(f'https://api.telegram.org/bot{os.environ["BOT_TOKEN"]}/sendMessage', json={'chat_id': row['chat_id'], 'text': row['message']}) as response:
                        ok = response.status == 200 and (await response.json()).get('ok', False)
                except Exception:
                    logging.warning('Telegram notification #%s delayed', row['id'])
                with app['db']:
                    app['db'].execute('UPDATE outbox SET sent=?,attempts=attempts+1,next_try=? WHERE id=?', (int(ok), now()+min(3600, 30 * 2**row['attempts']), row['id']))
            await asyncio.sleep(2)

async def lifecycle(app):
    task = asyncio.create_task(notifications(app))
    yield
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError):
        await task
    app['db'].close()

async def referral_profile(request):
    s = get_session(request)
    with request.app['db']:
        result = referrals.profile(request.app['db'],s['owner'])
    return web.json_response(result)

async def referral_claim(request):
    s, data = get_session(request), await body(request)
    with request.app['db']:
        referrals.claim(request.app['db'],s['owner'],text(data.get('code',''),48,True))
    return web.json_response({'ok':True})

async def referral_settings(request):
    data, db = await body(request), request.app['db']
    cfg = referrals.config(db)
    for key, default in referrals.DEFAULTS.items():
        if key not in data:
            continue
        if isinstance(default,bool):
            if not isinstance(data[key],bool):
                fail('ref_bad_request')
            cfg[key]=data[key]
        elif key in ('reward_percent','spend_percent'):
            cfg[key]=integer(data[key],0,100)
        elif key in ('reward_fixed','reward_cap','minimum','welcome'):
            cfg[key]=money(data[key])
        elif key=='reward_type':
            if data[key] not in ('percent','fixed'):
                fail('ref_bad_request')
            cfg[key]=data[key]
        elif key=='bot_username':
            value=text(data[key],32).lstrip('@')
            if value and not re.fullmatch(r'[A-Za-z][A-Za-z0-9_]{4,31}',value):
                fail('ref_bad_request')
            cfg[key]=value
    with db:
        db.execute('INSERT OR REPLACE INTO config VALUES (?,?)',('referrals',json.dumps(cfg)))
        audit(db,'Настройки реферальной программы','referrals')
    return web.json_response({'ok':True})

def telegram_admin_ids():
    raw = os.getenv('TELEGRAM_ADMIN_IDS')
    values = [x.strip() for x in raw.split(',') if x.strip()] if raw is not None else [7184372468, 7787606759]
    if not isinstance(values, list):
        raise ValueError('admin_ids.json must contain a list of Telegram IDs')
    result = set()
    for value in values:
        if isinstance(value, bool) or not str(value).isascii() or not str(value).isdigit() or not 0 < int(value) <= 10**16:
            raise ValueError('Invalid Telegram administrator ID')
        result.add(int(value))
    return result

def create_app(directory=DATA):
    app = web.Application(middlewares=[guard], client_max_size=13*1024*1024)
    app['data'], app['db'] = directory, db_open(directory)
    app['limits'], app['image_lock'] = defaultdict(deque), asyncio.Lock()
    app['public_url'] = os.getenv('PUBLIC_URL', '').rstrip('/')
    app['telegram_admin_ids'] = telegram_admin_ids()
    app['secure'] = app['public_url'].startswith('https://')
    app.cleanup_ctx.append(lifecycle)
    routes = [web.get('/api/referrals', referral_profile), web.post('/api/referrals/claim', referral_claim),
              web.put('/api/admin/referrals', referral_settings), web.get('/api/session', session), web.post('/api/login', login), web.post('/api/logout', logout),
              web.post('/api/language', set_language), web.post('/api/telegram', connect_telegram), web.get('/api/catalog', catalog),
              web.post('/api/quote', quote), web.get('/api/orders', my_orders), web.post('/api/orders', checkout),
              web.get('/api/admin/data', admin_data), web.post('/api/admin/products/bulk', bulk_products),
              web.post('/api/admin/upload', upload), web.put('/api/admin/settings', save_settings),
              web.get('/api/admin/original/{id}', original_image),
              web.patch('/api/admin/orders/{id}', save_order), web.get('/images/{id}.webp', thumbnail)]
    for name, save, delete in [('products', save_product, delete_product), ('categories', save_category, delete_category), ('promos', save_promo, None), ('pickup-points', save_pickup, delete_pickup), ('shipping-rates', save_rate, delete_rate), ('payment-methods', save_payment, delete_payment), ('order-statuses', save_status, None)]:
        routes += [web.post(f'/api/admin/{name}', save), web.put(f'/api/admin/{name}/{{id}}', save)]
        if delete:
            routes.append(web.delete(f'/api/admin/{name}/{{id}}', delete))
    async def index(request):
        return web.Response(text=ASSETS['index.html'], content_type='text/html', headers={'Cache-Control': 'no-cache'})
    async def asset(request):
        name = request.match_info['name']
        if name not in ASSETS:
            raise web.HTTPNotFound()
        mime = {'css':'text/css', 'js':'application/javascript', 'svg':'image/svg+xml', 'html':'text/html'}
        return web.Response(text=ASSETS[name], content_type=mime.get(name.rsplit('.',1)[-1], 'text/plain'))
    async def health(request):
        app['db'].execute('SELECT 1')
        return web.json_response({'ok': True})
    routes += [web.get('/', index), web.get('/admin', index), web.get('/assets/{name}', asset), web.get('/health', health)]
    app.cleanup_ctx.append(bot_lifecycle)
    app.add_routes(routes)
    return app

def set_password(db, password):
    if len(password) < 12:
        raise ValueError('Пароль має містити щонайменше 12 символів')
    salt = secrets.token_bytes(16)
    value = {'salt': salt.hex(), 'hash': hashlib.scrypt(password.encode(), salt=salt, n=16384, r=8, p=1).hex()}
    with db:
        db.execute('INSERT OR REPLACE INTO config VALUES (?,?)', ('admin_password', json.dumps(value)))
        db.execute('DELETE FROM sessions WHERE admin=1')



def telegram_chunks(message, limit=3500):
    """Telegram measures limits in UTF-16 code units; never cut an emoji."""
    chunk, size = [], 0
    for char in str(message):
        units = 2 if ord(char) > 0xFFFF else 1
        if size + units > limit:
            yield ''.join(chunk)
            chunk, size = [], 0
        chunk.append(char)
        size += units
    if chunk:
        yield ''.join(chunk)


def format_admin_order(order_id, result, customer):
    f = result['fulfillment']
    currency = result['currency']
    cash = lambda amount: f'{amount / 100:.2f} {currency}'
    lines = [f'🛍 Новый заказ #{order_id}',
             'Клиент: ' + ' '.join(filter(None, [f.get('first_name'), f.get('last_name')])),
             'Контакт: ' + f.get('contact', '')]
    if customer.get('id'):
        lines.append('Telegram ID: ' + str(customer['id']))
    if customer.get('username'):
        lines.append('@' + customer['username'])
    lines.append('\nТовары:')
    for n, item in enumerate(result['items'], 1):
        lines.append(f'{n}. {item["name"]} — {item["quantity"]} × {cash(item["price"])} = {cash(item["quantity"] * item["price"])}')
        if item.get('sku'):
            lines.append('Артикул: ' + item['sku'])
        if item.get('options'):
            lines.append(', '.join(f'{k}: {v}' for k, v in item['options'].items()))
    if f['mode'] == 'pickup':
        p = f.get('point', {})
        lines.append('\nСамовывоз: ' + ', '.join(str(p[k]) for k in ('name', 'city', 'address', 'hours') if p.get(k)))
    else:
        lines.append('\nДоставка: ' + f.get('rate', {}).get('name', ''))
        lines.append('Адрес: ' + ', '.join(str(f[k]) for k in ('postal_code', 'city', 'street', 'house', 'apartment') if f.get(k)))
    lines.extend(['Товары: ' + cash(result['subtotal']),
                  'Скидка: ' + cash(result['discount']),
                  'Списано бонусов: ' + cash(result.get('bonus_spent', 0)),
                  'Доставка: ' + cash(result['shipping']),
                  'ИТОГО: ' + cash(result['total']),
                  'Способ оплаты: ' + result.get('payment', {}).get('name', '')])
    if f.get('comment'):
        lines.append('Комментарий: ' + f['comment'])
    lines.append('Управление заказами: /admin')
    return '\n'.join(lines)


async def telegram_worker(app):
    from urllib.parse import urlencode
    token = os.environ['BOT_TOKEN']
    url = app['public_url']
    offset_file = app['data'] / 'telegram-offset.txt'
    try:
        offset = int(offset_file.read_text())
    except (OSError, ValueError):
        offset = 0
    async with ClientSession(timeout=ClientTimeout(total=45)) as client:
        async def call(method, payload):
            async with client.post(f'https://api.telegram.org/bot{token}/{method}', json=payload) as response:
                data = await response.json()
                if not data.get('ok'):
                    raise RuntimeError(f'Telegram {method}: HTTP {response.status}')
                return data['result']
        ready = False
        while True:
            try:
                if not ready:
                    me = await call('getMe', {})
                    # Long polling replaces any earlier webhook without dropping orders/updates.
                    await call('deleteWebhook', {'drop_pending_updates': False})
                    await call('setChatMenuButton', {'menu_button': {'type': 'web_app', 'text': 'Магазин', 'web_app': {'url': url}}})
                    with app['db']:
                        cfg = referrals.config(app['db'])
                        cfg['bot_username'] = me['username']
                        app['db'].execute('INSERT OR REPLACE INTO config VALUES (?,?)', ('referrals', json.dumps(cfg)))
                    logging.info('Telegram bot started: @%s', me['username'])
                    ready = True
                updates = await call('getUpdates', {'offset': offset, 'timeout': 30, 'allowed_updates': ['message']})
                for update in updates:
                    message = update.get('message', {})
                    if message.get('chat', {}).get('type') == 'private':
                        command = message.get('text', '').split(maxsplit=1)
                        cmd = command[0].split('@')[0] if command else ''
                        chat = message['chat']['id']
                        is_admin = message.get('from', {}).get('id') in app['telegram_admin_ids']
                        if cmd in ('/start', '/admin', '/orders', '/help'):
                            if cmd in ('/admin', '/orders') and not is_admin:
                                await call('sendMessage', {'chat_id': chat, 'text': 'Доступ только для администратора.'})
                            else:
                                referral = command[1][2:] if len(command) > 1 and command[1].startswith('r_') else ''
                                open_url = url + ('/?' + urlencode({'ref': referral}) if re.fullmatch(r'[a-f0-9]{24}', referral) else '')
                                buttons = [[{'text': '🛍 Открыть магазин', 'web_app': {'url': open_url}}]]
                                if is_admin:
                                    buttons.append([{'text': '⚙️ Админ-панель', 'web_app': {'url': url + '/admin'}}])
                                greeting = 'Добро пожаловать! Откройте магазин, выберите товары и оформите заказ.'
                                if is_admin:
                                    greeting += '\n\nВы администратор. Новые заказы будут приходить в этот чат. Управление товарами и заказами — в админ-панели.'
                                    # Retry notifications that failed before the admin pressed /start.
                                    with app['db']:
                                        app['db'].execute('UPDATE outbox SET attempts=0,next_try=0 WHERE sent=0 AND chat_id=?', (str(chat),))
                                if cmd == '/orders':
                                    orders = app['db'].execute('SELECT id,total,currency,status FROM orders ORDER BY id DESC LIMIT 10').fetchall()
                                    greeting = 'Последние заказы:\n' + ('\n'.join(f'#{o["id"]} — {o["total"]/100:.2f} {o["currency"]} — {o["status"]}' for o in orders) or 'Заказов пока нет.')
                                await call('sendMessage', {'chat_id': chat, 'text': greeting, 'reply_markup': {'inline_keyboard': buttons}})
                    offset = update['update_id'] + 1
                    temporary = offset_file.with_suffix('.tmp')
                    temporary.write_text(str(offset))
                    temporary.replace(offset_file)
            except asyncio.CancelledError:
                raise
            except Exception:
                # Do not log exception text or URLs: they may contain the token.
                logging.warning('Telegram connection failed; retrying in 5 seconds. Check token and ensure only one replica is running.')
                await asyncio.sleep(5)


async def bot_lifecycle(app):
    task = None
    if os.getenv('BOT_DISABLED') != '1':
        task = asyncio.create_task(telegram_worker(app))
    try:
        yield
    finally:
        if task:
            task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await task


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
    if os.getenv('BOT_DISABLED') != '1':
        if not os.getenv('BOT_TOKEN', '').strip():
            raise SystemExit('Добавьте BOT_TOKEN в Railway -> Variables.')
        from urllib.parse import urlsplit
        public = urlsplit(os.getenv('PUBLIC_URL', ''))
        if public.scheme != 'https' or not public.netloc or public.query or public.fragment:
            raise SystemExit('Создайте Railway -> Networking -> Generate Domain и перезапустите сервис, либо задайте PUBLIC_URL=https://ваш-домен.')

    application = create_app()
    admin_pass = os.getenv('ADMIN_PASSWORD', '').strip()
    if admin_pass:
        try:
            set_password(application['db'], admin_pass)
            logging.info('Admin password updated from ADMIN_PASSWORD env variable.')
        except Exception as e:
            logging.error(f'Failed to set admin password: {e}')

    logging.info('Starting storefront; admin ID configured; database: %s', DATA)
    web.run_app(application, host='0.0.0.0', port=int(os.getenv('PORT', '8080')), access_log=None)
