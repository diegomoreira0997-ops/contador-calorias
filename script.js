const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];

function todayStr(){ return new Date().toISOString().slice(0,10); }
function fmtDateLabel(dateStr){
  const [y,m,d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m-1, d);
  const isToday = dateStr === todayStr();
  const label = dt.toLocaleDateString('pt-BR', {weekday:'short', day:'2-digit', month:'short'});
  return isToday ? `Hoje` : label;
}
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function round(n){ return Math.round(n*10)/10; }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

function food(name,kcal,protein,carb,fat){ return {id:uid(), name, kcal, protein, carb, fat}; }

// ---------- Supabase ----------
const SUPABASE_URL = 'https://enihoxjbztkhsjmrqrmz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JXULLB5vZ-Fvga90Ougspg_fSt3i6Xa';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let USER_ID = null; // definido após login, a partir da sessão autenticada
const DEFAULT_FOODS = [
  food("Arroz branco cozido", 128, 2.5, 28, 0.2),
  food("Arroz integral cozido", 124, 2.6, 25.8, 1),
  food("Aveia em flocos", 394, 13.9, 67, 8.5),
  food("Macarrão cozido", 111, 3.8, 23, 0.5),
  food("Quinoa cozida", 120, 4.4, 21.3, 1.9),
  food("Pão francês", 300, 8, 58, 3),
  food("Pão de forma integral", 253, 9.4, 49, 3.5),
  food("Tapioca (goma hidratada)", 140, 0, 34, 0),
  food("Granola", 471, 10, 64, 20),
  food("Nescau cereal", 388, 6, 77, 5),
  food("Feijão carioca cozido", 76, 4.8, 13.6, 0.5),
  food("Feijão preto cozido", 77, 4.5, 14, 0.5),
  food("Lentilha cozida", 93, 6.3, 16.3, 0.5),
  food("Grão de bico cozido", 164, 8.9, 27.4, 2.6),
  food("Ervilha cozida", 81, 5.4, 14.5, 0.4),
  food("Peito de frango grelhado", 159, 32, 0, 2.5),
  food("Coxa e sobrecoxa de frango assada (com pele)", 237, 28.6, 0, 12.8),
  food("Carne moída cozida (patinho)", 212, 26, 0, 11),
  food("Bife de patinho grelhado", 219, 35.9, 0, 7.3),
  food("Alcatra grelhada", 163, 30, 0, 4),
  food("Costela bovina assada", 350, 25, 0, 27),
  food("Linguado assado", 90, 20, 0, 1),
  food("Salmão grelhado", 243, 26.1, 0, 14.5),
  food("Tilápia grelhada", 96, 20.1, 0, 1.7),
  food("Atum em lata (óleo, drenado)", 187, 26, 0, 8.2),
  food("Camarão cozido", 90, 19, 0, 1),
  food("Ovo cozido", 146, 13.3, 0.6, 9.5),
  food("Ovo frito", 240, 15.6, 1.2, 18.6),
  food("Pão com ovo (1 pão francês + 1 ovo frito)", 270, 11.8, 29.6, 10.8),
  food("Peito de peru fatiado", 111, 20, 2, 2),
  food("Linguiça toscana assada", 290, 15, 1, 25),
  food("Bacon frito", 541, 37, 1.4, 42),
  food("Leite integral", 61, 3, 4.7, 3.2),
  food("Leite desnatado", 35, 3.4, 4.9, 0.2),
  food("Iogurte natural integral", 61, 4, 4.9, 3),
  food("Yogurte grego integral", 97, 9, 4, 5),
  food("Queijo mussarela", 280, 22, 3, 21),
  food("Queijo minas frescal", 264, 17.4, 3.2, 20.2),
  food("Queijo prato", 360, 25, 1.9, 29),
  food("Requeijão", 257, 9, 3, 24),
  food("Whey protein (pó)", 400, 80, 8, 5),
  food("Azeite de oliva", 884, 0, 0, 100),
  food("Manteiga", 726, 0.4, 0.1, 82),
  food("Castanha do pará", 656, 14.3, 15, 66),
  food("Amendoim torrado", 544, 27.2, 20, 44),
  food("Pasta de amendoim", 588, 25, 20, 50),
  food("Amêndoas", 579, 21.2, 21.7, 49.9),
  food("Abacate", 96, 1.2, 6, 8.4),
  food("Banana nanica", 92, 1.3, 24, 0.1),
  food("Banana prata", 98, 1.3, 26, 0.1),
  food("Maçã", 56, 0.2, 15, 0),
  food("Melancia", 33, 0.6, 8.1, 0),
  food("Melão", 29, 0.7, 7.5, 0),
  food("Morango", 30, 0.9, 6.8, 0.3),
  food("Laranja", 45, 1, 11.5, 0.1),
  food("Mamão", 40, 0.5, 10, 0.1),
  food("Manga", 64, 0.4, 17, 0.2),
  food("Uva", 53, 0.7, 14, 0.2),
  food("Abacaxi", 48, 0.9, 12.3, 0.1),
  food("Kiwi", 51, 1.1, 11.5, 0.4),
  food("Pera", 53, 0.4, 14, 0.1),
  food("Brócolis cozido", 25, 2.1, 4.4, 0.3),
  food("Legumes cozidos (mix)", 50, 2, 10, 0.3),
  food("Batata inglesa cozida", 52, 1.2, 11.9, 0.1),
  food("Batata doce cozida", 86, 1.6, 20, 0.1),
  food("Cenoura crua", 41, 0.9, 10, 0.2),
  food("Tomate", 18, 0.9, 3.9, 0.2),
  food("Alface", 15, 1.4, 2.9, 0.2),
  food("Couve refogada", 60, 3, 4, 4),
  food("Abobrinha refogada", 20, 1.2, 4.3, 0.2),
  food("Chocolate ao leite", 535, 7, 59, 30),
  food("Pizza (média, recheio comum)", 266, 11, 33, 10),
  food("Hambúrguer lanche (artesanal simples)", 278, 14, 24, 14),
  food("Batata frita (porção)", 312, 3.4, 41, 15),
  food("Refrigerante comum", 42, 0, 10.5, 0),
  food("Suco de laranja natural", 45, 0.7, 10.4, 0.2),
  food("Mel", 304, 0.4, 82.4, 0),
  // Mais carnes e cortes
  food("Picanha grelhada", 289, 25, 0, 21),
  food("Contra-filé grelhado", 225, 32, 0, 10),
  food("Maminha grelhada", 172, 31, 0, 5),
  food("Fraldinha grelhada", 240, 28, 0, 14),
  food("Lombo suíno assado", 210, 28, 0, 10),
  food("Costela suína assada", 397, 24, 0, 33),
  food("Frango a passarinho frito", 280, 25, 5, 18),
  food("Carne seca cozida", 250, 33, 0, 13),
  food("Presunto fatiado", 128, 18, 2, 5),
  food("Mortadela fatiada", 285, 12, 3, 26),
  food("Salsicha cozida", 257, 12, 3, 22),
  food("Peru moído cru", 148, 20, 0, 7),
  food("Pescada grelhada", 110, 20, 0, 2.5),
  food("Sardinha em lata (óleo)", 210, 21, 0, 14),
  food("Merluza grelhada", 105, 18, 0, 3),
  // Mais laticínios
  food("Queijo cottage", 98, 11, 3.4, 4.3),
  food("Queijo coalho grelhado", 320, 24, 1, 25),
  food("Cream cheese", 342, 6, 4, 34),
  food("Leite de amêndoas (sem açúcar)", 15, 0.5, 0.6, 1.2),
  food("Leite de coco", 230, 2.3, 6, 24),
  // Mais grãos, farinhas e pães
  food("Cuscuz de milho cozido", 112, 2.3, 25, 0.4),
  food("Farinha de mandioca", 361, 1.6, 88, 0.3),
  food("Farofa pronta", 405, 3, 65, 14),
  food("Milho verde cozido", 98, 3.4, 21, 1.2),
  food("Pão sírio", 275, 9, 55, 2),
  food("Wrap integral", 265, 9, 46, 5),
  food("Bolacha água e sal", 432, 10, 75, 11),
  food("Bolacha recheada", 480, 6, 68, 20),
  food("Torrada", 407, 11, 76, 5),
  food("Cornflakes", 378, 7, 84, 0.9),
  // Mais leguminosas
  food("Feijão branco cozido", 92, 6.5, 16.6, 0.4),
  food("Feijão fradinho cozido", 116, 7.9, 20.9, 0.6),
  // Mais vegetais
  food("Pepino", 12, 0.7, 2.4, 0.1),
  food("Repolho cru", 25, 1.3, 5.2, 0.1),
  food("Beterraba cozida", 32, 1.3, 7.3, 0.1),
  food("Espinafre refogado", 34, 3, 3, 1.5),
  food("Pimentão", 25, 1.1, 5.6, 0.2),
  food("Cebola crua", 39, 1.4, 8.9, 0.1),
  food("Chuchu cozido", 19, 0.6, 4.4, 0.1),
  food("Vagem cozida", 27, 1.6, 6, 0.1),
  food("Rúcula", 17, 1.8, 2.1, 0.4),
  food("Milho de pipoca (sem gordura)", 387, 12.9, 74, 4.5),
  // Mais frutas
  food("Ameixa", 46, 0.7, 11.4, 0.3),
  food("Caqui", 70, 0.6, 18.6, 0.4),
  food("Goiaba", 54, 1.1, 12.4, 0.5),
  food("Maracujá (polpa)", 68, 2, 12, 2.1),
  food("Coco fresco", 354, 3.3, 15, 33.5),
  food("Tangerina", 46, 0.8, 11.5, 0.2),
  food("Damasco seco", 241, 3.4, 62.6, 0.5),
  // Bebidas
  food("Café sem açúcar", 2, 0.1, 0, 0),
  food("Cerveja comum", 43, 0.5, 3.6, 0),
  food("Vinho tinto", 85, 0.1, 2.6, 0),
  food("Água de coco", 22, 0.1, 5.3, 0),
  food("Isotônico", 24, 0, 6, 0),
  food("Achocolatado pronto (caixinha)", 62, 1.5, 11, 1.3),
  // Doces e snacks
  food("Sorvete de massa", 207, 3.5, 24, 11),
  food("Biscoito de polvilho", 470, 4, 65, 22),
  food("Barra de cereal", 375, 6, 70, 8),
  food("Brigadeiro", 411, 4, 60, 17),
  food("Paçoca", 469, 15, 45, 27),
  food("Bolo simples (fatia)", 315, 5, 50, 11),
  food("Chocolate branco", 539, 5.9, 59, 32),
  // Pratos prontos / fast food
  food("Coxinha de frango frita", 280, 10, 25, 16),
  food("Pastel de carne frito", 300, 9, 30, 16),
  food("Esfirra de carne assada", 260, 11, 28, 11),
  food("Nuggets de frango assados", 296, 15, 18, 19),
  food("Lasanha à bolonhesa", 190, 9, 18, 9),
  food("Estrogonofe de frango", 178, 13, 6, 11),
  food("Feijoada (porção completa)", 220, 14, 15, 12),
  food("Sushi (peça, salmão)", 48, 2.3, 7.5, 1),
  food("Torta de frango (fatia)", 260, 9, 22, 15),
  // Churrasco
  food("Linguiça calabresa assada", 280, 13, 2, 25),
  food("Coração de galinha grelhado", 219, 22, 0.1, 14),
  food("Asa de frango assada", 203, 21, 0, 13),
  food("Cupim assado", 258, 27, 0, 17),
  food("Filé mignon grelhado", 208, 32, 0, 8),
  food("Paleta suína assada", 259, 26, 0, 17),
  food("Pão de alho assado", 330, 7, 40, 16),
  food("Vinagrete", 32, 0.8, 6, 0.5),
  // Lanches e sanduíches
  food("Pão com queijo", 310, 13, 32, 14),
  food("Cachorro-quente completo", 280, 10, 28, 15),
  food("Misto quente", 300, 13, 30, 14),
  food("X-salada", 350, 18, 30, 18),
  food("X-bacon", 420, 20, 30, 25),
  food("Bauru", 320, 17, 28, 16),
  food("Sanduíche natural de frango", 230, 15, 25, 7),
  // Salgados
  food("Pastel de queijo frito", 290, 9, 28, 16),
  food("Pastel de frango frito", 270, 10, 27, 14),
  food("Empada de frango", 320, 8, 30, 19),
  food("Risole de carne", 260, 8, 25, 14),
  food("Kibe frito", 250, 12, 18, 15),
  food("Croquete de carne", 240, 11, 20, 13),
  // Vegetais
  food("Vegetais mistos refogados", 45, 2, 8, 1),
  food("Salada de folhas mista", 20, 1.5, 3, 0.3),
  food("Aspargos cozidos", 20, 2.2, 3.7, 0.2),
  food("Berinjela refogada", 35, 1, 6, 1.5),
  food("Nabo cozido", 22, 0.8, 5, 0.1),
  food("Rabanete", 16, 0.7, 3.4, 0.1),
  food("Alho-poró refogado", 30, 1, 6, 0.2),
  food("Aipo/salsão", 14, 0.7, 3, 0.2),
  food("Couve-flor cozida", 25, 2, 5, 0.3),
  food("Ervilha torta", 42, 3, 7.5, 0.2),
  food("Quiabo refogado", 33, 2, 7, 0.2),
  food("Jiló", 25, 1.6, 5.7, 0.2),
  food("Mandioquinha cozida", 80, 1.5, 18.5, 0.2),
  food("Inhame cozido", 118, 2.1, 27.6, 0.2),
  food("Palmito", 26, 2.2, 4.3, 0.4),
  food("Azeitona verde", 145, 1, 3.8, 15),
  // Massas
  food("Nhoque de batata", 130, 3, 26, 1.5),
  food("Talharim cozido", 110, 3.8, 22, 0.5),
  food("Lasanha de legumes", 130, 5, 15, 5),
  food("Ravioli recheado (carne)", 170, 7, 24, 5),
  // Sopas e caldos
  food("Sopa de legumes", 40, 1.5, 7, 0.5),
  food("Caldo verde", 90, 3, 10, 4),
  food("Canja de galinha", 65, 5, 8, 1.5),
  // Café da manhã
  food("Panqueca americana", 227, 6, 28, 10),
  food("Waffle", 291, 7, 36, 13),
  food("Crepioca (tapioca com ovo)", 180, 10, 18, 7),
  food("Vitamina de banana", 95, 3, 17, 1.5),
  food("Mingau de aveia", 68, 2.4, 12, 1.4),
  food("Tapioca com queijo e coco", 220, 5, 34, 7),
  food("Café com leite", 42, 1.8, 4.5, 1.8),
  food("Chá sem açúcar", 1, 0, 0.3, 0),
  // Frutas
  food("Framboesa", 52, 1.2, 12, 0.7),
  food("Amora", 43, 1.4, 10, 0.5),
  food("Jaca", 95, 1.5, 23, 0.3),
  food("Lichia", 66, 0.8, 16.5, 0.4),
  food("Carambola", 31, 1, 6.7, 0.3),
  food("Physalis", 53, 1.9, 11, 0.7),
  food("Pêssego", 39, 0.9, 9.5, 0.3),
  food("Ameixa seca", 240, 2.2, 63.9, 0.4),
  food("Figo", 74, 0.8, 19, 0.3),
  food("Nectarina", 44, 1, 10.6, 0.3),
  // Grãos e farinhas
  food("Arroz parboilizado cozido", 130, 2.7, 27.9, 0.3),
  food("Farinha de trigo", 364, 10, 76, 1),
  food("Farinha de aveia", 389, 17, 66, 7),
  food("Painço cozido", 119, 3.5, 23.7, 1),
  food("Trigo sarraceno cozido", 92, 3.4, 20, 0.6),
  food("Pão de forma tradicional", 253, 8, 50, 3),
  food("Biscoito cream cracker", 432, 10, 74, 12),
  food("Wafer recheado", 480, 6, 65, 22),
  // Laticínios
  food("Leite condensado", 321, 7.7, 54, 8),
  food("Creme de leite", 239, 2.6, 4.2, 25),
  food("Iogurte grego light", 59, 10, 3.6, 0.4),
  food("Whey isolado (pó)", 370, 85, 4, 1),
  food("Kefir", 58, 3.3, 4.5, 2.5),
  food("Iogurte com frutas", 88, 3.2, 15, 1.5),
  // Bebidas
  food("Vodka", 231, 0, 0, 0),
  food("Whisky", 250, 0, 0, 0),
  food("Caipirinha", 165, 0.1, 15, 0),
  food("Água tônica", 34, 0, 8.8, 0),
  // Doces
  food("Pudim de leite", 172, 4, 26, 5),
  food("Mousse de chocolate", 205, 4, 22, 12),
  food("Torta de limão (fatia)", 320, 5, 42, 15),
  food("Pé de moleque", 458, 12, 45, 27),
  food("Cocada", 380, 3, 60, 15),
  food("Milk-shake", 195, 4.5, 30, 6),
  food("Gelatina", 62, 1.5, 14, 0),
  // Pratos regionais
  food("Baião de dois", 160, 6, 24, 4.5),
  food("Arroz de carreteiro", 190, 10, 22, 7),
  food("Vatapá", 220, 8, 15, 15),
  food("Acarajé", 280, 8, 25, 17),
  food("Tutu de feijão", 150, 7, 20, 5),
  // Mais proteínas
  food("Filé de tilápia empanado", 220, 15, 12, 12),
  food("Peito de frango empanado", 250, 18, 15, 13),
  food("Lombo bovino grelhado", 195, 30, 0, 8),
  food("Bacalhau dessalgado cozido", 105, 23, 0, 0.8),
  food("Polvo cozido", 92, 19, 2.2, 1),
  food("Lula grelhada", 92, 15.6, 3.1, 1.4),
  // Molhos e condimentos
  food("Molho de tomate", 29, 1.4, 6, 0.2),
  food("Maionese", 680, 1, 3, 75),
  food("Ketchup", 112, 1.2, 27, 0.2),
  food("Mostarda", 66, 4, 8, 3.3),
];
const DEFAULT_TARGETS = {kcal:2200, protein:170, carb:220, fat:65};
const DEFAULT_BODYWEIGHT = 95;
const DEFAULT_PROFILE_STATS = {height:175, age:29, sex:'m', activity:1.55, goal:-500};

