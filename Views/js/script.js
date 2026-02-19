document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formManutencao");
  const cepInput = document.getElementById("cep");
  const cidadeInput = document.getElementById("cidade");
  const ufSelect = document.getElementById("uf");

  // =========================
  // 🔎 BUSCA CEP AUTOMÁTICA
  // =========================
  cepInput.addEventListener("blur", async function () {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) return;

    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await resp.json();

      if (!data.erro) {
        cidadeInput.value = data.localidade;
        ufSelect.value = data.uf;
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  });

  // =========================
  // 📩 ENVIO TELEGRAM
  // =========================
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = document.getElementById("btnEnviar");
    const status = document.getElementById("status");

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cep = cepInput.value.trim();
    const cidade = cidadeInput.value.trim();
    const uf = ufSelect.value;
    const endereco = document.getElementById("endereco").value.trim();
    const qtd = document.getElementById("quantidade").value.trim();

    const token = "8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8";
    const chat_id = "-1003857825945";

    const mensagem =
      `🚀 Nova Solicitação de Manutenção de ar condicionado\n\n` +
      `👤 Cliente: ${nome}\n` +
      `📧 E-mail: ${email}\n` +
      `📞 Telefone: ${telefone}\n` +
      `📍 Endereço: ${endereco}\n` +
      `🏙️ Cidade: ${cidade} - ${uf}\n` +
      `📮 CEP: ${cep}\n` +
      `❄️ Aparelhos: ${qtd}`;

    btn.disabled = true;
    btn.innerText = "Enviando...";
    status.innerHTML = "";

    try {
      await sendTelegramGET(token, chat_id, mensagem);

      form.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 50px; color: #28a745; margin-bottom: 20px;">✅</div>
          <h3>Solicitação enviada, ${nome.split(" ")[0]}!</h3>
          <p>Em breve entraremos em contato pelo WhatsApp.</p>
        </div>
      `;
    } catch (err) {
      status.innerHTML =
        "<span style='color: red;'>Erro ao enviar. Tente novamente.</span>";
      btn.disabled = false;
      btn.innerText = "Enviar Solicitação";
    }
  });

  // =========================
  // 🚀 ENVIO VIA GET (SEM CORS)
  // =========================
  function sendTelegramGET(token, chat_id, text) {
    const url =
      `https://api.telegram.org/bot${token}/sendMessage` +
      `?chat_id=${encodeURIComponent(chat_id)}` +
      `&text=${encodeURIComponent(text)}`;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
      img.src = url;
      setTimeout(() => resolve(true), 1000);
    });
  }

});
