let taskForm = document.getElementById("form");
let taskList = document.getElementById("lista");

let taskExample;
let noTaskText;

let tarefaEmEdicao = null;

function start()
{
    taskForm = document.getElementById("form");
    taskList = document.getElementById("lista");
    taskExample = document.getElementById("lista").children[0];

    taskList.removeChild(taskExample);

    noTaskText = document.getElementById("noTasks");

    taskForm.hidden = true;
}

function removerTarefa(event)
{
  const tarefa = event.closest("li");

  if(tarefa)
  {
    if(tarefaEmEdicao == tarefa)
    {
      taskForm.reset();
      document.getElementById("form").hidden = true;
      const buttons = document.getElementById("list-buttons");
      buttons.hidden = false;

      tarefaEmEdicao = null;
    }
    taskList.removeChild(tarefa);
  }

  if(taskList.children.length === 0) 
  {
    noTaskText.hidden = false;
  }
}

function cadastrarTarefa(){
    const element = document.getElementById("form");
    const buttons = document.getElementById("list-buttons");

    element.hidden = false;
    buttons.hidden = true;
}

function adicionarTarefa()
{
    if(checkForm())
    {
      const novo = novoItem(tarefaEmEdicao ? tarefaEmEdicao.id - 1 : (taskList.lastElementChild ? Number(taskList.lastElementChild.id) : 0));

    if (tarefaEmEdicao) {
      taskList.replaceChild(novo, tarefaEmEdicao);
      tarefaEmEdicao = null;
    } else {
      taskList.appendChild(novo);
    }

      noTaskText.hidden = true;

      taskForm.hidden = true;
      document.getElementById("list-buttons").hidden = false;
      taskForm.reset();
    }
}

function checkForm()
{
  let everythingOk = true;

  const titleInput = document.getElementById("title");
  const dateInput = document.getElementById("taskDate");

  titleInput.style.backgroundColor = "";
  dateInput.style.backgroundColor = "";

  if (titleInput.value.trim() === "") 
    {
    everythingOk = false;
    titleInput.style.backgroundColor = "#ffcccc";
  }

  if (dateInput.value.trim() === "") 
    {
    everythingOk = false;
    dateInput.style.backgroundColor = "#ffcccc";
  }

  if (!everythingOk) {
    alert("Você deve preencher as informações marcadas primeiro.");
  }

  return everythingOk;
}

function resetarCadastro()
{
  if(tarefaEmEdicao)
  {
    taskForm.reset();
    document.getElementById("form").hidden = true;
    const buttons = document.getElementById("list-buttons");
    buttons.hidden = false;

    tarefaEmEdicao = null;
  }
  else
  {
    taskForm = document.getElementById("form");

    var aux = true;

    var taskFormElements = taskForm.getElementsByClassName("form-control")

    for(var i = 0; i < taskFormElements.length; i++)
    {
      if(taskFormElements[i].value != "")
      {
        aux = false;
      }
    }

    taskForm.reset();

    if(aux)
    {
      document.getElementById("form").hidden = true;
      const buttons = document.getElementById("list-buttons");
      buttons.hidden = false;
    }
  }  
}

function novoItem(id){
    let novoId = Number(id) + 1;
    
    let novoItem = taskExample.cloneNode(true);
    
    novoItem.id = novoId;

    novoItem.querySelector("strong").textContent = document.getElementById("title").value.trim();

    novoItem.querySelector("small").textContent = `Data da Tarefa: ${document.getElementById("taskDate").value.trim()}`;

    let prioridade = document.getElementById("priority").value;
    let insignia = novoItem.querySelector("span");
    insignia.textContent = prioridade;
    insignia.className = `badge bg-${prioridade === 'Alta' ? 'danger' : prioridade === 'Média' ? 'warning' : 'success'}`;

    let detalhes = novoItem.querySelector("#details");
    detalhes.id = `details-${novoId}`;
    detalhes.classList = "d-none";
    detalhes.textContent = `Criada em: ${new Date().toLocaleString()} \n Descrição: ${document.getElementById("comment").value.trim()}`;

    novoItem.setAttribute("data-criada-em", new Date().toISOString());

    return novoItem;
}

function abrirTarefa(event) {
  const tarefa = event.closest("li");

  const titulo = encodeURIComponent(tarefa.querySelector("strong").textContent);
  const data = encodeURIComponent(tarefa.querySelector("small").textContent.replace("Data da Tarefa: ", ""));
  const prioridade = encodeURIComponent(tarefa.querySelector("span").textContent);

  const descricao = tarefa.querySelector(`#details-${tarefa.id}`);
  let comentario = "";
  if (descricao) {
    const partes = descricao.textContent.split("Descrição:");
    comentario = encodeURIComponent(partes[1]?.trim() || "");
  }

  const criadaEm = encodeURIComponent(descricao?.textContent.split("Criada em:")[1]?.split("Descrição")[0]?.trim() || "");
  const notificar = encodeURIComponent("Sim");

  const url = `detail.html?titulo=${titulo}&data=${data}&prioridade=${prioridade}&comentario=${comentario}&notificacao=${notificar}&criadaEm=${criadaEm}`;

  window.open(url, "_blank");
}

function mostrarDetalhes(event) {
  const tarefa = event.closest("li");

  const el = document.getElementById(`details-${tarefa.id}`);
  el.classList.toggle('d-none');
}

function editarTarefa(event)
{
  const tarefa = event.closest("li");
  tarefaEmEdicao = tarefa;

  taskForm.hidden = false;
  document.getElementById("list-buttons").hidden = true;

  document.getElementById("title").value = tarefa.querySelector("strong").textContent;

  const dataTexto = tarefa.querySelector("small").textContent;
  const data = dataTexto.replace("Data da Tarefa: ", "").trim();
  document.getElementById("taskDate").value = data;

  document.getElementById("priority").value = tarefa.querySelector("span").textContent;

  const descricao = tarefa.querySelector(`#details-${tarefa.id}`);
  if(descricao) 
  {
    const partes = descricao.textContent.split("Descrição:");
    document.getElementById("comment").value = partes[1]?.trim() || "";
  }

  document.getElementById("notification").value = "Sim";
}

function ordenarTarefas(tipo) {
  let tarefas = Array.from(taskList.children);

  tarefas.sort((a, b) => {
    switch (tipo) {
      case "titulo":
        return a.querySelector("strong").textContent.localeCompare(b.querySelector("strong").textContent);

      case "dataTarefa":
        let dataA = new Date(a.querySelector("small").textContent.replace("Data da Tarefa: ", "").trim());
        let dataB = new Date(b.querySelector("small").textContent.replace("Data da Tarefa: ", "").trim());
        return dataA - dataB;

      case "prioridade":
        const prioridadePeso = p => p === "Alta" ? 1 : p === "Média" ? 2 : 3;
        let prioA = prioridadePeso(a.querySelector("span").textContent.trim());
        let prioB = prioridadePeso(b.querySelector("span").textContent.trim());
        return prioA - prioB;

      case "dataCriacao":
        let criacaoA = new Date(a.getAttribute("data-criada-em"));
        let criacaoB = new Date(b.getAttribute("data-criada-em"));
        return criacaoA - criacaoB;

      default:
        return 0;
    }
  });

  tarefas.forEach(t => taskList.appendChild(t));
}