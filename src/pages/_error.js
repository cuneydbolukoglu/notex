function ErrorPage({ statusCode }) {
  return (
    <div style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Bir hata oluştu</h1>
      <p>{statusCode ? `Sunucu hatası: ${statusCode}` : 'İstemci tarafında bir hata oluştu.'}</p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;


