export interface VirtualStagingItem {
  id: string;
  folderName: string;
  folderNumber: number;
  title: string;
  category: 'living' | 'notte' | 'cucina' | 'bagno' | 'studio' | 'terrazzo' | string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeDriveId: string;
  afterDriveId: string;
  highResBefore: string;
  highResAfter: string;
}

export const VIRTUAL_STAGING_ITEMS: VirtualStagingItem[] = [
  {
    "id": "vs-project-1",
    "folderName": "Cartella 1",
    "folderNumber": 1,
    "title": "Soggiorno Moderno",
    "category": "living",
    "description": "L'intervento arredativo trasforma lo spazio vuoto in un raffinato soggiorno accogliente, arricchito da un divano ad angolo chiaro, tavolino in legno massello, mobile TV minimale e tende eteree che filtrano la luce naturale.",
    "beforeImage": "/virtual-staging/previews/folder_1_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_1_dopo.jpg",
    "beforeDriveId": "1nmH0oMZxEjo5mwJgRJ4c765ChRkmrHIX",
    "afterDriveId": "1atqI401ASMM-rRFtBMNNFqLHntyS7YVq",
    "highResBefore": "https://lh3.googleusercontent.com/d/1nmH0oMZxEjo5mwJgRJ4c765ChRkmrHIX=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1atqI401ASMM-rRFtBMNNFqLHntyS7YVq=w2048"
  },
  {
    "id": "vs-project-2",
    "folderName": "Cartella 2",
    "folderNumber": 2,
    "title": "Area Living",
    "category": "living",
    "description": "L'intervento valorizza l'ampia zona giorno arredandola con un divano ad angolo grigio, poltrone in pelle, madia in legno e un'illuminazione calda e avvolgente.",
    "beforeImage": "/virtual-staging/previews/folder_2_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_2_dopo.jpg",
    "beforeDriveId": "1Q8lCwKodZMzPAsrhTo-NNqoGliTu8UiE",
    "afterDriveId": "1y2y0C7qU1Gskl8Iv_UEIuNPpLPoe8kUK",
    "highResBefore": "https://lh3.googleusercontent.com/d/1Q8lCwKodZMzPAsrhTo-NNqoGliTu8UiE=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1y2y0C7qU1Gskl8Iv_UEIuNPpLPoe8kUK=w2048"
  },
  {
    "id": "vs-project-3",
    "folderName": "Cartella 3",
    "folderNumber": 3,
    "title": "Cucina con Isola",
    "category": "cucina",
    "description": "L'intervento mostra l'inserimento di una cucina moderna componibile con finiture grigio opaco e toni caldi del legno, completata da un'isola centrale con piano in quarzo chiaro e illuminazione sottopensile a LED.",
    "beforeImage": "/virtual-staging/previews/folder_3_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_3_dopo.jpg",
    "beforeDriveId": "1HtQEd4aH1gWjkojTZ6beQzdHQqbET0YM",
    "afterDriveId": "1T-DEy4pGqqweFo8T4GeP_TyJD9GgynoI",
    "highResBefore": "https://lh3.googleusercontent.com/d/1HtQEd4aH1gWjkojTZ6beQzdHQqbET0YM=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1T-DEy4pGqqweFo8T4GeP_TyJD9GgynoI=w2048"
  },
  {
    "id": "vs-project-4",
    "folderName": "Cartella 4",
    "folderNumber": 4,
    "title": "Cucina con Isola",
    "category": "cucina",
    "description": "Virtual staging di una cucina moderna con finiture scure opache e inserti in legno caldo, valorizzata da un'isola centrale, paraschizzo a spina di pesce ed elegante illuminazione a LED integrata.",
    "beforeImage": "/virtual-staging/previews/folder_4_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_4_dopo.jpg",
    "beforeDriveId": "1OWzeWm-XnozXClbHg7ZHVPyTH1np7z4j",
    "afterDriveId": "1ikbJqPknlthRYLL1UGKJcVVuOYvOoHHa",
    "highResBefore": "https://lh3.googleusercontent.com/d/1OWzeWm-XnozXClbHg7ZHVPyTH1np7z4j=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1ikbJqPknlthRYLL1UGKJcVVuOYvOoHHa=w2048"
  },
  {
    "id": "vs-project-5",
    "folderName": "Cartella 5",
    "folderNumber": 5,
    "title": "Camera Matrimoniale",
    "category": "notte",
    "description": "La camera da letto è stata allestita con un letto imbottito dai tessili caldi nei toni dell'ocra e del salvia, comodini in legno chiaro, un tappeto geometrico e quadri decorativi che valorizzano il parquet e il soffitto con travi a vista.",
    "beforeImage": "/virtual-staging/previews/folder_5_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_5_dopo.jpg",
    "beforeDriveId": "1ZknnxtT-KkfkrZv8FfsuEawZWdzt3hQw",
    "afterDriveId": "1QLRc2meVYsJ-8mU96TDmzDVN6NnRFqpX",
    "highResBefore": "https://lh3.googleusercontent.com/d/1ZknnxtT-KkfkrZv8FfsuEawZWdzt3hQw=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1QLRc2meVYsJ-8mU96TDmzDVN6NnRFqpX=w2048"
  },
  {
    "id": "vs-project-6",
    "folderName": "Cartella 6",
    "folderNumber": 6,
    "title": "Camera da Letto Matrimoniale",
    "category": "notte",
    "description": "La camera da letto è stata completata con un confortevole letto matrimoniale imbottito, luci LED d'atmosfera integrate nella testiera, comodini moderni e mensole decorative che valorizzano le pareti blu.",
    "beforeImage": "/virtual-staging/previews/folder_6_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_6_dopo.jpg",
    "beforeDriveId": "1UD-Npxl7wMH_hJhutgTQf4Bwpoq9v12l",
    "afterDriveId": "1iLQaU22rP_xG5Pg42ELiCUh-wgzHVpxY",
    "highResBefore": "https://lh3.googleusercontent.com/d/1UD-Npxl7wMH_hJhutgTQf4Bwpoq9v12l=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1iLQaU22rP_xG5Pg42ELiCUh-wgzHVpxY=w2048"
  },
  {
    "id": "vs-project-7",
    "folderName": "Cartella 7",
    "folderNumber": 7,
    "title": "Bagno Padronale",
    "category": "bagno",
    "description": "L'intervento valorizza il bagno integrando doppi lavabi da appoggio, uno specchio circolare retroilluminato, una vasca freestanding e raffinata rubinetteria nera a contrasto con i toni caldi del legno.",
    "beforeImage": "/virtual-staging/previews/folder_7_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_7_dopo.jpg",
    "beforeDriveId": "1USYupVSIPTKNjVHRf--PwD__WYxPvEA6",
    "afterDriveId": "1RhbC7HI13WqNWnolmPA6-Fmlhlo8rW3F",
    "highResBefore": "https://lh3.googleusercontent.com/d/1USYupVSIPTKNjVHRf--PwD__WYxPvEA6=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1RhbC7HI13WqNWnolmPA6-Fmlhlo8rW3F=w2048"
  },
  {
    "id": "vs-project-8",
    "folderName": "Cartella 8",
    "folderNumber": 8,
    "title": "Bagno Padronale",
    "category": "bagno",
    "description": "L'ambiente è stato completato con un mobile lavabo sospeso in legno scuro, sanitari moderni e una vasca freestanding nell'alcova, valorizzando i rivestimenti in pietra e i tagli di luce LED integrati.",
    "beforeImage": "/virtual-staging/previews/folder_8_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_8_dopo.jpg",
    "beforeDriveId": "11lZWNDiUSuKS9JvQC5bAUqo7nPv5tjyX",
    "afterDriveId": "1k2xdKM986fVprGa6R8iaycwZTPZjKsL2",
    "highResBefore": "https://lh3.googleusercontent.com/d/11lZWNDiUSuKS9JvQC5bAUqo7nPv5tjyX=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1k2xdKM986fVprGa6R8iaycwZTPZjKsL2=w2048"
  },
  {
    "id": "vs-project-9",
    "folderName": "Cartella 9",
    "folderNumber": 9,
    "title": "Terrazzo Panoramico Vista Mare",
    "category": "terrazzo",
    "description": "Il terrazzo è stato allestito con un raffinato salotto da esterno composto da poltrone in corda intrecciata con morbidi cuscini, un tappeto outdoor blu, un tavolino in legno e rigogliose piante di bouganville che valorizzano lo splendido panorama mediterraneo.",
    "beforeImage": "/virtual-staging/previews/folder_9_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_9_dopo.jpg",
    "beforeDriveId": "1N4NiNwbukw-UQmJy0Docl4lCmdun5pRZ",
    "afterDriveId": "1FixXX4CKRaS6sm5uVAL4HVbFKcHe5IPW",
    "highResBefore": "https://lh3.googleusercontent.com/d/1N4NiNwbukw-UQmJy0Docl4lCmdun5pRZ=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1FixXX4CKRaS6sm5uVAL4HVbFKcHe5IPW=w2048"
  },
  {
    "id": "vs-project-10",
    "folderName": "Cartella 10",
    "folderNumber": 10,
    "title": "Terrazzo Panoramico",
    "category": "terrazzo",
    "description": "Il terrazzo panoramico è stato arricchito con un divano ad angolo dalle tonalità scure, un braciere a gas centrale e un set da pranzo da esterno, valorizzati dall'illuminazione a LED integrata che crea un'atmosfera accogliente di sera.",
    "beforeImage": "/virtual-staging/previews/folder_10_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_10_dopo.jpg",
    "beforeDriveId": "1En4L7YcSuDeIIif88GcNeZAC26pCEg8t",
    "afterDriveId": "17Y_prMS3Ge4OVFWQ5V4VuKUCanAWF6J-",
    "highResBefore": "https://lh3.googleusercontent.com/d/1En4L7YcSuDeIIif88GcNeZAC26pCEg8t=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/17Y_prMS3Ge4OVFWQ5V4VuKUCanAWF6J-=w2048"
  },
  {
    "id": "vs-project-11",
    "folderName": "Cartella 11",
    "folderNumber": 11,
    "title": "Facciata e Ingresso Esterno",
    "category": "terrazzo",
    "description": "Il progetto di completamento architettonico trasforma l'edificio grezzo in una villa moderna con raffinati rivestimenti in legno scuro, finiture in cemento chiaro, elegante illuminazione d'ambiente e un rigoglioso progetto di landscaping.",
    "beforeImage": "/virtual-staging/previews/folder_11_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_11_dopo.jpg",
    "beforeDriveId": "18gdl02I1M0ZxEtw08xCsPwqLC6XeI_wK",
    "afterDriveId": "1i70Evzk-YlRZgXnk6kiSnu8tkggCeFy9",
    "highResBefore": "https://lh3.googleusercontent.com/d/18gdl02I1M0ZxEtw08xCsPwqLC6XeI_wK=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1i70Evzk-YlRZgXnk6kiSnu8tkggCeFy9=w2048"
  },
  {
    "id": "vs-project-12",
    "folderName": "Cartella 12",
    "folderNumber": 12,
    "title": "Studio & Smart Working",
    "category": "studio",
    "description": "L'ambiente grezzo è stato trasformato in un moderno studio per lo smart working, caratterizzato da una parete e libreria a incasso verde salvia, una scrivania in legno con sedia ergonomica, caldo parquet ed eleganti punti luce accentuati dalla luminosità naturale del balcone.",
    "beforeImage": "/virtual-staging/previews/folder_12_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_12_dopo.jpg",
    "beforeDriveId": "19MLByEdSPwHpdvPrd8QC6fs-dWlUyPql",
    "afterDriveId": "1nKpGH-YnNiW8wCZFGwps77uLAelILge2",
    "highResBefore": "https://lh3.googleusercontent.com/d/19MLByEdSPwHpdvPrd8QC6fs-dWlUyPql=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1nKpGH-YnNiW8wCZFGwps77uLAelILge2=w2048"
  },
  {
    "id": "vs-project-13",
    "folderName": "Cartella 13",
    "folderNumber": 13,
    "title": "Cinema Moderno e Area Pedonale",
    "category": "living",
    "description": "La struttura grezza in cantiere è stata trasformata in un moderno cinema multisala con un'ampia facciata in vetro, grandi schermi LED pubblicitari, un'insegna luminosa d'impatto e un'area pedonale perfettamente illuminata e rifinita.",
    "beforeImage": "/virtual-staging/previews/folder_13_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_13_dopo.jpg",
    "beforeDriveId": "1ateLe_w_hwEADG8EUwrnRBPxyZ6Idvtp",
    "afterDriveId": "1qvBk1y1szfrDgGBGX4ZNUg6rU8wf-pCM",
    "highResBefore": "https://lh3.googleusercontent.com/d/1ateLe_w_hwEADG8EUwrnRBPxyZ6Idvtp=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1qvBk1y1szfrDgGBGX4ZNUg6rU8wf-pCM=w2048"
  },
  {
    "id": "vs-project-14",
    "folderName": "Cartella 14",
    "folderNumber": 14,
    "title": "Camera da Letto Matrimoniale con Cabina Armadio",
    "category": "notte",
    "description": "Lo spazio è stato trasformato con un elegante letto matrimoniale in legno dai toni neutri e una spettacolare cabina armadio su misura chiusa da ampie vetrate scorrevoli, valorizzata da un'illuminazione LED calda e integrata.",
    "beforeImage": "/virtual-staging/previews/folder_14_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_14_dopo.jpg",
    "beforeDriveId": "14woyLhUK1QyXmBWlVCey8I-ygfsTGxtG",
    "afterDriveId": "1bCsZ32LNm6rBGq-Z6HR1LIi9uLkssbnl",
    "highResBefore": "https://lh3.googleusercontent.com/d/14woyLhUK1QyXmBWlVCey8I-ygfsTGxtG=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1bCsZ32LNm6rBGq-Z6HR1LIi9uLkssbnl=w2048"
  },
  {
    "id": "vs-project-15",
    "folderName": "Cartella 15",
    "folderNumber": 15,
    "title": "Palestra & Area Fitness Open Space",
    "category": "studio",
    "description": "Lo spazio grezzo è stato trasformato in una palestra moderna e altamente professionale, completata con macchinari cardio e isotonici, pavimentazione gommata antiscivolo, luci pendenti di design e dettagli al neon dall'estetica industriale.",
    "beforeImage": "/virtual-staging/previews/folder_15_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_15_dopo.jpg",
    "beforeDriveId": "1syzn5KdX6A7kHbNlSefGh-Stp5G0g8pE",
    "afterDriveId": "19Dae6KMhrkf8dRzzGknoi3e95fPcAJlf",
    "highResBefore": "https://lh3.googleusercontent.com/d/1syzn5KdX6A7kHbNlSefGh-Stp5G0g8pE=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/19Dae6KMhrkf8dRzzGknoi3e95fPcAJlf=w2048"
  },
  {
    "id": "vs-project-16",
    "folderName": "Cartella 16",
    "folderNumber": 16,
    "title": "Patio Panoramico",
    "category": "terrazzo",
    "description": "La terrazza in cotto sotto il pergolato in legno è stata allestita con un elegante salotto da esterno in teak e fibra intrecciata, arricchito da cuscini e tessuti nei toni del blu e beige.",
    "beforeImage": "/virtual-staging/previews/folder_16_prima.jpg",
    "afterImage": "/virtual-staging/previews/folder_16_dopo.jpg",
    "beforeDriveId": "12oGb_X0s7SQcdrmhdidltL_iwP0SUhFw",
    "afterDriveId": "1Biazk5PKOkSf-ZXdAO2zNojjNWaWVnUy",
    "highResBefore": "https://lh3.googleusercontent.com/d/12oGb_X0s7SQcdrmhdidltL_iwP0SUhFw=w2048",
    "highResAfter": "https://lh3.googleusercontent.com/d/1Biazk5PKOkSf-ZXdAO2zNojjNWaWVnUy=w2048"
  }
];