const INTENSITY_MET = {leve:4, moderada:6, intensa:8};
const INTENSITY_LABELS = {leve:'Leve', moderada:'Moderada', intensa:'Intensa'};
const DEFAULT_ROUTINES = [
  {id:uid(), name:"Treino A — Peito", duration:50, intensity:'moderada'},
  {id:uid(), name:"Treino B — Costas", duration:50, intensity:'moderada'},
  {id:uid(), name:"Treino C — Perna", duration:55, intensity:'intensa'},
  {id:uid(), name:"Treino D — Bíceps/Tríceps", duration:45, intensity:'leve'},
  {id:uid(), name:"Treino E — Ombro", duration:45, intensity:'moderada'},
  {id:uid(), name:"Futebol", duration:60, intensity:'intensa'},
];

function classifyFood(f){
  const vals = {proteina: f.protein, carboidrato: f.carb, gordura: f.fat};
  const total = f.protein + f.carb + f.fat;
  if(total <= 0) return 'misto';
  const [topKey, topVal] = Object.entries(vals).sort((a,b)=>b[1]-a[1])[0];
  return (topVal/total) >= 0.45 ? topKey : 'misto';
}
function tagHtml(cat){
  if(cat==='proteina') return `<span class="tag protein">P</span>`;
  if(cat==='carboidrato') return `<span class="tag carb">C</span>`;
  if(cat==='gordura') return `<span class="tag fat">G</span>`;
  return `<span class="tag neutral">Misto</span>`;
}

