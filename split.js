import fs from 'fs';
import path from 'path';

// Skonfiguruj nazwy plików
const inputFile = 'src/App.jsx'; // Skrypt jest w głównym folderze, a plik źródłowy w src/
const outputDir = './'; // Tag z nazwą pliku (np. 'src/config.js') sam wrzuci plik do odpowiedniego folderu

if (!fs.existsSync(inputFile)) {
    console.error(`❌ Błąd: Nie znaleziono pliku wejściowego "${inputFile}". Upewnij się, że ścieżka jest poprawna.`);
    process.exit(1);
}

const content = fs.readFileSync(inputFile, 'utf-8');

// Szukamy naszych tagów // @@@ FILE_START: path/to/file @@@
const fileRegex = /\/\/ @@@ FILE_START: (.*?) @@@([\s\S]*?)\/\/ @@@ FILE_END: \1 @@@/g;

let match;
let fileCount = 0;

console.log("✂️  Rozpoczynam podział pliku...");

while ((match = fileRegex.exec(content)) !== null) {
    const filePath = match[1].trim();
    // Odcinamy puste linie z góry i z dołu
    const fileContent = match[2].trim();
    
    // Tworzenie ścieżki i niezbędnych folderów
    const fullPath = path.join(outputDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    
    // Zapis do pliku
    fs.writeFileSync(fullPath, fileContent, 'utf-8');
    console.log(`✅ Utworzono: ${fullPath}`);
    fileCount++;
}

if (fileCount === 0) {
    console.warn("⚠️ Nie znaleziono żadnych tagów do podziału w pliku.");
} else {
    console.log(`\n🎉 Gotowe! Pomyślnie wyodrębniono ${fileCount} plików do folderu "${outputDir}".`);
    console.log("Pamiętaj, że w wygenerowanych plikach może być konieczne dodanie `export default` i ścieżek importu w zależności od Twojej lokalnej struktury projektu.");
}