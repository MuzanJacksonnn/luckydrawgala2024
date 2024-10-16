const SPREADSHEET_ID = '1gDVc7UdH0P6TKq1cBtYV_D3i0RhVmarPCssWX_bR8gQ';
const API_URL = 'http://localhost:3000';
const RANGE = 'Tickets!A:A';
const API_KEY = 'AIzaSyB7khzSFUMiGDzPsa04Mq3TVdDfDGOwg70';
const BACKEND_URL = 'https://luckydrawgala2024result-33e0820293b5.herokuapp.com';
 
let currentDraw = null;

async function fetchCurrentDraw() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/current-draw`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du tirage');
    }
    currentDraw = await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de récupérer le tirage actuel. Veuillez réessayer plus tard.');
  }
}

async function checkTicket() {
  if (!currentDraw) {
    await fetchCurrentDraw();
  }

  const ticketNumber = document.getElementById('ticket-number').value;
  const resultDiv = document.getElementById('result');

  if (currentDraw[ticketNumber]) {
    const lot = currentDraw[ticketNumber];
    resultDiv.textContent = `Félicitations ! Vous avez gagné le lot ${lot.lotNumber} : ${lot.sponsor} - ${lot.description}`;
  } else {
    resultDiv.textContent = 'Désolé, vous n\'avez pas gagné. Tentez votre chance une prochaine fois !';
  }
  resultDiv.style.display = 'block';
}
function displayResult(lot) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <img src="${lot.imageUrl}" alt="${lot.description}" onerror="this.onerror=null; this.src='chemin/vers/image/par_defaut.jpg';">
    <p>Vous avez gagné : ${lot.description}</p>
  `;
}

window.secureResetDraw = async function() {
  const password = prompt("Entrez le mot de passe pour réinitialiser le tirage:");
  try {
    const response = await fetch(`${BACKEND_URL}/api/reset-draw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error('Réinitialisation échouée');
    }

    const data = await response.json();
    alert(data.message);
    currentDraw = null; // Forcer le rechargement du tirage
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    alert('Erreur lors de la réinitialisation du tirage');
  }
};

document.addEventListener('DOMContentLoaded', async function() {
  await fetchCurrentDraw();

  document.getElementById('check-ticket').addEventListener('click', checkTicket);
  document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault();
    checkTicket();
  });
});
