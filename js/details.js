window.onload = definirTarefa;

function getParam(name) {
  return decodeURIComponent(new URLSearchParams(window.location.search).get(name) || "");
}

function definirTarefa() {
  document.getElementById("titulo").textContent = getParam("titulo");
  document.getElementById("taskDate").textContent = getParam("data");
  document.getElementById("priority").textContent = getParam("prioridade");
  document.getElementById("comment").textContent = getParam("comentario");
  document.getElementById("notification").textContent = getParam("notificacao");
  document.getElementById("createdAt").textContent = getParam("criadaEm");

  const status = document.getElementById("status");
  const dataTarefa = new Date(getParam("data"));
  const atrasada = dataTarefa < new Date();

  status.textContent = atrasada ? "Atrasada" : "Em dia";
  status.className = "badge " + (atrasada ? "badge-danger" : "badge-success");

  const prioridade = getParam("prioridade");
  document.getElementById("priority").className = "badge " + (
    prioridade === "Alta" ? "badge-danger" :
    prioridade === "Média" ? "badge-warning" :
    "badge-success"
  );
}