let state = {
  foods: [], targets: {...DEFAULT_TARGETS}, currentDate: todayStr(), log: [],
  routines: [], bodyweight: DEFAULT_BODYWEIGHT, activities: [],
  profileName: '', profileStats: {...DEFAULT_PROFILE_STATS}
};
let currentTab = 'diario';
let dailyFilter = 'todos';
let dailySearch = '';
let selectedFood = null;
let quickAddGrams = null;
state.recentFoods = []; // [{foodId, lastGrams}], mais recente primeiro
let foodsSearch = '';
let pendingDelete = null;
let toastTimer = null;


let authMode = 'login'; // 'login' | 'signup'
let authEmail = '';

function showAuthLoading(show){
  document.getElementById('authLoading').style.display = show ? 'block' : 'none';
}
function showAuthScreen(){
  showAuthLoading(false);
  document.getElementById('mainWrap').style.display = 'none';
  document.getElementById('authWrap').style.display = 'block';
  wireAuthForm();
}
function showMainApp(){
  showAuthLoading(false);
  document.getElementById('authWrap').style.display = 'none';
  document.getElementById('mainWrap').style.display = 'block';
}

function wireAuthForm(){
  const titleEl = document.getElementById('authTitle');
  const submitBtn = document.getElementById('authSubmitBtn');
  const toggleText = document.getElementById('authToggleText');
  const toggleBtn = document.getElementById('authToggleBtn');
  const msg = document.getElementById('authMsg');

  function applyMode(){
    titleEl.textContent = authMode==='login' ? 'Entrar' : 'Criar conta';
    submitBtn.textContent = authMode==='login' ? 'Entrar' : 'Criar conta';
    toggleText.textContent = authMode==='login' ? 'Ainda não tem conta?' : 'Já tem conta?';
    toggleBtn.textContent = authMode==='login' ? 'Criar conta' : 'Entrar';
    msg.textContent = ''; msg.className = 'msg';
  }
  applyMode();

  toggleBtn.onclick = ()=>{ authMode = authMode==='login' ? 'signup' : 'login'; applyMode(); };

  submitBtn.onclick = async ()=>{
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    if(!email || password.length<6){
      msg.textContent = 'Informe um e-mail válido e uma senha com pelo menos 6 caracteres.';
      msg.className = 'msg err';
      return;
    }
    submitBtn.disabled = true;
    if(authMode==='login'){
      const { error } = await sb.auth.signInWithPassword({email, password});
      submitBtn.disabled = false;
      if(error){ msg.textContent = 'E-mail ou senha inválidos.'; msg.className = 'msg err'; return; }
      // onAuthStateChange cuida do resto
    } else {
      const { data, error } = await sb.auth.signUp({email, password});
      submitBtn.disabled = false;
      if(error){ msg.textContent = 'Não foi possível criar a conta: ' + error.message; msg.className = 'msg err'; return; }
      if(data.session){
        // confirmação de e-mail desativada no projeto — já entra direto
      } else {
        msg.textContent = 'Conta criada! Confira seu e-mail pra confirmar antes de entrar.';
        msg.className = 'msg';
      }
    }
  };
}

async function logout(){
  await sb.auth.signOut();
}

let initialAuthResolved = false;

sb.auth.onAuthStateChange((event, session)=>{
  applyAuthSession(session);
});

// Reforço: garante a decisão inicial (login vs app) mesmo se o evento acima
// não disparar imediatamente nesse ambiente/navegador.
sb.auth.getSession().then(({data})=>{
  if(!initialAuthResolved) applyAuthSession(data.session);
});

function applyAuthSession(session){
  initialAuthResolved = true;
  if(session && session.user){
    USER_ID = session.user.id;
    authEmail = session.user.email || '';
    showMainApp();
    loadAll();
  } else {
    USER_ID = null;
    authEmail = '';
    showAuthScreen();
  }
}

showAuthLoading(true);

async function loadAll(){
  // Alimentos: se a tabela estiver vazia (primeiro uso), semeia com a base padrão
  let { data: foods } = await sb.from('foods').select('*').eq('user_id', USER_ID).order('name');
  if(!foods || foods.length===0){
    const seed = DEFAULT_FOODS.map(f=>({user_id:USER_ID, name:f.name, kcal:f.kcal, protein:f.protein, carb:f.carb, fat:f.fat}));
    const { data: inserted } = await sb.from('foods').insert(seed).select();
    foods = inserted || [];
  }
  state.foods = foods.map(mapFoodRow);

  // Metas diárias
  let { data: targets } = await sb.from('targets').select('*').eq('user_id', USER_ID).maybeSingle();
  if(!targets){
    const { data: inserted } = await sb.from('targets').insert({user_id:USER_ID, ...DEFAULT_TARGETS}).select().single();
    targets = inserted;
  }
  state.targets = {kcal:targets.kcal, protein:targets.protein, carb:targets.carb, fat:targets.fat};

  // Rotinas de treino
  let { data: routines } = await sb.from('routines').select('*').eq('user_id', USER_ID).order('name');
  if(!routines || routines.length===0){
    const seed = DEFAULT_ROUTINES.map(r=>({user_id:USER_ID, name:r.name, duration:r.duration, intensity:r.intensity}));
    const { data: inserted } = await sb.from('routines').insert(seed).select();
    routines = inserted || [];
  }
  state.routines = routines.map(mapRoutineRow);

  // Perfil (nome, peso, dados da calculadora, alimentos recentes)
  let { data: profile } = await sb.from('profile').select('*').eq('user_id', USER_ID).maybeSingle();
  if(!profile){
    const { data: inserted } = await sb.from('profile').insert({
      user_id: USER_ID, name: state.profileName, bodyweight: DEFAULT_BODYWEIGHT,
      height: DEFAULT_PROFILE_STATS.height, age: DEFAULT_PROFILE_STATS.age, sex: DEFAULT_PROFILE_STATS.sex,
      activity_level: DEFAULT_PROFILE_STATS.activity, goal: DEFAULT_PROFILE_STATS.goal, recent_foods: []
    }).select().single();
    profile = inserted;
  }
  state.profileName = profile.name || '';
  state.bodyweight = profile.bodyweight;
  state.profileStats = {height:profile.height, age:profile.age, sex:profile.sex, activity:profile.activity_level, goal:profile.goal};
  state.recentFoods = profile.recent_foods || [];

  await loadLogForDate(state.currentDate);
  await loadActivitiesForDate(state.currentDate);
  renderGreeting();
  render();
}

function mapFoodRow(r){ return {id:r.id, name:r.name, kcal:r.kcal, protein:r.protein, carb:r.carb, fat:r.fat}; }
function mapRoutineRow(r){ return {id:r.id, name:r.name, duration:r.duration, intensity:r.intensity}; }
function mapLogRow(r){ return {id:r.id, foodId:r.food_id, name:r.name, grams:r.grams, kcal:r.kcal, protein:r.protein, carb:r.carb, fat:r.fat}; }
function mapActivityRow(r){ return {id:r.id, routineId:r.routine_id, name:r.name, intensity:r.intensity, duration:r.duration, kcal:r.kcal}; }

