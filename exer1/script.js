const baseUrl = "https://web1-77946-default-rtdb.firebaseio.com/:null";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const taskText = input.value.trim();

  if (taskText === "") return;

  try {
    const response = await fetch(`${baseUrl}tasks.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: taskText, completed: false }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao adicionar tarefa: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    alert("Não foi possível adicionar a tarefa. Tente novamente.");
  }


  input.value = "";
  fetchTasks();
});

async function fetchTasks() {
  list.innerHTML = ""; 
   
  try {
    const response = await fetch(`${baseUrl}tasks.json`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar tarefas: ${response.statusText}`);
    }
    const data = await response.json();

    if (data) {
      // Inserir tarefa na lista
      for (const key in data) {
        const task = data[key];
        const listItem = document.createElement("li");
        listItem.textContent = task.text;
        
        // Opcional: Adicionar classe para tarefas completas (se você planeja essa funcionalidade)
        if (task.completed) {
            listItem.classList.add("completed");
        }

        list.appendChild(listItem);
      }
    }
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    alert("Não foi possível carregar as tarefas. Tente novamente.");
  }

}

fetchTasks();