import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const patchFile = 'patch.txt';
const isAutoMode = process.argv.includes('--auto');

if (isAutoMode) {
    console.log("📥 [AUTO] Pobieram dane ze schowka...");
    try {
        // Wymuszenie kodowania UTF-8 naprawia błąd "krzaczków" z polskimi znakami
        const clipboardContent = execSync('powershell -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-Clipboard"', { encoding: 'utf-8' });
        if (!clipboardContent || clipboardContent.trim() === '') {
            console.log("💤 Schowek jest pusty. Przerywam operację.");
            process.exit(0);
        }
        fs.writeFileSync(patchFile, clipboardContent, 'utf-8');
        console.log("💾 [AUTO] Zapisano schowek do patch.txt.");
    } catch (error) {
        console.error("❌ [AUTO] Błąd pobierania ze schowka.", error.message);
        process.exit(1);
    }
}

console.log("🛠️  Uruchamiam Zaawansowany Patcher v5.2 (Odporny na Incepcję)...");

if (!fs.existsSync(patchFile)) {
    console.error(`❌ Błąd: Nie znaleziono pliku "${patchFile}".`);
    process.exit(1);
}

let patchContent = fs.readFileSync(patchFile, 'utf-8').replace(/\r\n/g, '\n');
if (patchContent.trim() === '') {
    console.log("💤 Plik patch.txt jest pusty.");
    process.exit(0);
}

// Bezpieczny podział pliku - unikamy wpisywania znacznika bezpośrednio
const splitToken = '### ' + 'FILE: ';
const patches = patchContent.split(splitToken).filter(p => p.trim() !== '');
let successCount = 0; let failCount = 0;

for (const p of patches) {
    const lines = p.split('\n');
    const filePath = lines[0].trim();
    const content = p.substring(lines[0].length).trim();

    if(!filePath) continue;

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    if (content.includes('<<<< CREATE')) {
        const createStart = content.indexOf('<<<< CREATE');
        const end = content.indexOf('>>>> END');
        if(createStart !== -1 && end !== -1) {
            const newContent = content.substring(createStart + 11, end).replace(/^\n/, '').replace(/\n$/, '');
            fs.writeFileSync(filePath, newContent, 'utf-8');
            console.log(`✅ Utworzono / Nadpisano: ${filePath}`);
            successCount++;
        }
    } 
    
    if (content.includes('<<<< SEARCH')) {
        const searchStart = content.indexOf('<<<< SEARCH');
        const replaceStart = content.indexOf('==== REPLACE');
        const end = content.indexOf('>>>> END');
        
        if (searchStart !== -1 && replaceStart !== -1 && end !== -1) {
            const searchStr = content.substring(searchStart + 11, replaceStart).replace(/^\n/, '').replace(/\n$/, '');
            const replaceStr = content.substring(replaceStart + 12, end).replace(/^\n/, '').replace(/\n$/, '');

            if (fs.existsSync(filePath)) {
                let fileData = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
                if (fileData.includes(searchStr)) {
                    fileData = fileData.replace(searchStr, replaceStr);
                    fs.writeFileSync(filePath, fileData, 'utf-8');
                    console.log(`✅ Zmodyfikowano: ${filePath}`);
                    successCount++;
                } else {
                    console.error(`❌ Błąd -> ${filePath}: Nie znaleziono kodu do podmiany.`);
                    failCount++;
                }
            } else {
                console.error(`❌ Błąd -> Nie znaleziono pliku do modyfikacji: ${filePath}`);
                failCount++;
            }
        }
    }
}
console.log(`\n🎉 Zakończono! Sukcesy: ${successCount}, Błędy: ${failCount}.`);
if (failCount === 0 && successCount > 0) {
    fs.writeFileSync(patchFile, '', 'utf-8');
    console.log('🧹 Wyczyszczono plik patch.txt.');
}