// Busca os dados sem mutar o estado global — usado com controle de concorrência em goToDate().
async function fetchLogForDate(dateStr){
  const { data, error } = await sb.from('daily_logs').select('*').eq('user_id', USER_ID).eq('log_date', dateStr).order('created_at');
  if(error){ console.error(error); return []; }
  return (data||[]).map(mapLogRow);
}
async function fetchActivitiesForDate(dateStr){
  const { data, error } = await sb.from('activities').select('*').eq('user_id', USER_ID).eq('activity_date', dateStr).order('created_at');
  if(error){ console.error(error); return []; }
  return (data||[]).map(mapActivityRow);
}
// Mantidas para compatibilidade com o carregamento inicial (loadAll), que não corre risco de concorrência.
async function loadLogForDate(dateStr){ state.log = await fetchLogForDate(dateStr); }
async function loadActivitiesForDate(dateStr){ state.activities = await fetchActivitiesForDate(dateStr); }

async function saveTargets(){ await sb.from('targets').upsert({user_id:USER_ID, ...state.targets}).select(); }
async function saveRoutines(){ /* rotinas são persistidas individualmente (insert/delete) — ver wireAtividades */ }
async function saveBodyweight(){ await sb.from('profile').update({bodyweight: state.bodyweight}).eq('user_id', USER_ID); }
async function saveRecentFoods(){ await sb.from('profile').update({recent_foods: state.recentFoods}).eq('user_id', USER_ID); }
function registerFoodUsage(foodId, grams){
  state.recentFoods = state.recentFoods.filter(r=>r.foodId!==foodId);
  state.recentFoods.unshift({foodId, lastGrams: grams});
  state.recentFoods = state.recentFoods.slice(0, 10);
  saveRecentFoods();
}
async function saveProfileName(){ await sb.from('profile').update({name: state.profileName}).eq('user_id', USER_ID); }
async function saveProfileStats(){
  const ps = state.profileStats;
  await sb.from('profile').update({height:ps.height, age:ps.age, sex:ps.sex, activity_level:ps.activity, goal:ps.goal}).eq('user_id', USER_ID);
}
async function deleteLogEntryDB(id){ await sb.from('daily_logs').delete().eq('id', id); }
async function deleteActivityDB(id){ await sb.from('activities').delete().eq('id', id); }

function totalsForLog(){
  return state.log.reduce((acc,e)=>{acc.kcal+=e.kcal;acc.protein+=e.protein;acc.carb+=e.carb;acc.fat+=e.fat;return acc;},{kcal:0,protein:0,carb:0,fat:0});
}
function totalActivityKcal(){ return state.activities.reduce((s,a)=>s+a.kcal,0); }

/* ---------- Toast / Undo ---------- */
function showToast(message, onUndo){
  clearTimeout(toastTimer);
  const t = $('#toast');
  $('#toastMsg').textContent = message;
  t.classList.add('show');
  const undoBtn = $('#toastUndoBtn');
  undoBtn.style.display = onUndo ? 'inline-block' : 'none';
  undoBtn.onclick = onUndo ? (()=>{ onUndo(); hideToast(); }) : null;
  toastTimer = setTimeout(hideToast, onUndo ? 4000 : 3200);
}
function hideToast(){ $('#toast').classList.remove('show'); }

async function removeLogEntry(id){
  const idx = state.log.findIndex(e=>e.id===id);
  if(idx===-1) return;
  const [item] = state.log.splice(idx,1);
  pendingDelete = {kind:'log', item, idx};
  render();
  showToast('Alimento removido', ()=>{
    state.log.splice(pendingDelete.idx,0,pendingDelete.item);
    pendingDelete = null;
    render();
  });
  const captured = item.id;
  setTimeout(async ()=>{
    if(pendingDelete && pendingDelete.item.id===captured){ await deleteLogEntryDB(captured); pendingDelete=null; }
  }, 4100);
}
async function removeActivity(id){
  const idx = state.activities.findIndex(e=>e.id===id);
  if(idx===-1) return;
  const [item] = state.activities.splice(idx,1);
  pendingDelete = {kind:'activity', item, idx};
  render();
  showToast('Atividade removida', ()=>{
    state.activities.splice(pendingDelete.idx,0,pendingDelete.item);
    pendingDelete = null;
    render();
  });
  const captured = item.id;
  setTimeout(async ()=>{
    if(pendingDelete && pendingDelete.item.id===captured){ await deleteActivityDB(captured); pendingDelete=null; }
  }, 4100);
}

/* ---------- Greeting ---------- */
function renderGreeting(){
  const h = new Date().getHours();
  const greet = h<5 ? 'Boa noite' : h<12 ? 'Bom dia' : h<18 ? 'Boa tarde' : 'Boa noite';
  const dateLabel = new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long'});
  $('#greetingText').textContent = state.profileName ? `${greet}, ${state.profileName}` : greet;
  $('#greetingDate').textContent = cap(dateLabel);
}

