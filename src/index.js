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

function populatePage(entry) {
  if (!entry) {
    wordElement.textContent = "Not found";
    typeOfWord.textContent = "";
    definitionElement.textContent = "";
    example.textContent = "";
    additional.textContent = "";
    pronunciationBtn.disabled = true;
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
    pronunciationText.textContent = phoneticWithAudio.text || "";
    pronunciationAudio = new Audio(phoneticWithAudio.audio);
    pronunciationBtn.disabled = false;
  } else {
    pronunciationText.textContent = "No audio";
    pronunciationAudio = null;
    pronunciationBtn.disabled = true;
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
  const searchTerm = input.value.trim();
  if (!searchTerm) return;

  const entry = await fetchWord(searchTerm);
  populatePage(entry);
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
