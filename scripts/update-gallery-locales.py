"""Localized controls for the scene viewer; no new project copy."""
from pathlib import Path
import json

translations = {
 'fr': ['Instants d’univers', 'Ouvrir la scène', 'Scène', 'Fermer la galerie', 'Scène précédente', 'Scène suivante'],
 'en': ['Glimpses of the world', 'Open scene', 'Scene', 'Close gallery', 'Previous scene', 'Next scene'],
 'de': ['Einblicke in die Welt', 'Szene öffnen', 'Szene', 'Galerie schließen', 'Vorherige Szene', 'Nächste Szene'],
 'es': ['Instantes del universo', 'Abrir escena', 'Escena', 'Cerrar galería', 'Escena anterior', 'Escena siguiente'],
 'pt': ['Instantes do universo', 'Abrir cena', 'Cena', 'Fechar galeria', 'Cena anterior', 'Próxima cena'],
 'it': ['Scorci dell’universo', 'Apri scena', 'Scena', 'Chiudi galleria', 'Scena precedente', 'Scena successiva'],
 'nl': ['Een blik op de wereld', 'Scène openen', 'Scène', 'Galerij sluiten', 'Vorige scène', 'Volgende scène'],
 'pl': ['Migawki ze świata', 'Otwórz scenę', 'Scena', 'Zamknij galerię', 'Poprzednia scena', 'Następna scena'],
 'ru': ['Мгновения вселенной', 'Открыть сцену', 'Сцена', 'Закрыть галерею', 'Предыдущая сцена', 'Следующая сцена'],
 'tr': ['Evrenden anlar', 'Sahneyi aç', 'Sahne', 'Galeriyi kapat', 'Önceki sahne', 'Sonraki sahne'],
 'ar': ['لمحات من العالم', 'افتح المشهد', 'المشهد', 'إغلاق المعرض', 'المشهد السابق', 'المشهد التالي'],
 'hi': ['दुनिया की झलकियाँ', 'दृश्य खोलें', 'दृश्य', 'गैलरी बंद करें', 'पिछला दृश्य', 'अगला दृश्य'],
 'id': ['Sekilas dunia', 'Buka adegan', 'Adegan', 'Tutup galeri', 'Adegan sebelumnya', 'Adegan berikutnya'],
 'zh': ['世界掠影', '打开场景', '场景', '关闭图库', '上一个场景', '下一个场景'],
 'ja': ['世界のひとこま', 'シーンを開く', 'シーン', 'ギャラリーを閉じる', '前のシーン', '次のシーン'],
 'ko': ['세계의 한 장면', '장면 열기', '장면', '갤러리 닫기', '이전 장면', '다음 장면'],
}
keys = ['galleryTitle', 'galleryOpen', 'galleryScene', 'galleryClose', 'galleryPrevious', 'galleryNext']
for locale, values in translations.items():
    path = Path(__file__).resolve().parents[1]/'app/locales'/f'{locale}.json'
    data = json.loads(path.read_text(encoding='utf-8'))
    data.update(zip(keys, values))
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
