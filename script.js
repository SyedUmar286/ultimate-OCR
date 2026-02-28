let deferredPrompt;

if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('service-worker.js');
}

window.addEventListener('beforeinstallprompt', (e) => {
e.preventDefault();
deferredPrompt = e;
document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn").addEventListener("click", async () => {
if (deferredPrompt) {
deferredPrompt.prompt();
deferredPrompt = null;
}
});

async function startOCR() {

const file = document.getElementById("imageInput").files[0];
if (!file) return alert("Upload image first");

const lang = document.getElementById("language").value;

document.getElementById("progressBar").style.width = "0%";

const worker = await Tesseract.createWorker();

await worker.loadLanguage(lang);
await worker.initialize(lang);

const { data } = await worker.recognize(file, {
logger: m => {
if (m.status === 'recognizing text') {
document.getElementById("progressBar").style.width =
Math.round(m.progress * 100) + "%";
}
}
});

document.getElementById("result").value = data.text;

await worker.terminate();
}

function copyText() {
const textArea = document.getElementById("result");
textArea.select();
document.execCommand("copy");
alert("Copied!");
}

function downloadText() {
const text = document.getElementById("result").value;
const blob = new Blob([text], { type: "text/plain" });
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "ocr-result.txt";
link.click();
}

function clearText() {
document.getElementById("result").value = "";
}
