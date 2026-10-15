"use client";

export default function ErrorPage({ reset }: {
    reset: () => void;
}) {
    return (<main className="admin-login">
      <section className="admin-login-card">
        <h1>Панель тимчасово недоступна</h1>
        <p>Перевір підключення PostgreSQL і застосовані міграції.</p>
        <button className="primary-button" onClick={reset}>
          Повторити
        </button>
      </section>
    </main>);
}
