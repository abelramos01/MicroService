document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('form-cadastro');
  const formLogin = document.getElementById('form-login');

  // Cadastro de usuário
  if (formCadastro) {
    formCadastro.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: formCadastro.name.value,
        email: formCadastro.email.value,
        password: formCadastro.password.value
      };

      try {
        const response = await fetch('/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
          alert('Usuário cadastrado com sucesso!');
          localStorage.setItem('token', `Bearer ${result}`); // Salva o token no formato correto
          window.location.href = '/dashboard'; 
        } else {
          alert(result.message || 'Erro ao cadastrar');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao cadastrar usuário');
      }
    });
  }

  // Login de usuário
  if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: formLogin.email.value,
        password: formLogin.password.value
      };

      try {
        const response = await fetch('/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
          alert('Login feito com sucesso!');
          localStorage.setItem('token', `Bearer ${result}`); // Salva o token no formato correto
          window.location.href = '/dashboard'; 
        } else {
          alert(result.error || 'Erro ao fazer login');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao fazer login');
      }
    });
  }

  // Adiciona o token ao cabeçalho das requisições subsequentes
  const token = localStorage.getItem('token');
  if (token) {
    fetch('/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    }).then(response => {
      if (!response.ok) {
        alert('Acesso negado à página dashboard');
      }
    }).catch(err => {
      console.error('Erro ao acessar a página dashboard:', err);
    });
  }
});