/* ---------- Main render ---------- */
function render(){
  $$('#tabs .tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===currentTab));
  const app = document.getElementById('app');
  app.className = '';
  if(currentTab==='diario') app.innerHTML = renderDiarioTab();
  else if(currentTab==='alimentos') app.innerHTML = renderAlimentosTab();
  else if(currentTab==='atividades') app.innerHTML = renderAtividadesTab();
  else if(currentTab==='mensal') app.innerHTML = renderMensalTab();
  else app.innerHTML = renderPerfilTab();
  wireCommon();
  if(currentTab==='diario') wireDiario();
  else if(currentTab==='alimentos') wireAlimentos();
  else if(currentTab==='atividades') wireAtividades();
  else if(currentTab==='mensal') wireMensal();
  else wirePerfil();
}

function wireCommon(){
  $$('#tabs .tab-btn').forEach(b=>{
    b.onclick = ()=>{
      currentTab = b.dataset.tab;
      selectedFood = null; dailySearch=''; foodsSearch='';
      render();
    };
  });
}

/* ---------- DIÁRIO TAB ---------- */
function renderDiarioTab(){
  const t = totalsForLog();
  const tg = state.targets;
  const remaining = round(tg.kcal - t.kcal);
  const activityKcal = totalActivityKcal();
  const realBalance = round((tg.kcal + activityKcal) - t.kcal);
  const pct = tg.kcal>0 ? Math.round((t.kcal/tg.kcal)*100) : 0;
  const barColor = pct<=100 ? 'var(--success-line)' : (pct<=115 ? 'var(--warn-line)' : 'var(--danger-line)');

  return `
    <div class="control-bar">
      <div class="date-nav">
        <button id="prevDay">‹</button>
        <div class="day-label" id="dayLabel">${fmtDateLabel(state.currentDate)}</div>
        <button id="nextDay">›</button>
        <button class="today-btn" id="todayBtn">Hoje</button>
      </div>
      <div class="search-wrap">
        <input type="text" id="dailySearchInput" placeholder="Buscar alimento para adicionar…" value="${dailySearch}" autocomplete="off">
        <div id="dailySuggestions"></div>
      </div>
    </div>

    ${renderQuickChips()}

    <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="pill-btn ${dailyFilter==='todos'?'active':''}" data-filter="todos">Todos</button>
      <button class="pill-btn ${dailyFilter==='proteina'?'active':''}" data-filter="proteina">Proteína</button>
      <button class="pill-btn ${dailyFilter==='carboidrato'?'active':''}" data-filter="carboidrato">Carboidrato</button>
      <button class="pill-btn ${dailyFilter==='gordura'?'active':''}" data-filter="gordura">Gordura</button>
    </div>

    ${selectedFood ? `
    <div class="confirm-add">
      <span class="name">${selectedFood.name}</span>
      <input type="number" id="confirmGrams" placeholder="g" min="1" value="${quickAddGrams||''}" autofocus>
      <button class="primary" id="confirmAddBtn">Adicionar</button>
      <button class="ghost" id="cancelAddBtn">Cancelar</button>
    </div>` : ''}

    <div class="summary-card">
      <div class="summary-top"><span class="big">${round(t.kcal)}</span><span class="of">de ${tg.kcal} kcal</span></div>
      <div class="summary-sub">
        <span class="${remaining>=0?'pos':'neg'}">${remaining>=0? round(remaining)+' kcal restantes' : round(Math.abs(remaining))+' kcal acima da meta'}</span>
        ${activityKcal>0 ? ` · atividades hoje: -${round(activityKcal)} kcal · saldo real: <span class="${realBalance>=0?'pos':'neg'}">${realBalance>=0? round(realBalance)+' restantes' : round(Math.abs(realBalance))+' acima'}</span>` : ''}
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${Math.min(pct,100)}%;background:${barColor};"></div></div>

      ${macroBlock('Proteína protein', t.protein, tg.protein, 'var(--protein-text)')}
      ${macroBlock('Carboidrato carb', t.carb, tg.carb, 'var(--carb-text)')}
      ${macroBlock('Gordura fat', t.fat, tg.fat, 'var(--fat-text)')}
    </div>

    <div class="card">
      <h2>Registro do dia <span style="font-weight:400;color:var(--text-muted);">${state.log.length} item(ns)</span></h2>
      <div id="logList">${renderLogListHtml()}</div>
    </div>
  `;
}

function renderQuickChips(){
  const chips = state.recentFoods
    .map(r=>({r, food: state.foods.find(f=>f.id===r.foodId)}))
    .filter(x=>x.food)
    .slice(0, 6);
  if(chips.length===0) return '';
  return `
    <div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">Adicionar rápido</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${chips.map(({r,food})=>`<button type="button" class="pill-btn quick-chip" data-quickfid="${food.id}" data-quickgrams="${r.lastGrams}">${food.name} <span style="opacity:0.55;">· ${r.lastGrams}g</span></button>`).join('')}
      </div>
    </div>
  `;
}

function macroBlock(labelPair, value, target, color){
  const [label] = labelPair.split(' ');
  const pct = target>0 ? Math.round((value/target)*100) : 0;
  return `
    <div class="macro-block">
      <div class="macro-line"><span><b>${label}</b> — ${round(value)}g / ${target}g</span><span style="color:${color};font-weight:700;">${pct}%</span></div>
      <div class="progress-track" style="height:5px;"><div class="progress-fill" style="width:${Math.min(pct,100)}%;background:${color};height:5px;"></div></div>
    </div>
  `;
}

function renderLogListHtml(){
  if(isLoadingDay) return `<div class="empty-msg">Carregando…</div>`;
  if(state.log.length===0) return `<div class="empty-msg">Nenhum item registrado neste dia ainda. Use a busca acima pra adicionar.</div>`;
  return state.log.map(e=>{
    const cat = classifyFoodFromEntry(e);
    return `
    <div class="log-row">
      <div class="check">✓</div>
      <div class="name-col">
        <input type="text" class="name-input" data-id="${e.id}" data-field="name" value="${e.name}">
        <div class="qty-row">
          <input type="number" class="qty-input" data-id="${e.id}" data-field="grams" value="${e.grams}" min="1"><span class="qty-unit">g</span>
          <input type="number" class="macro-input" data-id="${e.id}" data-field="kcal" value="${round(e.kcal)}"><span class="qty-unit">kcal</span>
          <input type="number" class="macro-input" data-id="${e.id}" data-field="protein" value="${round(e.protein)}"><span class="qty-unit">P</span>
          <input type="number" class="macro-input" data-id="${e.id}" data-field="carb" value="${round(e.carb)}"><span class="qty-unit">C</span>
          <input type="number" class="macro-input" data-id="${e.id}" data-field="fat" value="${round(e.fat)}"><span class="qty-unit">G</span>
        </div>
      </div>
      <div class="tags">${tagHtml(cat)}</div>
      <button class="del" data-delid="${e.id}" title="Remover">✕</button>
    </div>`;
  }).join('');
}
function classifyFoodFromEntry(e){
  return classifyFood({protein:e.protein, carb:e.carb, fat:e.fat});
}

function matchFoods(query, filter, limit){
  const q = query.trim().toLowerCase();
  let list = state.foods;
  if(filter!=='todos') list = list.filter(f=>classifyFood(f)===filter);
  if(q) list = list.filter(f=>f.name.toLowerCase().includes(q));
  return list.slice(0, limit||8);
}

function renderSuggestions(){
  const box = $('#dailySuggestions');
  if(!box) return;
  if(!dailySearch.trim()){ box.innerHTML=''; box.style.display='none'; return; }
  const matches = matchFoods(dailySearch, dailyFilter, 8);
  box.style.display = 'block';
  box.className = 'suggestions';
  if(matches.length===0){
    box.innerHTML = `<div class="suggestion-empty">Nenhum alimento encontrado. Cadastre em "Alimentos".</div>`;
    return;
  }
  box.innerHTML = matches.map(f=>`
    <div class="suggestion-row" data-fid="${f.id}">
      <span>${f.name}</span>
      <span class="meta">${f.kcal} kcal/100g</span>
    </div>
  `).join('');
  $$('.suggestion-row', box).forEach(row=>{
    row.onclick = ()=>{
      selectedFood = state.foods.find(f=>f.id===row.dataset.fid);
      quickAddGrams = null;
      dailySearch = '';
      render();
      setTimeout(()=>{ const g = $('#confirmGrams'); if(g) g.focus(); }, 0);
    };
  });
}

function wireDiario(){
  $('#prevDay').onclick = ()=>{ changeDay(-1); };
  $('#nextDay').onclick = ()=>{ changeDay(1); };
  $('#todayBtn').onclick = ()=>{ goToDate(todayStr()); };

  const searchInput = $('#dailySearchInput');
  searchInput.oninput = ()=>{ dailySearch = searchInput.value; renderSuggestions(); };
  searchInput.onfocus = ()=>{ renderSuggestions(); };
  document.addEventListener('click', (ev)=>{
    const box = $('#dailySuggestions');
    if(box && !ev.target.closest('.search-wrap')) { box.style.display='none'; }
  }, {once:true});

  $$('.pill-btn[data-filter]').forEach(btn=>{
    btn.onclick = ()=>{ dailyFilter = btn.dataset.filter; renderSuggestions(); render(); };
  });

  $$('.quick-chip').forEach(btn=>{
    btn.onclick = ()=>{
      selectedFood = state.foods.find(f=>f.id===btn.dataset.quickfid);
      quickAddGrams = btn.dataset.quickgrams;
      dailySearch = '';
      render();
      setTimeout(()=>{ const g = $('#confirmGrams'); if(g){ g.focus(); g.select(); } }, 0);
    };
  });

  if(selectedFood){
    $('#confirmAddBtn').onclick = async ()=>{
      const grams = parseFloat($('#confirmGrams').value);
      if(!grams || grams<=0) return;
      const scale = grams/100;
      const payload = {
        user_id: USER_ID, log_date: state.currentDate, food_id: selectedFood.id, name: selectedFood.name, grams,
        kcal: selectedFood.kcal*scale, protein: selectedFood.protein*scale,
        carb: selectedFood.carb*scale, fat: selectedFood.fat*scale
      };
      const { data, error } = await sb.from('daily_logs').insert(payload).select().single();
      if(error){ console.error(error); return; }
      state.log.push(mapLogRow(data));
      registerFoodUsage(selectedFood.id, grams);
      selectedFood = null;
      quickAddGrams = null;
      render();
    };
    $('#cancelAddBtn').onclick = ()=>{ selectedFood = null; quickAddGrams = null; render(); };
    const gramsInput = $('#confirmGrams');
    if(gramsInput) gramsInput.onkeydown = (ev)=>{ if(ev.key==='Enter') $('#confirmAddBtn').click(); };
  }

  wireLogRows();
}

// Edição direta em qualquer campo da linha — sem modo expandido.
// Trocar "gramas" reescala kcal/proteína/carbo/gordura proporcionalmente (mantém a razão por grama).
// Editar kcal/proteína/carbo/gordura diretamente sobrescreve só aquele valor (ajuste manual pontual).
function wireLogRows(){
  $$('#logList .name-input').forEach(inp=>{
    inp.onchange = async ()=>{
      const entry = state.log.find(e=>e.id===inp.dataset.id);
      if(!entry) return;
      const name = inp.value.trim();
      if(!name) { inp.value = entry.name; return; }
      entry.name = name;
      await sb.from('daily_logs').update({name}).eq('id', entry.id);
    };
  });

  $$('#logList .qty-input').forEach(inp=>{
    inp.onchange = async ()=>{
      const entry = state.log.find(e=>e.id===inp.dataset.id);
      const newGrams = parseFloat(inp.value);
      if(!entry || !newGrams || newGrams<=0) return;
      const rate = {kcal:entry.kcal/entry.grams, protein:entry.protein/entry.grams, carb:entry.carb/entry.grams, fat:entry.fat/entry.grams};
      entry.grams = newGrams;
      entry.kcal = rate.kcal*newGrams; entry.protein = rate.protein*newGrams;
      entry.carb = rate.carb*newGrams; entry.fat = rate.fat*newGrams;
      await sb.from('daily_logs').update({grams:entry.grams, kcal:entry.kcal, protein:entry.protein, carb:entry.carb, fat:entry.fat}).eq('id', entry.id);
      render();
    };
  });

  $$('#logList .macro-input').forEach(inp=>{
    inp.onchange = async ()=>{
      const entry = state.log.find(e=>e.id===inp.dataset.id);
      const val = parseFloat(inp.value);
      if(!entry || isNaN(val) || val<0) return;
      entry[inp.dataset.field] = val;
      await sb.from('daily_logs').update({[inp.dataset.field]: val}).eq('id', entry.id);
      render();
    };
  });

  $$('#logList .del').forEach(btn=>{
    btn.onclick = ()=>{ removeLogEntry(btn.dataset.delid); };
  });
}

let loadSeq = 0;
let isLoadingDay = false;

// Ponto único de navegação de data — evita condição de corrida quando o usuário troca de dia
// rapidamente: cada chamada recebe um número de sequência, e só a mais recente é aplicada ao
// estado/renderização quando a resposta do storage chega, mesmo que uma requisição mais antiga
// demore mais para responder e resolva depois.
async function goToDate(newDate){
  const mySeq = ++loadSeq;
  state.currentDate = newDate;
  isLoadingDay = true;
  render(); // feedback imediato: data já muda na tela enquanto os dados carregam

  const [log, activities] = await Promise.all([fetchLogForDate(newDate), fetchActivitiesForDate(newDate)]);

  if(mySeq !== loadSeq) return; // uma navegação mais nova já foi disparada — descarta esta resposta
  state.log = log;
  state.activities = activities;
  isLoadingDay = false;
  render();
}
function changeDay(delta){
  const d = new Date(state.currentDate+'T00:00:00');
  d.setDate(d.getDate()+delta);
  goToDate(d.toISOString().slice(0,10));
}

/* ---------- ALIMENTOS TAB ---------- */
function renderAlimentosTab(){
  return `
    <div class="card">
      <h2>Buscar alimentos cadastrados <span style="font-weight:400;color:var(--text-muted);">${state.foods.length} no total</span></h2>
      <input type="text" id="foodsSearchInput" placeholder="Filtrar por nome…" value="${foodsSearch}">
      <div class="foods-list" id="foodsListBox" style="margin-top:14px;">${renderFoodsListHtml()}</div>
    </div>

    <div class="card">
      <h2>Base de alimentos padrão</h2>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:0;">
        A base padrão do app é atualizada de tempos em tempos com mais alimentos. Clique abaixo pra trazer os que ainda faltam na sua lista — os que você já tem (inclusive os que você editou) não são alterados.
      </p>
      <button class="secondary" id="syncDefaultsBtn">Sincronizar alimentos padrão</button>
      <div class="msg" id="syncMsg"></div>
    </div>

    <div class="card">
      <h2>Novo alimento <span class="toggle" id="toggleNewFood">mostrar ▾</span></h2>
      <div id="newFoodForm" style="display:none;">
        <label for="nfName">Nome do alimento</label>
        <input type="text" id="nfName" placeholder="ex: Iogurte natural">
        <div class="row4">
          <div><label>Kcal /100g</label><input type="number" id="nfKcal"></div>
          <div><label>Proteína /100g</label><input type="number" id="nfProtein"></div>
          <div><label>Carbo /100g</label><input type="number" id="nfCarb"></div>
          <div><label>Gordura /100g</label><input type="number" id="nfFat"></div>
        </div>
        <button class="primary" id="saveNewFoodBtn" style="margin-top:14px;">Salvar alimento</button>
        <div class="msg" id="nfMsg"></div>
      </div>
    </div>

    <div class="card">
      <h2>Importar lista de alimentos <span class="toggle" id="toggleImport">mostrar ▾</span></h2>
      <div id="importForm" style="display:none;">
        <p style="font-size:12px;color:var(--text-muted);line-height:1.5;margin-top:0;">
          Um alimento por linha: <code>Nome | kcal/100g | proteína/100g | carboidrato/100g | gordura/100g</code>. Alimentos já cadastrados com o mesmo nome são ignorados.
        </p>
        <textarea id="importArea" rows="6" style="width:100%;padding:10px;border-radius:7px;border:1px solid var(--border);background:#FCFCFD;color:var(--text);font-size:12.5px;font-family:monospace;line-height:1.5;" placeholder="Nome do alimento | 120 | 5 | 20 | 3"></textarea>
        <button class="primary" id="importBtn" style="margin-top:10px;">Importar alimentos</button>
        <div class="msg" id="importMsg"></div>
      </div>
    </div>
  `;
}

function renderFoodsListHtml(){
  const q = foodsSearch.trim().toLowerCase();
  const list = q ? state.foods.filter(f=>f.name.toLowerCase().includes(q)) : state.foods;
  if(list.length===0) return `<div class="empty-msg">Nenhum alimento encontrado.</div>`;
  return list.map(f=>{
    const cat = classifyFood(f);
    return `
    <div class="food-row">
      <div>
        <div class="n">${f.name} ${tagHtml(cat)}</div>
        <div class="m">${f.kcal} kcal · P${f.protein} C${f.carb} G${f.fat} (por 100g)</div>
      </div>
      <button class="del" data-fid="${f.id}" title="Excluir alimento">✕</button>
    </div>`;
  }).join('');
}

function wireAlimentos(){
  const searchInput = $('#foodsSearchInput');
  searchInput.oninput = ()=>{ foodsSearch = searchInput.value; $('#foodsListBox').innerHTML = renderFoodsListHtml(); wireFoodDelete(); };
  wireFoodDelete();

  $('#syncDefaultsBtn').onclick = async ()=>{
    const existing = new Set(state.foods.map(f=>f.name.toLowerCase()));
    const missing = DEFAULT_FOODS.filter(f=>!existing.has(f.name.toLowerCase()));
    const msg = $('#syncMsg');
    if(missing.length===0){
      msg.textContent = 'Sua base já tem todos os alimentos padrão atuais.';
      msg.className = 'msg';
      return;
    }
    const rows = missing.map(f=>({user_id:USER_ID, name:f.name, kcal:f.kcal, protein:f.protein, carb:f.carb, fat:f.fat}));
    const { data, error } = await sb.from('foods').insert(rows).select();
    if(error){ msg.textContent='Erro ao sincronizar. Tente de novo.'; msg.className='msg err'; return; }
    state.foods.push(...(data||[]).map(mapFoodRow));
    render();
    showToast(`${missing.length} alimento(s) novo(s) adicionado(s) à sua base.`);
  };

  $('#toggleNewFood').onclick = ()=>{
    const f = $('#newFoodForm');
    const open = f.style.display!=='none';
    f.style.display = open ? 'none':'block';
    $('#toggleNewFood').textContent = open ? 'mostrar ▾':'ocultar ▴';
  };
  $('#saveNewFoodBtn').onclick = async ()=>{
    const name = $('#nfName').value.trim();
    const kcal = parseFloat($('#nfKcal').value);
    const protein = parseFloat($('#nfProtein').value)||0;
    const carb = parseFloat($('#nfCarb').value)||0;
    const fat = parseFloat($('#nfFat').value)||0;
    const msg = $('#nfMsg');
    if(!name || isNaN(kcal)){ msg.textContent='Preencha ao menos o nome e as calorias por 100g.'; msg.className='msg err'; return; }
    const { data, error } = await sb.from('foods').insert({user_id:USER_ID, name, kcal, protein, carb, fat}).select().single();
    if(error){ msg.textContent='Erro ao salvar. Tente de novo.'; msg.className='msg err'; return; }
    state.foods.push(mapFoodRow(data));
    msg.textContent='Alimento cadastrado!'; msg.className='msg';
    render();
    $('#newFoodForm').style.display='block';
    $('#toggleNewFood').textContent='ocultar ▴';
  };

  $('#toggleImport').onclick = ()=>{
    const f = $('#importForm');
    const open = f.style.display!=='none';
    f.style.display = open ? 'none':'block';
    $('#toggleImport').textContent = open ? 'mostrar ▾':'ocultar ▴';
  };
  $('#importBtn').onclick = async ()=>{
    const raw = $('#importArea').value;
    const lines = raw.split('\n').map(l=>l.trim()).filter(Boolean);
    const msg = $('#importMsg');
    const existing = new Set(state.foods.map(f=>f.name.toLowerCase()));
    const toInsert = [];
    let skipped=0, invalid=0;
    for(const line of lines){
      const parts = line.split('|').map(p=>p.trim());
      if(parts.length<5){ invalid++; continue; }
      const [name, k,p,c,g] = parts;
      const nums = [k,p,c,g].map(v=>parseFloat(v.replace(',','.')));
      if(!name || nums.some(n=>isNaN(n))){ invalid++; continue; }
      if(existing.has(name.toLowerCase())){ skipped++; continue; }
      toInsert.push({user_id:USER_ID, name, kcal:nums[0], protein:nums[1], carb:nums[2], fat:nums[3]});
      existing.add(name.toLowerCase());
    }
    let added = 0;
    if(toInsert.length>0){
      const { data, error } = await sb.from('foods').insert(toInsert).select();
      if(!error){ state.foods.push(...(data||[]).map(mapFoodRow)); added = data.length; }
    }
    msg.textContent = `${added} importado(s). ${skipped} já existiam. ${invalid} linha(s) inválida(s).`;
    msg.className = added>0 ? 'msg' : 'msg err';
    render();
    $('#importForm').style.display='block';
    $('#toggleImport').textContent='ocultar ▴';
  };
}
function wireFoodDelete(){
  $$('#foodsListBox .del').forEach(btn=>{
    btn.onclick = async ()=>{
      const id = btn.dataset.fid;
      state.foods = state.foods.filter(f=>f.id!==id);
      render();
      await sb.from('foods').delete().eq('id', id);
    };
  });
}

/* ---------- ATIVIDADES TAB ---------- */
function renderAtividadesTab(){
  return `
    <div class="card">
      <h2>Registrar atividade de hoje</h2>
      <label for="routineSelect">Rotina</label>
      <select id="routineSelect">${state.routines.map(r=>`<option value="${r.id}">${r.name}</option>`).join('')}</select>
      <label>Intensidade</label>
      <div class="intensity-row" id="intensityRow">
        ${['leve','moderada','intensa'].map(k=>`<button type="button" class="pill-btn intensity-btn" data-intensity="${k}">${INTENSITY_LABELS[k]}</button>`).join('')}
      </div>
      <div class="row2">
        <div><label for="durationInput">Duração (min)</label><input type="number" id="durationInput" min="1"></div>
        <div><label>&nbsp;</label><button class="primary" id="addActivityBtn" style="margin-top:0;width:100%;">Adicionar</button></div>
      </div>
      <div class="msg" id="addActMsg"></div>
    </div>

    <div class="card">
      <h2>Atividades de hoje <span style="font-weight:400;color:var(--text-muted);">-${round(totalActivityKcal())} kcal</span></h2>
      <div id="activitiesList">${renderActivitiesListHtml()}</div>
    </div>

    <div class="card">
      <h2>Minhas rotinas <span class="toggle" id="toggleRoutines">editar ▾</span></h2>
      <div id="routinesForm" style="display:none;">
        <div style="font-size:12.5px;color:var(--text-muted);background:#F9FAFB;border-radius:6px;padding:10px 12px;">
          Peso usado no cálculo: <b>${state.bodyweight} kg</b> — ajuste na aba <b>Perfil</b>.
        </div>
        <div style="margin-top:16px;" id="routinesListBox">${renderRoutinesListHtml()}</div>
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border);">
          <label>Nova rotina</label>
          <input type="text" id="rtName" placeholder="Nome (ex: Treino F — Panturrilha)">
          <div class="row2">
            <div><label>Duração padrão (min)</label><input type="number" id="rtDuration" placeholder="ex: 50"></div>
            <div><label>Intensidade padrão</label>
              <select id="rtIntensity"><option value="leve">Leve</option><option value="moderada" selected>Moderada</option><option value="intensa">Intensa</option></select>
            </div>
          </div>
          <button class="primary" id="saveRoutineBtn" style="margin-top:10px;">Adicionar rotina</button>
          <div class="msg" id="rtMsg"></div>
        </div>
      </div>
    </div>
  `;
}
function renderActivitiesListHtml(){
  if(state.activities.length===0) return `<div class="empty-msg">Nenhuma atividade registrada neste dia ainda.</div>`;
  return state.activities.map(a=>`
    <div class="log-row">
      <div class="check">✓</div>
      <div class="name-col"><div class="name">${a.name}</div><div class="qty-row"><span class="qty-unit">${a.duration} min · ${INTENSITY_LABELS[a.intensity]||''}</span></div></div>
      <div class="kcal">-${round(a.kcal)} kcal</div>
      <button class="del" data-actid="${a.id}" title="Remover">✕</button>
    </div>
  `).join('');
}
function renderRoutinesListHtml(){
  return state.routines.map(r=>`
    <div class="food-row">
      <div><div class="n">${r.name}</div><div class="m">padrão ${r.duration} min · ${INTENSITY_LABELS[r.intensity]||'Moderada'}</div></div>
      <button class="del" data-rid="${r.id}" title="Excluir rotina">✕</button>
    </div>
  `).join('');
}
function wireAtividades(){
  let selectedIntensity = null;
  const routineSelect = $('#routineSelect');
  const applyRoutineDefaults = ()=>{
    const r = state.routines.find(x=>x.id===routineSelect.value);
    if(!r) return;
    $('#durationInput').value = r.duration;
    selectedIntensity = r.intensity;
    $$('.intensity-btn').forEach(b=>b.classList.toggle('active', b.dataset.intensity===selectedIntensity));
  };
  routineSelect.onchange = applyRoutineDefaults;
  applyRoutineDefaults();

  $$('.intensity-btn').forEach(btn=>{
    btn.onclick = ()=>{
      selectedIntensity = btn.dataset.intensity;
      $$('.intensity-btn').forEach(b=>b.classList.toggle('active', b===btn));
    };
  });

  $('#addActivityBtn').onclick = async ()=>{
    const routine = state.routines.find(r=>r.id===routineSelect.value);
    const duration = parseFloat($('#durationInput').value);
    const msg = $('#addActMsg');
    if(!routine || !duration || duration<=0 || !selectedIntensity){
      msg.textContent = 'Escolha a rotina, intensidade e duração.'; msg.className='msg err'; return;
    }
    const met = INTENSITY_MET[selectedIntensity];
    const kcal = met * state.bodyweight * (duration/60);
    const payload = {user_id:USER_ID, activity_date:state.currentDate, routine_id:routine.id, name:routine.name, intensity:selectedIntensity, duration, kcal};
    const { data, error } = await sb.from('activities').insert(payload).select().single();
    if(error){ msg.textContent='Erro ao registrar. Tente de novo.'; msg.className='msg err'; return; }
    state.activities.push(mapActivityRow(data));
    msg.textContent = 'Atividade adicionada!'; msg.className='msg';
    render();
  };

  $$('#activitiesList .del').forEach(btn=>{ btn.onclick = ()=>{ removeActivity(btn.dataset.actid); }; });

  $('#toggleRoutines').onclick = ()=>{
    const f = $('#routinesForm');
    const open = f.style.display!=='none';
    f.style.display = open?'none':'block';
    $('#toggleRoutines').textContent = open?'editar ▾':'ocultar ▴';
  };
  $$('#routinesListBox .del').forEach(btn=>{
    btn.onclick = async ()=>{
      const id = btn.dataset.rid;
      state.routines = state.routines.filter(r=>r.id!==id);
      render();
      $('#routinesForm').style.display='block';
      $('#toggleRoutines').textContent='ocultar ▴';
      await sb.from('routines').delete().eq('id', id);
    };
  });
  $('#saveRoutineBtn').onclick = async ()=>{
    const name = $('#rtName').value.trim();
    const duration = parseFloat($('#rtDuration').value);
    const intensity = $('#rtIntensity').value;
    const msg = $('#rtMsg');
    if(!name || isNaN(duration)){ msg.textContent='Preencha nome e duração padrão.'; msg.className='msg err'; return; }
    const { data, error } = await sb.from('routines').insert({user_id:USER_ID, name, duration, intensity}).select().single();
    if(error){ msg.textContent='Erro ao salvar. Tente de novo.'; msg.className='msg err'; return; }
    state.routines.push(mapRoutineRow(data));
    msg.textContent='Rotina adicionada!'; msg.className='msg';
    render();
    $('#routinesForm').style.display='block';
    $('#toggleRoutines').textContent='ocultar ▴';
  };
}

/* ---------- RESUMO MENSAL TAB ---------- */
function renderMensalTab(){
  return `
    <div class="card">
      <h2>Resumo mensal</h2>
      <div class="row2">
        <div><label for="monthInput">Mês</label><input type="month" id="monthInput" value="${todayStr().slice(0,7)}"></div>
        <div><label>&nbsp;</label><button class="primary" id="genMonthlyBtn" style="margin-top:0;width:100%;">Gerar resumo</button></div>
      </div>
      <div class="msg" id="monthlyMsg"></div>
      <div id="monthlyResult" style="margin-top:16px;"></div>
    </div>
  `;
}
function daysInMonth(monthStr){ const [y,m]=monthStr.split('-').map(Number); return new Date(y,m,0).getDate(); }
async function generateMonthlySummary(monthStr){
  const total = daysInMonth(monthStr);
  const monthStart = `${monthStr}-01`;
  const monthEnd = `${monthStr}-${String(total).padStart(2,'0')}`;
  const { data, error } = await sb.from('daily_logs').select('*')
    .eq('user_id', USER_ID).gte('log_date', monthStart).lte('log_date', monthEnd);
  const entriesByDate = {};
  if(!error){
    (data||[]).forEach(r=>{
      (entriesByDate[r.log_date] = entriesByDate[r.log_date] || []).push(r);
    });
  }
  const days = [];
  for(let d=1; d<=total; d++){
    const dateStr = `${monthStr}-${String(d).padStart(2,'0')}`;
    const entries = entriesByDate[dateStr] || [];
    const t = entries.reduce((a,e)=>{a.kcal+=e.kcal;a.protein+=e.protein;a.carb+=e.carb;a.fat+=e.fat;return a;},{kcal:0,protein:0,carb:0,fat:0});
    days.push({day:d, dateStr, logged: entries.length>0, ...t});
  }
  return days;
}
function renderMonthlyChart(days, targetKcal){
  const maxKcal = Math.max(targetKcal, ...days.map(d=>d.kcal), 100);
  const w=900,h=260,padL=44,padB=30,padT=10;
  const chartW=w-padL-10, chartH=h-padB-padT;
  const barW = chartW/days.length;
  const scaleY = v => chartH - (v/maxKcal)*chartH;
  const bars = days.map((d,i)=>{
    const x=padL+i*barW+barW*0.15, bw=barW*0.7;
    const barH=chartH-scaleY(d.kcal), y=padT+scaleY(d.kcal);
    const color = !d.logged ? '#E5E7EB' : (d.kcal<=targetKcal ? 'var(--success-line)' : 'var(--danger-line)');
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(barH,0).toFixed(1)}" fill="${color}" rx="2"><title>Dia ${d.day}: ${round(d.kcal)} kcal</title></rect>`;
  }).join('');
  const targetY = padT+scaleY(targetKcal);
  const targetLine = `<line x1="${padL}" y1="${targetY.toFixed(1)}" x2="${w-10}" y2="${targetY.toFixed(1)}" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="${w-10}" y="${(targetY-4).toFixed(1)}" fill="#B45309" font-size="10" text-anchor="end">meta ${targetKcal} kcal</text>`;
  const xLabels = days.filter((d,i)=>i%3===0||i===days.length-1).map(d=>{
    const i=d.day-1, x=padL+i*barW+barW/2;
    return `<text x="${x.toFixed(1)}" y="${h-8}" fill="#9CA3AF" font-size="9" text-anchor="middle">${d.day}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block;">
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${h-padB}" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="${padL}" y1="${h-padB}" x2="${w-10}" y2="${h-padB}" stroke="#E5E7EB" stroke-width="1"/>
    ${bars}${targetLine}${xLabels}
  </svg>`;
}
function wireMensal(){
  $('#genMonthlyBtn').onclick = async ()=>{
    const monthStr = $('#monthInput').value;
    const msg = $('#monthlyMsg'); const resultBox = $('#monthlyResult');
    if(!monthStr){ msg.textContent='Escolha um mês.'; msg.className='msg err'; return; }
    msg.textContent='Gerando resumo…'; msg.className='msg'; resultBox.innerHTML='';
    const days = await generateMonthlySummary(monthStr);
    const logged = days.filter(d=>d.logged);
    if(logged.length===0){ msg.textContent='Nenhum dia registrado nesse mês ainda.'; msg.className='msg err'; return; }
    const avgKcal = logged.reduce((s,d)=>s+d.kcal,0)/logged.length;
    const avgProtein = logged.reduce((s,d)=>s+d.protein,0)/logged.length;
    const avgCarb = logged.reduce((s,d)=>s+d.carb,0)/logged.length;
    const avgFat = logged.reduce((s,d)=>s+d.fat,0)/logged.length;
    const over = logged.filter(d=>d.kcal>state.targets.kcal).length;
    const under = logged.length-over;
    msg.textContent='';
    resultBox.innerHTML = `
      ${renderMonthlyChart(days, state.targets.kcal)}
      <div class="row4" style="margin-top:16px;">
        <div class="stat-box"><div class="label">Registrados</div><div class="value">${logged.length}/${days.length}</div></div>
        <div class="stat-box"><div class="label">Média kcal/dia</div><div class="value">${round(avgKcal)}</div></div>
        <div class="stat-box"><div class="label">Dias na meta</div><div class="value" style="color:var(--success-text);">${under}</div></div>
        <div class="stat-box"><div class="label">Dias acima</div><div class="value" style="color:var(--danger-text);">${over}</div></div>
      </div>
      <div class="row2" style="margin-top:12px;">
        <div class="stat-box"><div class="label">Proteína média</div><div class="value">${round(avgProtein)}g</div></div>
        <div class="stat-box"><div class="label">Carbo / Gordura média</div><div class="value" style="font-size:16px;">${round(avgCarb)}g / ${round(avgFat)}g</div></div>
      </div>
    `;
  };
}


/* ---------- PERFIL TAB ---------- */
function renderPerfilTab(){
  const ps = state.profileStats;
  const tg = state.targets;
  return `
    <div class="card">
      <h2>Seu nome</h2>
      <label for="profileNameInput">Como quer ser chamado na saudação</label>
      <input type="text" id="profileNameInput" value="${state.profileName}" placeholder="ex: Diego">
      <button class="secondary" id="saveNameBtn" style="margin-top:10px;">Salvar nome</button>
      <div class="msg" id="nameMsg"></div>
    </div>

    <div class="card">
      <h2>Calculadora de meta calórica</h2>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:0;">
        Estimativa via Mifflin-St Jeor. Não substitui orientação de nutricionista — é um ponto de partida pra ajustar com base na resposta do seu corpo nas próximas semanas.
      </p>
      <div class="row4">
        <div><label>Peso (kg)</label><input type="number" id="calcWeight" value="${state.bodyweight}"></div>
        <div><label>Altura (cm)</label><input type="number" id="calcHeight" value="${ps.height}"></div>
        <div><label>Idade</label><input type="number" id="calcAge" value="${ps.age}"></div>
        <div><label>Sexo</label>
          <select id="calcSex"><option value="m" ${ps.sex==='m'?'selected':''}>Masculino</option><option value="f" ${ps.sex==='f'?'selected':''}>Feminino</option></select>
        </div>
      </div>
      <div class="row2">
        <div>
          <label>Nível de atividade</label>
          <select id="calcActivity">
            <option value="1.2" ${ps.activity==1.2?'selected':''}>Sedentário</option>
            <option value="1.375" ${ps.activity==1.375?'selected':''}>Leve (1-3x/sem)</option>
            <option value="1.55" ${ps.activity==1.55?'selected':''}>Moderado (5x/sem)</option>
            <option value="1.725" ${ps.activity==1.725?'selected':''}>Intenso (6-7x/sem)</option>
          </select>
        </div>
        <div>
          <label>Objetivo</label>
          <select id="calcGoal">
            <option value="-500" ${ps.goal==-500?'selected':''}>Déficit (perder peso)</option>
            <option value="0" ${ps.goal==0?'selected':''}>Manutenção</option>
            <option value="300" ${ps.goal==300?'selected':''}>Superávit (ganhar peso)</option>
          </select>
        </div>
      </div>
      <button class="primary" id="applyCalcBtn" style="margin-top:14px;">Calcular e aplicar como minha meta</button>
      <div class="msg" id="calcMsg"></div>
    </div>

    <div class="card">
      <h2>Metas diárias (ajuste manual)</h2>
      <div class="row4">
        <div><label>Calorias</label><input type="number" id="tgKcal" value="${tg.kcal}"></div>
        <div><label>Proteína (g)</label><input type="number" id="tgProtein" value="${tg.protein}"></div>
        <div><label>Carbo (g)</label><input type="number" id="tgCarb" value="${tg.carb}"></div>
        <div><label>Gordura (g)</label><input type="number" id="tgFat" value="${tg.fat}"></div>
      </div>
      <button class="primary" id="saveTargetsBtn" style="margin-top:14px;">Salvar metas</button>
      <div class="msg" id="tgMsg"></div>
    </div>

    <div class="card">
      <h2>Conta</h2>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:0;">Logado como ${authEmail || 'você'}.</p>
      <button class="secondary" id="logoutBtn">Sair da conta</button>
    </div>
  `;
}

function wirePerfil(){
  $('#logoutBtn').onclick = async ()=>{ await logout(); };

  $('#saveNameBtn').onclick = async ()=>{
    const name = $('#profileNameInput').value.trim();
    state.profileName = name;
    await saveProfileName();
    renderGreeting();
    showToast(name ? 'Nome atualizado!' : 'Saudação sem nome.');
  };

  $('#applyCalcBtn').onclick = async ()=>{
    const weight = parseFloat($('#calcWeight').value);
    const height = parseFloat($('#calcHeight').value);
    const age = parseFloat($('#calcAge').value);
    const sex = $('#calcSex').value;
    const activity = parseFloat($('#calcActivity').value);
    const goal = parseFloat($('#calcGoal').value);
    const msg = $('#calcMsg');
    if(!weight || !height || !age){
      msg.textContent = 'Preencha peso, altura e idade.'; msg.className = 'msg err'; return;
    }
    const bmr = 10*weight + 6.25*height - 5*age + (sex==='m' ? 5 : -161);
    const tdee = bmr * activity;
    const kcalTarget = Math.round(tdee + goal);
    const proteinTarget = Math.round(weight * 2);
    const fatTarget = Math.round(weight * 0.8);
    let carbTarget = Math.round((kcalTarget - (proteinTarget*4 + fatTarget*9)) / 4);
    if(carbTarget < 0) carbTarget = 0;

    state.bodyweight = weight;
    state.profileStats = {height, age, sex, activity, goal};
    state.targets = {kcal:kcalTarget, protein:proteinTarget, carb:carbTarget, fat:fatTarget};
    await Promise.all([saveBodyweight(), saveProfileStats(), saveTargets()]);
    render();
    showToast(`Meta aplicada: ${kcalTarget} kcal (TDEE ≈ ${Math.round(tdee)}) · P${proteinTarget}g C${carbTarget}g G${fatTarget}g`);
  };

  $('#saveTargetsBtn').onclick = async ()=>{
    const kcal = parseFloat($('#tgKcal').value);
    const protein = parseFloat($('#tgProtein').value);
    const carb = parseFloat($('#tgCarb').value);
    const fat = parseFloat($('#tgFat').value);
    const msg = $('#tgMsg');
    if([kcal,protein,carb,fat].some(v=>isNaN(v)||v<0)){
      msg.textContent = 'Preencha todos os campos com valores válidos.'; msg.className = 'msg err'; return;
    }
    state.targets = {kcal,protein,carb,fat};
    await saveTargets();
    showToast('Metas atualizadas!');
  };
}

// loadAll() agora é disparada automaticamente por onAuthStateChange() acima, após o login.
