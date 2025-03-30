import juan_perez from "../../../public/fotosPerfiles/juan perez.jpg";
import maria_gomez from "../../../public/fotosPerfiles/maria gomez.jpg";
import carlos_rodriguez from "../../../public/fotosPerfiles/carlos rodriguez.jpg";
import ana_fernandez from "../../../public/fotosPerfiles/ana fernanda.jpg";
import pedro_sanchez from "../../../public/fotosPerfiles/pedro sanchez.jpg";
import laura_medina from "../../../public/fotosPerfiles/laura medina.jpg";
import jorge_ramirez from "../../../public/fotosPerfiles/jorge ramirez.jpg";
import carmen_castillo from "../../../public/fotosPerfiles/carmen castillo.jpg";
import diego_herrera from "../../../public/fotosPerfiles/diego herrera.jpg";
import pablo_lopez from "../../../public/fotosPerfiles/pablo lopez.jpg";
import beatriz_nunez from "../../../public/fotosPerfiles/beatriz nuñes.jpg";
import santiago_ortega from "../../../public/fotosPerfiles/santiago ortega.jpg";
import isabel_herrera from "../../../public/fotosPerfiles/isabel herrera.jpg";
import ricardo_gomez from "../../../public/fotosPerfiles/ricardo gomez.jpg";
import monica_jimenez from "../../../public/fotosPerfiles/monica gimenez.png";
import fernando_diaz from "../../../public/fotosPerfiles/fernando diaz.jpg";
import gabriela_sanchez from "../../../public/fotosPerfiles/gabriela sanchez.jpg";
import david_ramirez from "../../../public/fotosPerfiles/david ramires.jpg";
import paula_torres from "../../../public/fotosPerfiles/paula torres.jpg";
import luis_vargas from "../../../public/fotosPerfiles/luis vargas.jpg";
import daniela_rios from "../../../public/fotosPerfiles/daniela rios.jpg";
import alejandro_castillo from "../../../public/fotosPerfiles/alejandro castillo.jpg";
import rosa_medina from "../../../public/fotosPerfiles/rosa medina.webp";
import hugo_herrera from "../../../public/fotosPerfiles/hugo herrea.jpg";
import natalia_perez from "../../../public/fotosPerfiles/natalia perez.jpg";
import roberto_jimenez from "../../../public/fotosPerfiles/roberto jimenez.webp";
import lucia_gonzalez from "../../../public/fotosPerfiles/lucia gonzales.jpg";
import martin_lopez from "../../../public/fotosPerfiles/martin lopez.jpg";


const testimonios = [
    { nombre: "Juan Pérez", descripcion: "Maravilloso en todos los aspectos, lo recomendaría sin dudar.", calificacion: "⭐⭐⭐⭐⭐", imagen: juan_perez },
    { nombre: "María Gómez", descripcion: "La peor decisión que he tomado, una decepción total.", calificacion: "⭐", imagen: maria_gomez },
    { nombre: "Carlos Rodríguez", descripcion: "No puedo estar más feliz con mi experiencia aquí.", calificacion: "⭐⭐⭐⭐", imagen: carlos_rodriguez },
    { nombre: "Ana Fernández", descripcion: "No cumplen lo que prometen, una gran decepción.", calificacion: "⭐⭐", imagen: ana_fernandez },
    { nombre: "Pedro Sánchez", descripcion: "Todo salió mejor de lo que esperaba, muy satisfecho.", calificacion: "⭐⭐⭐⭐⭐", imagen: pedro_sanchez },
    { nombre: "Laura Medina", descripcion: "Un servicio aceptable, pero podría mejorar en algunos aspectos.", calificacion: "⭐⭐⭐", imagen: laura_medina },
    { nombre: "Jorge Ramírez", descripcion: "Pésima experiencia, no lo recomendaría.", calificacion: "⭐", imagen: jorge_ramirez },
    { nombre: "Carmen Castillo", descripcion: "Muy contenta con el servicio, superó mis expectativas.", calificacion: "⭐⭐⭐⭐⭐", imagen: carmen_castillo },
    { nombre: "Diego Herrera", descripcion: "Nada especial, hay mejores opciones por ahí.", calificacion: "⭐⭐", imagen: diego_herrera },
    { nombre: "Pablo López", descripcion: "Increíble, definitivamente lo volvería a elegir.", calificacion: "⭐⭐⭐⭐⭐", imagen: pablo_lopez },
    { nombre: "Beatriz Núñez", descripcion: "No lo recomiendo, no cumple con lo prometido.", calificacion: "⭐", imagen: beatriz_nunez },
    { nombre: "Santiago Ortega", descripcion: "Aceptable, pero nada fuera de lo común.", calificacion: "⭐⭐⭐", imagen: santiago_ortega },
    { nombre: "Isabel Herrera", descripcion: "Servicio excelente, me encantó.", calificacion: "⭐⭐⭐⭐⭐", imagen: isabel_herrera },
    { nombre: "Ricardo Gómez", descripcion: "Bastante deficiente, esperaba algo mucho mejor.", calificacion: "⭐⭐", imagen: ricardo_gomez },
    { nombre: "Monica Jiménez", descripcion: "Volveré sin duda, me ha encantado.", calificacion: "⭐⭐⭐⭐⭐", imagen: monica_jimenez },
    { nombre: "Fernando Díaz", descripcion: "No está mal, aunque podría mejorar.", calificacion: "⭐⭐⭐", imagen: fernando_diaz },
    { nombre: "Gabriela Sánchez", descripcion: "Terrible experiencia, no lo recomiendo.", calificacion: "⭐", imagen: gabriela_sanchez },
    { nombre: "David Ramírez", descripcion: "Muy satisfecho con todo, excelente servicio.", calificacion: "⭐⭐⭐⭐⭐", imagen: david_ramirez },
    { nombre: "Paula Torres", descripcion: "Mediocre, esperaba más.", calificacion: "⭐", imagen: paula_torres },
    { nombre: "Luis Vargas", descripcion: "Muy bueno en general, recomendable.", calificacion: "⭐⭐⭐⭐", imagen: luis_vargas },
    { nombre: "Daniela Ríos", descripcion: "Decepcionante, una gran pérdida de tiempo.", calificacion: "⭐", imagen: daniela_rios },
    { nombre: "Alejandro Castillo", descripcion: "Mejor de lo que imaginaba, excelente.", calificacion: "⭐⭐⭐⭐⭐", imagen: alejandro_castillo },
    { nombre: "Rosa Medina", descripcion: "No fue una buena experiencia, no lo recomendaría.", calificacion: "⭐⭐", imagen: rosa_medina },
    { nombre: "Hugo Herrera", descripcion: "No está mal, pero hay mejores opciones.", calificacion: "⭐⭐⭐", imagen: hugo_herrera },
    { nombre: "Natalia Pérez", descripcion: "Un trato excelente, muy recomendable.", calificacion: "⭐⭐⭐⭐⭐", imagen: natalia_perez },
    { nombre: "Roberto Jiménez", descripcion: "Regular, no sé si volvería a elegirlo.", calificacion: "⭐⭐⭐", imagen: roberto_jimenez },
    { nombre: "Lucía González", descripcion: "Muy bueno, lo recomendaré a mis amigos.", calificacion: "⭐⭐⭐⭐⭐", imagen: lucia_gonzalez },
    { nombre: "Martín López", descripcion: "Podría mejorar, no es lo que esperaba.", calificacion: "⭐⭐", imagen: martin_lopez }
];

export default testimonios;
