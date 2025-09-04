// --- Fondos ---
import wallpaperLight from '../../assets/Imag/Wallpaper/Wallpaper.png';
import wallpaperDark from '../../assets/Imag/Wallpaper/WallpaperBlack.png';

// --- Iconos Generales ---
import googleIcon from '../../assets/Imag/Iconos/googleIcon.png';
import mailIcon from '../../assets/Imag/Iconos/mailIcon.png';
import plusCircle2 from '../../assets/IconosTexto/plusCircle2.png'; // Renombrado a "plusCircle2" ya que aparece dos veces con nombres ligeramente distintos
import trashIcon from '../../assets/IconosTexto/trash.png';
import bookIcon from '../../assets/IconosTexto/book.png';
import circleFillIcon from '../../assets/IconosTexto/circleFill.png';
import sparklesIcon from '../../assets/IconosTexto/sparkles.png';
import starFillIcon from '../../assets/IconosTexto/star_fill.png';
import starIcon from '../../assets/IconosTexto/star.png';
import starSlashIcon from '../../assets/IconosTexto/star_slash.png';
import flagIcon from '../../assets/IconosTexto/flag.png';
import pencilIcon from '../../assets/IconosTexto/pencil.png';
import eyeIcon from '../../assets/IconosTexto/eye.png';
import eyeSlashIcon from '../../assets/IconosTexto/eyeSlash.png';
import mindIcon from '../../assets/IconosTexto/mind.png';
import sunIcon from '../../assets/IconosTexto/sun.png';
import starOfLifeIcon from '../../assets/IconosTexto/staroflife.png';

// --- Iconos Específicos de Flechas y navegación ---
// 'flecha.png' aparece varias veces, lo consolidamos en una sola importación
import arrowIcon from '../../assets/IconosTexto/flecha.png'; // Para todas las instancias de 'flecha.png'
import arrowIcon2 from '../../assets/IconosTexto/flecha2.png';

// --- Iconos Apple ---
import banderaApple from '../../assets/Imag/Apple/Bandera.png';
import calendarioApple from '../../assets/Imag/Apple/Calendario.png';
import relojApple from '../../assets/Imag/Apple/Reloj.png';

// --- Iconos de Navegación/Pantallas ---
import listIcon from '../../assets/Imag/Iconos/List.png';
import dailyIcon from '../../assets/Imag/Iconos/Daily.png';
import calendarIcon from '../../assets/Imag/Iconos/Calendar.png';
import notesIcon from '../../assets/Imag/Iconos/Notes.png';
import settingsIcon from '../../assets/Imag/Iconos/Settings.png';


const ASSETS = {
    backgrounds: {
        light: wallpaperLight,
        dark: wallpaperDark,
    },
    icons: {
        general: { // Iconos generales
            google: googleIcon,
            mail: mailIcon,
            plusCircle: plusCircle2, // Usamos el nombre más genérico para "plusCircle2"
            trash: trashIcon,
            book: bookIcon,
            circleFill: circleFillIcon,
            sparkles: sparklesIcon,
            starFill: starFillIcon,
            star: starIcon,
            starSlash: starSlashIcon,
            flag: flagIcon,
            pencil: pencilIcon,
            eye: eyeIcon,
            eyeSlash: eyeSlashIcon,
            mind: mindIcon,
            sun: sunIcon,
            arrow: arrowIcon, // La flecha consolidada
            arrow2: arrowIcon2,
            starOfLife: starOfLifeIcon,
        },
        apple: { // Iconos específicos de Apple
            bandera: banderaApple,
            calendario: calendarioApple,
            reloj: relojApple,
        },
        navigation: { // Iconos para la navegación/pantallas
            list: listIcon,
            daily: dailyIcon,
            calendar: calendarIcon,
            notes: notesIcon,
            settings: settingsIcon,
        },
    },
};

export default ASSETS;