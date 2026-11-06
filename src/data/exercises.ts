/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Exercise } from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  // --- PEITO ---
  {
    id: 'ex-peito-supino-reto',
    name: 'Supino Reto com Barra',
    category: 'Peito',
    secondaryMuscles: ['Tríceps', 'Ombros'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    instructions: [
      'Deite-se no banco reto com os olhos alinhados diretamente sob a barra.',
      'Segure a barra com uma pegada ligeiramente mais larga que a largura dos ombros.',
      'Abaixe a barra de forma controlada até encostar suavemente no terço médio do peitoral.',
      'Empurre a barra para cima com força explosiva controlada até quase a extensão total dos braços, sem travar os cotovelos.'
    ],
    tips: [
      'Mantenha as escápulas aduzidas e deprimidas ("travadas" para trás e para baixo) durante todo o movimento.',
      'Pés firmemente plantados no chão para gerar estabilidade e força.',
      'Mantenha uma leve curvatura natural da coluna lombar (arco fisiológico).'
    ],
    securityWarnings: [
      'Nunca faça o supino com a pegada suicida (sem o polegar envolvendo a barra).',
      'Use travas de segurança ou peça auxílio de um parceiro com cargas elevadas.'
    ],
    commonErrors: [
      'Bater a barra no peito usando o rebote.',
      'Projetar os ombros para frente no topo do movimento perdendo a retração escapular.',
      'Abrir excessivamente os cotovelos em 90 graus (o ângulo ideal é cerca de 60-75 graus com o tronco).'
    ],
    alternatives: ['Supino Reto com Halteres', 'Supino na Máquina Smith', 'Flexão de Braços'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 90
  },
  {
    id: 'ex-peito-supino-inclinado-halteres',
    name: 'Supino Inclinado com Halteres',
    category: 'Peito',
    secondaryMuscles: ['Ombros', 'Tríceps'],
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    instructions: [
      'Ajuste o banco em uma inclinação entre 30 e 45 graus.',
      'Sente-se com um haltere em cada joelho e, ao se reclinar, impulsione os halteres para a posição inicial acima do peito superior.',
      'Desça os halteres com amplitude completa até a altura do peitoral clavicular.',
      'Empurre os halteres para cima aproximando-os ligeiramente no topo sem bater os pesos.'
    ],
    tips: [
      'Maior ênfase no feixe clavicular (porção superior do peitoral).',
      'Permite uma amplitude de movimento maior e mais natural para as articulações dos ombros do que a barra.'
    ],
    securityWarnings: [
      'Não incline o banco acima de 45 graus para não transformar o exercício em um desenvolvimento de deltoides.'
    ],
    commonErrors: [
      'Descer os cotovelos excessivamente abertos.',
      'Perder o controle do movimento na fase excêntrica.'
    ],
    alternatives: ['Supino Inclinado com Barra', 'Crucifixo Inclinado com Halteres'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 75
  },
  {
    id: 'ex-peito-crossover-polia',
    name: 'Crossover na Polia Alta',
    category: 'Peito',
    secondaryMuscles: ['Ombros'],
    equipment: 'Polia/Cabo',
    difficulty: 'Iniciante',
    instructions: [
      'Posicione as roldanas na parte alta da estação de cabos.',
      'Dê um passo à frente com uma perna para estabilização, inclinando levemente o tronco.',
      'Com os cotovelos levemente flexionados, puxe as manoplas para baixo e para frente cruzando ou unindo as mãos na altura do umbigo.',
      'Retorne lentamente controlando a tensão contínua do cabo até sentir o alongamento peitoral.'
    ],
    tips: [
      'Concentre-se em "abraçar uma árvore" para manter os cotovelos em ângulo fixo.',
      'A tensão é constante durante toda a amplitude, excelente para pico de contração.'
    ],
    securityWarnings: [
      'Não dê trancos com a coluna para puxar a carga.'
    ],
    commonErrors: [
      'Transformar o exercício em um supino, dobrando e esticando os cotovelos.',
      'Deixar os ombros subirem em direção às orelhas.'
    ],
    alternatives: ['Peck Deck / Voador', 'Crucifixo com Halteres'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60
  },
  {
    id: 'ex-peito-peck-deck',
    name: 'Voador / Peck Deck Máquina',
    category: 'Peito',
    secondaryMuscles: ['Ombros'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    instructions: [
      'Ajuste o assento para que as manoplas fiquem na linha média do peitoral.',
      'Apoie as costas e cabeça completamente no encosto e retraia as escápulas.',
      'Junte as manoplas à frente do peito, segurando 1 segundo no pico de contração.',
      'Retorne devagar sem deixar os pesos tocarem o bloco de placas.'
    ],
    tips: [
      'Excelente exercício de isolamento seguro para esgotar o peitoral sem exigir estabilização de halteres livres.'
    ],
    securityWarnings: [
      'Não hiperestenda os braços para trás além da linha confortável do ombro na volta.'
    ],
    commonErrors: [
      'Descolar as costas do encosto para conseguir fechar os braços.'
    ],
    alternatives: ['Crossover na Polia', 'Crucifixo Reto com Halteres'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60
  },

  // --- COSTAS ---
  {
    id: 'ex-costas-puxada-alta',
    name: 'Puxada Alta pela Frente',
    category: 'Costas',
    secondaryMuscles: ['Bíceps', 'Ombros', 'Antebraço'],
    equipment: 'Polia/Cabo',
    difficulty: 'Iniciante',
    instructions: [
      'Ajuste o rolo de apoio para firmar bem as coxas.',
      'Segure a barra com pegada pronada (palmas para frente), mais larga que a largura dos ombros.',
      'Puxe a barra em direção à parte superior do peito, projetando o peitoral para fora e descendo os cotovelos.',
      'Suba de maneira controlada estendendo os braços e sentindo as dorsais alongarem.'
    ],
    tips: [
      'Pense em puxar com os cotovelos e não com as mãos, aliviando a fadiga precoce do bíceps.',
      'Inicie o movimento deprimindo as escápulas antes de flexionar os cotovelos.'
    ],
    securityWarnings: [
      'Evite a puxada atrás da nuca, pois gera rotação externa excessiva prejudicial aos ombros.'
    ],
    commonErrors: [
      'Inclinar excessivamente o tronco para trás transformando em remada.',
      'Balançar o corpo para usar inércia.'
    ],
    alternatives: ['Barra Fixa (Pull-Up)', 'Puxada com Triângulo'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 75
  },
  {
    id: 'ex-costas-remada-curvada-barra',
    name: 'Remada Curvada com Barra',
    category: 'Costas',
    secondaryMuscles: ['Bíceps', 'Antebraço', 'Ombros'],
    equipment: 'Barra',
    difficulty: 'Avançado',
    instructions: [
      'Fique em pé com os pés na largura dos ombros, segurando a barra com pegada pronada ou supinada.',
      'Flexione levemente os joelhos e incline o tronco para a frente a cerca de 45 graus, mantendo a coluna neutra e core contraído.',
      'Puxe a barra em direção ao abdômen inferior, aproximando as escápulas e levando os cotovelos para trás.',
      'Abaixe a barra lentamente até os braços ficarem totalmente estendidos.'
    ],
    tips: [
      'Mantenha o pescoço neutro olhando para um ponto no chão cerca de 1,5m à frente.',
      'Construção máxima de densidade e espessura das costas.'
    ],
    securityWarnings: [
      'Se sentir dor lombar, reduza a carga ou substitua por remada apoiada no banco ou cavalinho com apoio.'
    ],
    commonErrors: [
      'Arredondar a coluna lombar (perigo para discos intervertebrais).',
      'Ficar quase em pé usando impulso dos quadris para puxar.'
    ],
    alternatives: ['Remada Cavalinho T-Bar', 'Remada Unilateral com Haltere (Serrote)', 'Remada Baixa Polia'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSec: 90
  },
  {
    id: 'ex-costas-remada-baixa-triangulo',
    name: 'Remada Baixa com Triângulo',
    category: 'Costas',
    secondaryMuscles: ['Bíceps', 'Antebraço'],
    equipment: 'Polia/Cabo',
    difficulty: 'Iniciante',
    instructions: [
      'Sente-se no aparelho com os pés apoiados nas plataformas e joelhos levemente destravados.',
      'Segure o triângulo, mantenha as costas retas e o peito estufado.',
      'Puxe o acessório até o abdômen, apertando firmemente as costas.',
      'Estenda os braços controlando o peso, permitindo que as dorsais se alonguem sem curvar a lombar.'
    ],
    tips: [
      'Mantenha os ombros relaxados e longe dos ouvidos ao puxar.',
      'Foque na contração dos romboides e grande dorsal.'
    ],
    securityWarnings: [
      'Não jogue o tronco para frente e para trás excessivamente durante as repetições.'
    ],
    commonErrors: [
      'Arredondar a coluna ao estender os braços.',
      'Puxar na altura do pescoço em vez do abdômen.'
    ],
    alternatives: ['Remada Sentada na Máquina', 'Remada com Halteres'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60
  },
  {
    id: 'ex-costas-barra-fixa',
    name: 'Barra Fixa (Pull-Up)',
    category: 'Costas',
    secondaryMuscles: ['Bíceps', 'Antebraço', 'Abdômen'],
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    instructions: [
      'Segure a barra fixa com pegada pronada um pouco mais larga que os ombros.',
      'Inicie puxando as escápulas para baixo e erga o corpo até o queixo ultrapassar a linha da barra.',
      'Desça de maneira controlada até quase a extensão total dos braços.'
    ],
    tips: [
      'Cruze os pés e mantenha as pernas firmes e o abdômen contraído.',
      'Se não conseguir repetições completas, utilize um elástico de assistência ou a máquina graviton.'
    ],
    securityWarnings: [
      'Evite soltar o peso do corpo de forma brusca no final da descida para proteger os ombros.'
    ],
    commonErrors: [
      'Dar chutes ou usar impulsos ("kipping") em treinos de hipertrofia pura.'
    ],
    alternatives: ['Puxada Alta na Polia', 'Barra Fixa no Graviton'],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSec: 90
  },

  // --- PERNAS ---
  {
    id: 'ex-pernas-agachamento-livre',
    name: 'Agachamento Livre com Barra',
    category: 'Pernas',
    secondaryMuscles: ['Glúteos', 'Abdômen', 'Panturrilhas'],
    equipment: 'Barra',
    difficulty: 'Avançado',
    instructions: [
      'Posicione a barra sobre o trapézio (barra alta) ou deltoides posteriores (barra baixa).',
      'Pés afastados na largura dos ombros, pontas levemente apontadas para fora (15-30 graus).',
      'Inspire fundo travando o ar no diafragma (manobra de Valsalva) e inicie a descida flexionando quadris e joelhos simultaneamente.',
      'Desça até as coxas ficarem pelo menos paralelas ao chão.',
      'Suba empurrando o chão através de todo o pé até a posição inicial.'
    ],
    tips: [
      'Os joelhos devem acompanhar a mesma direção dos dedos dos pés ao longo de todo o percurso.',
      'Mantenha o peito aberto e a coluna alinhada.'
    ],
    securityWarnings: [
      'Sempre utilize o rack de agachamento com as travas de proteção ajustadas na altura correta.',
      'Nunca deixe os joelhos colapsarem para dentro (valgo dinâmico).'
    ],
    commonErrors: [
      'Tirar os calcanhares do chão ao descer.',
      'Arredondar a coluna lombar na base do movimento ("buttwink").'
    ],
    alternatives: ['Agachamento Hack', 'Leg Press 45º', 'Agachamento Goblet com Haltere'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSec: 120
  },
  {
    id: 'ex-pernas-leg-press-45',
    name: 'Leg Press 45º',
    category: 'Pernas',
    secondaryMuscles: ['Glúteos', 'Panturrilhas'],
    equipment: 'Máquina',
    difficulty: 'Intermediário',
    instructions: [
      'Acomode-se no aparelho com a lombar e glúteos colados no encosto.',
      'Posicione os pés na plataforma na largura dos ombros.',
      'Destrave a máquina e desça a plataforma de forma lenta até formar um ângulo de 90 graus nos joelhos sem descolar o quadril.',
      'Empurre a plataforma de volta através dos calcanhares, sem hiperestender ou travar os joelhos.'
    ],
    tips: [
      'Segure firme nas manoplas laterais para travar o quadril e a pelve no assento.'
    ],
    securityWarnings: [
      'NUNCA hiperestenda ou trave totalmente as articulações dos joelhos na subida (risco grave de lesão articular).'
    ],
    commonErrors: [
      'Deixar o quadril levantar do assento no ponto mais fundo da descida.',
      'Colocar as mãos sobre os joelhos para empurrar.'
    ],
    alternatives: ['Agachamento Hack', 'Agachamento Búlgaro'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 90
  },
  {
    id: 'ex-pernas-cadeira-extensora',
    name: 'Cadeira Extensora',
    category: 'Pernas',
    secondaryMuscles: [],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    instructions: [
      'Ajuste o encosto de modo que a articulação do joelho fique alinhada com o eixo de rotação da máquina.',
      'Ajuste o rolo acolchoado logo acima dos tornozelos.',
      'Estenda as pernas para cima contraindo vigorosamente os quadríceps.',
      'Segure 1 segundo no topo e retorne descendo em 2 a 3 segundos.'
    ],
    tips: [
      'Excelente exercício para isolamento e fortalecimento concentrado do quadríceps.'
    ],
    securityWarnings: [
      'Não realize chutes bruscos nem use peso excessivo que tire o quadril do banco.'
    ],
    commonErrors: [
      'Usar impulso para arremessar as pernas.',
      'Ajuste errado do eixo de rotação do joelho.'
    ],
    alternatives: ['Agachamento Sissy', 'Afundo com Halteres'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60
  },
  {
    id: 'ex-pernas-mesa-flexora',
    name: 'Mesa Flexora (Posteriores)',
    category: 'Pernas',
    secondaryMuscles: ['Glúteos', 'Panturrilhas'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    instructions: [
      'Deite-se de bruços na máquina com o apoio almofadado posicionado um pouco abaixo das panturrilhas, próximo ao tendão de Aquiles.',
      'Segure as manoplas do aparelho e mantenha o quadril pressionado contra a mesa.',
      'Puxe os calcanhares em direção aos glúteos contraindo os isquiotibiais.',
      'Estenda lentamente as pernas voltando à posição inicial.'
    ],
    tips: [
      'Mantenha a ponta dos pés em flexão dorsal (apontando para as canelas) para melhor ativação muscular.'
    ],
    securityWarnings: [
      'Evite levantar a pelve da mesa durante o esforço.'
    ],
    commonErrors: [
      'Jogar a carga de volta sem controle excêntrico.'
    ],
    alternatives: ['Cadeira Flexora', 'Stiff com Barra'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 60
  },
  {
    id: 'ex-pernas-stiff-barra',
    name: 'Stiff com Barra',
    category: 'Pernas',
    secondaryMuscles: ['Glúteos', 'Costas'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    instructions: [
      'Fique em pé com os pés na largura do quadril, segurando a barra na frente das coxas.',
      'Mantenha os joelhos semiflexionados porém fixos nesse ângulo durante todo o exercício.',
      'Empurre o quadril para trás enquanto desce a barra colada nas pernas até sentir os posteriores alongarem.',
      'Retorne contraindo os glúteos e posteriores para trazer o quadril à frente.'
    ],
    tips: [
      'O movimento é uma dobradiça de quadril (hip hinge), não um agachamento.',
      'A barra deve descer rente à canela.'
    ],
    securityWarnings: [
      'A coluna vertebral deve permanecer totalmente neutra; pare de descer no momento em que as costas ameaçarem arquear.'
    ],
    commonErrors: [
      'Dobrar excessivamente os joelhos transformando em levantamento terra.',
      'Afastar a barra das pernas sobrecarregando a lombar.'
    ],
    alternatives: ['Stiff com Halteres', 'Levantamento Terra Romeno (RDL)'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 75
  },

  // --- OMBROS ---
  {
    id: 'ex-ombros-desenvolvimento-militar',
    name: 'Desenvolvimento Militar com Barra',
    category: 'Ombros',
    secondaryMuscles: ['Tríceps', 'Peito', 'Abdômen'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    instructions: [
      'Em pé ou sentado, apoie a barra sobre a porção superior do peito com pegada pronada na largura dos ombros.',
      'Contraia glúteos e abdômen para estabilização do tronco.',
      'Empurre a barra verticalmente para cima da cabeça, passando rente ao rosto.',
      'Termine o movimento com os braços estendidos e a barra alinhada com as orelhas.'
    ],
    tips: [
      'Mova a cabeça ligeiramente para trás enquanto a barra sobe e avance a cabeça para frente no topo do movimento.'
    ],
    securityWarnings: [
      'Não arqueie as costas excessivamente para trás para não comprimir a coluna lombar.'
    ],
    commonErrors: [
      'Impulsionar com os joelhos (isso seria um push press, não desenvolvimento estrito).',
      'Descer a barra apenas pela metade.'
    ],
    alternatives: ['Desenvolvimento com Halteres', 'Desenvolvimento Arnold', 'Desenvolvimento Máquina'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSec: 90
  },
  {
    id: 'ex-ombros-elevacao-lateral',
    name: 'Elevação Lateral com Halteres',
    category: 'Ombros',
    secondaryMuscles: [],
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    instructions: [
      'Fique em pé segurando um haltere em cada mão ao lado do corpo, tronco ligeiramente inclinado para a frente.',
      'Com os cotovelos levemente flexionados, eleve os braços lateralmente até a altura dos ombros.',
      'Pause brevemente no topo e desça controladamente resistindo à gravidade.'
    ],
    tips: [
      'Imagine que está vertendo uma jarra d’água: mantenha o polegar levemente inclinado para baixo ou neutro.',
      'O cotovelo deve conduzir o movimento, ficando no mesmo nível ou ligeiramente acima das mãos.'
    ],
    securityWarnings: [
      'Não eleve os halteres acima da linha do ombro para evitar impacto subacromial.'
    ],
    commonErrors: [
      'Usar impulso com o corpo para balançar os halteres.',
      'Encolher os ombros ativando o trapézio em vez do deltoide lateral.'
    ],
    alternatives: ['Elevação Lateral na Polia', 'Elevação Lateral Máquina'],
    defaultSets: 4,
    defaultReps: 12,
    defaultRestSec: 60
  },
  {
    id: 'ex-ombros-crucifixo-inverso',
    name: 'Crucifixo Inverso na Máquina / Peck Deck',
    category: 'Ombros',
    secondaryMuscles: ['Costas'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    instructions: [
      'Sente-se de frente para o encosto do peck deck com o peito apoiado.',
      'Segure as manoplas na altura dos ombros.',
      'Puxe os braços para trás e para fora em um arco amplo focando nos deltoides posteriores.',
      'Segure 1 segundo na contração e retorne lentamente.'
    ],
    tips: [
      'Fundamental para postura, saúde dos ombros e equilíbrio muscular.'
    ],
    securityWarnings: [
      'Mantenha os cotovelos nivelados com os ombros.'
    ],
    commonErrors: [
      'Usar os trapézios e puxar apenas com as escápulas sem ativar os deltoides posteriores.'
    ],
    alternatives: ['Face Pull na Polia com Corda', 'Crucifixo Inverso com Halteres Curvado'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60
  },

  // --- BÍCEPS ---
  {
    id: 'ex-biceps-rosca-direta-w',
    name: 'Rosca Direta com Barra W',
    category: 'Bíceps',
    secondaryMuscles: ['Antebraço'],
    equipment: 'Barra',
    difficulty: 'Iniciante',
    instructions: [
      'Fique em pé com os pés na largura dos ombros, segurando a barra W na curvatura externa ou interna.',
      'Mantenha os cotovelos fixos junto às laterais do corpo.',
      'Flexione os cotovelos erguendo a barra até a altura do peito, contraindo ao máximo os bíceps.',
      'Abaixe a barra lentamente até estender os braços.'
    ],
    tips: [
      'A barra W alivia a pressão nos punhos em comparação com a barra reta tradicional.',
      'Evite projetar os cotovelos para frente durante a subida.'
    ],
    securityWarnings: [
      'Não balance a coluna lombar para impulsionar a carga.'
    ],
    commonErrors: [
      'Fazer o movimento rápido e soltar os braços na descida.',
      'Abrir os cotovelos lateralmente.'
    ],
    alternatives: ['Rosca Direta com Halteres', 'Rosca no Cabo com Barra Reta'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSec: 60
  },
  {
    id: 'ex-biceps-rosca-martelo',
    name: 'Rosca Martelo com Halteres',
    category: 'Bíceps',
    secondaryMuscles: ['Antebraço'],
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    instructions: [
      'Segure os halteres com pegada neutra (palmas voltadas uma para a outra).',
      'Mantenha os cotovelos colados ao tronco e eleve os pesos até a altura dos ombros.',
      'Pause brevemente no topo e desça controlando o movimento.'
    ],
    tips: [
      'Trabalha intensamente o braquial e o braquiorradial, proporcionando volume aos braços e espessura ao antebraço.'
    ],
    securityWarnings: [
      'Mantenha os punhos alinhados sem torções.'
    ],
    commonErrors: [
      'Girar o punho durante o movimento (isso descaracteriza a pegada neutra).'
    ],
    alternatives: ['Rosca Martelo na Polia com Corda', 'Rosca Inversa'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60
  },
  {
    id: 'ex-biceps-rosca-scott',
    name: 'Rosca Scott com Barra W',
    category: 'Bíceps',
    secondaryMuscles: ['Antebraço'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    instructions: [
      'Apoie os braços e o peito firmemente no banco Scott inclinado.',
      'Segure a barra W e flexione os cotovelos puxando o peso para cima.',
      'Pare logo antes da barra chegar perpendicular ao chão para manter tensão no músculo.',
      'Desça de maneira controlada até quase a extensão total dos braços.'
    ],
    tips: [
      'Exercício de isolamento rigoroso que elimina qualquer roubo com o tronco.'
    ],
    securityWarnings: [
      'Nunca estenda bruscamente o braço no final com carga pesada (risco de distensão do tendão do bíceps).'
    ],
    commonErrors: [
      'Levantar o corpo do assento durante a subida.'
    ],
    alternatives: ['Rosca Scott na Máquina', 'Rosca Concentrada com Haltere'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSec: 60
  },

  // --- TRÍCEPS ---
  {
    id: 'ex-triceps-corda-polia',
    name: 'Tríceps na Polia com Corda',
    category: 'Tríceps',
    secondaryMuscles: [],
    equipment: 'Polia/Cabo',
    difficulty: 'Iniciante',
    instructions: [
      'Prenda a corda na polia alta.',
      'Segure a corda com pegada neutra e incline o tronco ligeiramente para a frente.',
      'Mantenha os cotovelos travados próximos às costelas.',
      'Empurre a corda para baixo estendendo os braços e, no final, afaste as pontas da corda para pico de contração máxima da cabeça lateral.',
      'Retorne devagar até os antebraços formarem um ângulo de cerca de 90 graus.'
    ],
    tips: [
      'A abertura da corda no final é o segredo para contração completa do tríceps.'
    ],
    securityWarnings: [
      'Não use o peso do tronco jogando-se sobre a corda.'
    ],
    commonErrors: [
      'Deixar os cotovelos se moverem para frente e para trás.'
    ],
    alternatives: ['Tríceps na Polia com Barra Reta', 'Tríceps Francês na Polia'],
    defaultSets: 4,
    defaultReps: 12,
    defaultRestSec: 60
  },
  {
    id: 'ex-triceps-testa-w',
    name: 'Tríceps Testa com Barra W',
    category: 'Tríceps',
    secondaryMuscles: [],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    instructions: [
      'Deite-se no banco reto segurando a barra W com os braços estendidos acima do peito.',
      'Incline os braços ligeiramente para trás (cerca de 10-15 graus) para manter tensão contínua.',
      'Flexione apenas os cotovelos descendo a barra em direção à testa ou um pouco atrás da cabeça.',
      'Estenda os cotovelos de volta à posição inicial contraindo o tríceps.'
    ],
    tips: [
      'Trabalho excelente na cabeça longa do tríceps.',
      'Mantenha os cotovelos paralelos sem deixá-los abrir para os lados.'
    ],
    securityWarnings: [
      'Mantenha pegada firme e controle total para não bater a barra na cabeça.'
    ],
    commonErrors: [
      'Mover os ombros durante o movimento, transformando o exercício em um pullover.'
    ],
    alternatives: ['Tríceps Testa com Halteres', 'Tríceps Francês com Haltere'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSec: 75
  },
  {
    id: 'ex-triceps-paralelas',
    name: 'Tríceps nas Paralelas (Dips)',
    category: 'Tríceps',
    secondaryMuscles: ['Peito', 'Ombros'],
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    instructions: [
      'Apoie-se nas barras paralelas com os braços estendidos e o corpo ereto.',
      'Mantenha o tronco o mais vertical possível para focar no tríceps (inclinar para a frente foca mais no peito).',
      'Desça até que os cotovelos formem um ângulo de 90 graus.',
      'Empurre o corpo de volta para cima com força no tríceps.'
    ],
    tips: [
      'Mantenha os cotovelos próximos ao corpo.'
    ],
    securityWarnings: [
      'Não desça além de 90 graus se tiver histórico de dor nos ombros.'
    ],
    commonErrors: [
      'Balançar o corpo para usar inércia.'
    ],
    alternatives: ['Tríceps no Banco', 'Paralelas no Graviton'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSec: 90
  },

  // --- GLÚTEOS ---
  {
    id: 'ex-gluteos-elevacao-pelvica',
    name: 'Elevação Pélvica com Barra (Hip Thrust)',
    category: 'Glúteos',
    secondaryMuscles: ['Pernas'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    instructions: [
      'Sente-se no chão com as costas apoiadas na borda de um banco fixo (abaixo das escápulas).',
      'Posicione a barra acolchoada sobre a linha do quadril.',
      'Pés no chão na largura dos ombros, canelas perpendiculares ao chão no topo do movimento.',
      'Empurre o chão através dos calcanhares elevando o quadril até ficar alinhado com o tronco e coxas.',
      'Aperte os glúteos com força por 1 a 2 segundos no topo e desça controladamente.'
    ],
    tips: [
      'Olhe para a frente ou para os joelhos durante a subida (evite olhar para o teto para não hiperextender a cervical e lombar).',
      'O melhor exercício isolado para hipertrofia e força máxima de glúteos.'
    ],
    securityWarnings: [
      'Sempre utilize protetor ou almofada na barra para conforto e proteção do osso ilíaco.'
    ],
    commonErrors: [
      'Hiperextender a lombar no topo em vez de usar os glúteos.',
      'Colocar os pés muito à frente ou muito atrás.'
    ],
    alternatives: ['Elevação Pélvica na Máquina', 'Ponte de Glúteos no Solo'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 90
  },
  {
    id: 'ex-gluteos-cadeira-abdutora',
    name: 'Cadeira Abdutora',
    category: 'Glúteos',
    secondaryMuscles: [],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    instructions: [
      'Sente-se com as costas bem apoiadas no encosto da máquina.',
      'Posicione as almofadas na parte externa dos joelhos.',
      'Abra as pernas empurrando para fora com força nos glúteos médios.',
      'Segure 1 segundo na máxima abertura e retorne devagar sem deixar os pesos encostarem.'
    ],
    tips: [
      'Inclinar o tronco levemente para a frente pode aumentar a ativação das fibras do glúteo médio.'
    ],
    securityWarnings: [
      'Não dê solavancos com os joelhos.'
    ],
    commonErrors: [
      'Fazer o retorno muito rápido sem controle excêntrico.'
    ],
    alternatives: ['Abdução com Caneleira', 'Passada Lateral com Elástico'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSec: 45
  },

  // --- ABDÔMEN ---
  {
    id: 'ex-abdomen-prancha-isometrica',
    name: 'Prancha Abdominal Isométrica',
    category: 'Abdômen',
    secondaryMuscles: ['Ombros', 'Glúteos'],
    equipment: 'Peso Corporal',
    difficulty: 'Iniciante',
    instructions: [
      'Apoie os antebraços e as pontas dos pés no chão.',
      'Mantenha os cotovelos alinhados sob os ombros.',
      'Mantenha o corpo em uma linha reta da cabeça aos calcanhares.',
      'Contraia ativamente o abdômen e os glúteos sem deixar o quadril cair ou subir.'
    ],
    tips: [
      'Respire de forma contínua e estável; nunca prenda a respiração.'
    ],
    securityWarnings: [
      'Se a lombar começar a arquear ou doer, interrompa a série.'
    ],
    commonErrors: [
      'Deixar a bacia afundar em direção ao solo.',
      'Elevar os glúteos excessivamente.'
    ],
    alternatives: ['Prancha com Toque nos Ombros', 'Rollout com Roda Abdominal'],
    defaultSets: 3,
    defaultReps: 45, // em segundos
    defaultRestSec: 60
  },
  {
    id: 'ex-abdomen-elevacao-pernas-suspenso',
    name: 'Elevação de Pernas na Barra Fixa',
    category: 'Abdômen',
    secondaryMuscles: ['Antebraço'],
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    instructions: [
      'Pendure-se em uma barra fixa com pegada pronada.',
      'Estabilize o corpo sem balançar.',
      'Eleve os joelhos (iniciante) ou as pernas estendidas (avançado) até a linha da cintura ou peito, flexionando a pelve.',
      'Abaixe as pernas devagar sem usar o balanço do corpo.'
    ],
    tips: [
      'Foque em enrolar a pelve para cima (retroversão) e não apenas levantar as pernas com o flexor de quadril.'
    ],
    securityWarnings: [
      'Evite balançar pendurado como um pêndulo.'
    ],
    commonErrors: [
      'Usar apenas o músculo psoas-ilíaco sem arredondar a pelve.'
    ],
    alternatives: ['Elevação de Pernas no Solo', 'Abdominal Infra na Paralela'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60
  },

  // --- PANTURRILHAS ---
  {
    id: 'ex-panturrilha-em-pe-maquina',
    name: 'Panturrilha em Pé na Máquina',
    category: 'Panturrilhas',
    secondaryMuscles: [],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    instructions: [
      'Posicione os ombros sob as almofadas acolchoadas com as pontas dos pés na borda da plataforma.',
      'Mantenha os joelhos ligeiramente destravados mas imóveis.',
      'Abaixe os calcanhares o máximo possível para alongar profundamente a fáscia e o gastrocnêmio.',
      'Suba na ponta dos pés o mais alto possível, segurando a contração máxima por 1 segundo.'
    ],
    tips: [
      'A pausa no fundo de 1 a 2 segundos dissipa a energia elástica do tendão de Aquiles, forçando o músculo a trabalhar muito mais.'
    ],
    securityWarnings: [
      'Não dobre e estique os joelhos durante a execução.'
    ],
    commonErrors: [
      'Fazer repetições curtas e rápidas tipo "quicada".'
    ],
    alternatives: ['Panturrilha no Leg Press', 'Panturrilha em Pé Unilateral com Haltere'],
    defaultSets: 4,
    defaultReps: 15,
    defaultRestSec: 60
  },
  {
    id: 'ex-panturrilha-sentado-maquina',
    name: 'Panturrilha Sentado (Gêmeos)',
    category: 'Panturrilhas',
    secondaryMuscles: [],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    instructions: [
      'Sente-se na máquina com as almofadas apoiadas sobre as coxas, logo acima dos joelhos.',
      'Apoie a ponta dos pés na plataforma e solte a trava.',
      'Desça os calcanhares para alongamento completo.',
      'Empurre para cima até a flexão plantar máxima.'
    ],
    tips: [
      'Com os joelhos flexionados a 90 graus, o músculo sóleo assume quase todo o trabalho de hipertrofia da panturrilha.'
    ],
    securityWarnings: [
      'Mantenha as almofadas firmemente ajustadas.'
    ],
    commonErrors: [
      'Usar carga tão pesada que impossibilita a amplitude total.'
    ],
    alternatives: ['Panturrilha Sentado com Halteres nos Joelhos'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSec: 45
  },

  // --- ANTEBRAÇO ---
  {
    id: 'ex-antebraco-rosca-punho',
    name: 'Rosca de Punho com Barra',
    category: 'Antebraço',
    secondaryMuscles: [],
    equipment: 'Barra',
    difficulty: 'Iniciante',
    instructions: [
      'Ajoelhe-se ao lado de um banco reto apoiando os antebraços sobre ele, com os punhos para fora da borda.',
      'Segure a barra com pegada supinada (palmas para cima).',
      'Flexione os punhos para cima erguendo a barra.',
      'Abaixe lentamente permitindo que a barra role até as pontas dos dedos para alongamento total.'
    ],
    tips: [
      'Ideal para fortalecer os flexores de punho e a pegada para levantamento terra e remadas.'
    ],
    securityWarnings: [
      'Utilize cargas moderadas para preservar as articulações dos punhos.'
    ],
    commonErrors: [
      'Levantar os cotovelos do banco.'
    ],
    alternatives: ['Rosca Punho Inversa', 'Farmer Walk (Caminhada do Fazendeiro)'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSec: 45
  },

  // --- CARDIO ---
  {
    id: 'ex-cardio-esteira',
    name: 'Esteira / Corrida Intervalada (HIIT)',
    category: 'Cardio',
    secondaryMuscles: ['Pernas', 'Panturrilhas'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    instructions: [
      'Inicie com 3 minutos de caminhada de aquecimento a 5 km/h.',
      'Alterne períodos de corrida moderada a intensa (8-12 km/h) com períodos de caminhada de recuperação.',
      'Finalize com 2 minutos de resfriamento gradual.'
    ],
    tips: [
      'Mantenha a postura ereta e olhe para a frente, sem segurar nos apoios laterais durante a corrida.'
    ],
    securityWarnings: [
      'Sempre utilize o grampo de chave de segurança na camiseta.'
    ],
    commonErrors: [
      'Segurar nos corrimãos da esteira reduzindo o gasto calórico e alterando a biomecânica natural.'
    ],
    alternatives: ['Bicicleta Ergométrica', 'Elíptico', 'Corda Naval'],
    defaultSets: 1,
    defaultReps: 20, // minutos
    defaultRestSec: 0
  }
];
