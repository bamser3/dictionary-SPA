let pronunciationAudio = null;

const input = document.getElementById("input");
const searchButton = document.getElementById("search-button");

const wordElement = document.getElementById("word");
const pronunciationBtn = document.getElementById("pronunciation");
const pronunciationText = pronunciationBtn.querySelector("span");

const typeOfWord = document.getElementById("type-of-word");
const definitionElement = document.getElementById("definitionText");
const example = document.getElementById("exampleText");
const additional = document.getElementById("additionalText");

const messageEl = document.getElementById("message");

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.remove("hidden");
}

async function fetchWord(searchTerm) {
  try {
    const resolution = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
    );

    if (!resolution.ok) throw new Error("Word not found");

    const data = await resolution.json();
    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

function fillPage(entry) {
  if (!entry) {
    wordElement.textContent = "Not found";
    typeOfWord.textContent = "";
    definitionElement.textContent = "";
    example.textContent = "";
    additional.textContent = "";
    pronunciationBtn.classList.add("hidden");
    return;
  }

  const meaning = entry.meanings[0];
  const definitionData = meaning.definitions[0];

  wordElement.textContent = entry.word;
  typeOfWord.textContent = meaning.partOfSpeech;

  definitionElement.textContent =
    definitionData.definition || "No definition available";

  example.textContent = definitionData.example || "No example available";

  const phoneticWithAudio = entry.phonetics?.find(
    (p) => p.audio && p.audio.length > 0
  );

  if (phoneticWithAudio) {
    pronunciationText.textContent = phoneticWithAudio.text || "Audio";
    pronunciationAudio = new Audio(phoneticWithAudio.audio);
    pronunciationBtn.classList.remove("hidden");
    messageEl.classList.add("hidden");
  } else {
    pronunciationAudio = null;
    pronunciationBtn.classList.add("hidden");
    messageEl.classList.remove("hidden");
  }

  const synonyms = definitionData.synonyms?.length
    ? definitionData.synonyms
    : meaning.synonyms;

  const antonyms = definitionData.antonyms?.length
    ? definitionData.antonyms
    : meaning.antonyms;

  let additionalText = "";

  if (synonyms?.length) {
    additionalText += `Synonyms: ${synonyms.join(", ")}\n`;
  }

  if (antonyms?.length) {
    additionalText += `Antonyms: ${antonyms.join(", ")}`;
  }

  additional.textContent = additionalText || "No additional information";
}

searchButton.addEventListener("click", async () => {
  const searchTerm = input.value.trim().toLowerCase();

  if (!searchTerm) {
    showMessage("Please enter a word");
    return;
  }

  if (searchTerm.includes(" ")) {
    showMessage("Please enter a single word");
    return;
  }

  const entry = await fetchWord(searchTerm);

  if (!entry) {
    showMessage("Word not found");
    return;
  }

  fillPage(entry);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

pronunciationBtn.addEventListener("click", () => {
  if (!pronunciationAudio) return;

  pronunciationAudio.currentTime = 0;
  pronunciationAudio.play();
});
