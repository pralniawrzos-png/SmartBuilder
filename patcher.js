import fs from 'fs';
import path from 'path';

// Konfiguracja
const patchFile = 'patch.txt'; // Plik, do którego będziesz wklejać moje diffy

console.log("🛠️  Uruchamiam Patcher projektów...");

if (!fs.existsSync(patchFile)) {
    console.error(`❌ Błąd: Nie znaleziono pliku "${patchFile}".`);
    console.log(`Utwórz pusty plik "patch.txt" w głównym folderze i wklej tam kod od AI.`);
    process.exit(1);
}

let patchContent = fs.readFileSync(patchFile, 'utf-8');
// Normalizujemy końcówki linii (ratuje przed błędami z kopiowania Windows/Mac)
patchContent = patchContent.replace(/\r\n/g, '\n');

if (patchContent.trim() === '') {
    console.log("💤 Plik patch.txt jest pusty. Nie ma nic do zrobienia.");
    process.exit(0);
}

// Dzielimy plik na łatki na podstawie nagłówków
const patches = patchContent.split('### FILE: ').filter(p => p.trim() !== '');

let successCount = 0;
let failCount = 0;

for (const p of patches) {
    const lines = p.split('\n');
    const filePath = lines[0].trim();
    const content = p.substring(lines[0].length).trim();

    const searchStart = content.indexOf('<<<< SEARCH');
    const replaceStart = content.indexOf('==== REPLACE');
    const replaceEnd = content.indexOf('>>>> END');

    if (searchStart !== -1 && replaceStart !== -1 && replaceEnd !== -1) {
        // Wyciągamy czysty kod do podmiany, obcinając puste linie po znacznikach
        const searchStr = content.substring(searchStart + 11, replaceStart).replace(/^\n/, '').replace(/\n$/, '');
        const replaceStr = content.substring(replaceStart + 12, replaceEnd).replace(/^\n/, '').replace(/\n$/, '');

        if (fs.existsSync(filePath)) {
            let fileData = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');

            if (fileData.includes(searchStr)) {
                // Wykonujemy podmianę
                fileData = fileData.replace(searchStr, replaceStr);
                fs.writeFileSync(filePath, fileData, 'utf-8');
                console.log(`✅ Sukces -> ${filePath}`);
                successCount++;
            } else {
                console.error(`❌ Błąd -> ${filePath}: Nie mogłem znaleźć wskazanego kodu do podmiany. Upewnij się, że plik nie był modyfikowany ręcznie.`);
                failCount++;
            }
        } else {
            console.error(`❌ Błąd -> Nie znaleziono pliku na dysku: ${filePath}`);
            failCount++;
        }
    } else {
        console.warn(`⚠️ Ominięto fragment dla ${filePath} (błędny format znaczników).`);
    }
}

console.log(`\n🎉 Zakończono! Wprowadzono ${successCount} zmian. Błędy: ${failCount}.`);

// Jeśli wszystko poszło gładko, czyścimy plik dla Twojej wygody
if (failCount === 0 && successCount > 0) {
    fs.writeFileSync(patchFile, '', 'utf-8');
    console.log('🧹 Wyczyszczono plik patch.txt (gotowy na kolejne zadania!).');
}