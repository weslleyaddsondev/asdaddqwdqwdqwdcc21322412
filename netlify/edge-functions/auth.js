export default async (request, context) => {
  const authHeader = request.headers.get('authorization');
  
  // Troque 'admin' pelo seu usuário e 'senha123' pela sua senha
  const expectedAuth = `Basic ${btoa('admin:senha123')}`;

  if (authHeader !== expectedAuth) {
    return new Response('Acesso Restrito', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Área Secreta"',
      },
    });
  }
  
  return context.next();
};

// Esta parte substitui o arquivo netlify.toml
export const config = {
  path: "/*",
};