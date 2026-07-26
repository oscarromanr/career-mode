/* ============================================================
   CAREER MODE '26 — i18n framework + UI chrome translations
   Supports EN / ES with T(key, params) for UI text
   and TData(type, item, field) for game content.
   ============================================================ */
(function (root) {
  'use strict';

  let currentLang = 'en';
  try { currentLang = localStorage.getItem('cm26-lang') || 'en'; } catch (e) { /* ignore */ }

  /* ---------- UI CHROME DICTIONARIES ---------- */

  const UI_EN = {
    // Setup
    'setup.heroTitle': "CAREER MODE <span>'26</span>",
    'setup.heroSub': 'Age 14 to 40. From academy nobody to football immortality. Every season: one dilemma, one training camp, one career-defining club call.',
    'setup.playerName': 'Player name',
    'setup.shirtNo': 'Shirt №',
    'setup.namePlaceholder': 'e.g. Lío Fernández',
    'setup.position': 'Position',
    'setup.posTap': 'tap a spot on the pitch',
    'setup.posSelect': 'Select your position',
    'setup.nationality': 'Nationality',
    'setup.searchCountry': 'Search country…',
    'setup.startCareer': 'Start Career',
    'setup.continue': '▶ Continue saved career',
    'setup.import': '📂 Import save file (.json)',
    'setup.gkNote': ' · keeper stats: REF / LEA / VIS / COM',

    // Player card
    'card.marketValue': 'market value',
    'card.stamina': 'Stamina',
    'card.morale': 'Morale',
    'card.loyalty': 'Loyalty',
    'card.hype': 'Hype',
    'card.reputation': 'Reputation',
    'card.superAgent': '🤝 Super-Agent Active',
    'card.perYear': '/yr',
    'card.banked': 'banked',
    'card.age': 'Age',
    'card.season': 'Season',
    'card.caps': 'Caps',
    'card.unattached': 'Unattached · choosing academy',
    'tier.bronze': 'BRONZE',
    'tier.silver': 'SILVER',
    'tier.gold': 'GOLD',
    'tier.diamond': 'ICON',

    // Stage header
    'stage.season': 'Season {n}',
    'stage.age': 'Age {n}',
    'step.decision': 'Decision',
    'step.booster': 'Training',
    'step.club': 'Club',
    'stage.shopTitle': 'Club shop (1 per season)',
    'stage.menuTitle': 'Game menu',
    'menu.export': '💾 Export save',
    'menu.retire': '👟 Retire now',
    'menu.restart': '↺ New game',

    // Roles
    'role.star': 'Star player',
    'role.key': 'Key starter',
    'role.rotation': 'Rotation player',
    'role.prospect': 'Prospect',

    // Offer notes
    'offerNote.return': 'Return from loan to {club}. Claim your spot in the squad.',
    'offerNote.newContract': 'Contract Renewal Offer. Your parent club offers a new contract extension.',
    'offerNote.loyal': 'Club Icon. Senior leader — the fans chant your name.',
    'offerNote.veteran': 'The fans want one more year.',
    'offerNote.stay': 'Loyalty. The fans sing your name.',
    'offerNote.loanConvinced': 'The loan club is convinced. They want you permanently — no debate.',
    'offerNote.loanSolid': 'Solid performances earned you a permanent offer from the loan club.',
    'offerNote.loanExtendYoung': 'Extend the loan — more development time and guaranteed minutes.',
    'offerNote.loanExtendUnfinished': 'The loan club wants you back for another season. Unfinished business.',
    'offerNote.superAgent': 'Your super-agent negotiated a massive contract wage & fee! Miraculous work.',
    'offerNote.devLoan': 'Development loan. Guaranteed minutes promised.',
    'offerNote.sunset': 'Sunset league payday. Golf courses included.',
    'offerNote.homecoming': 'Homecoming. The prodigal returns.',
    'offerNote.royalty': 'European royalty comes calling. This is the dream.',
    'offerNote.stepUp': 'A step up. Bigger stage, bigger pressure.',
    'offerNote.fresh': 'A fresh challenge awaits.',

    // Stat notes / History notes
    'note.returned': 'Returned from loan to {club}',
    'note.loanMove': 'Loan move to {club}',
    'note.signedFor': 'Signed for {club}',

    // Club card
    'club.level': 'Club level',
    'club.fee': 'Fee:',

    // Academy
    'academy.title': 'Choose your academy',
    'academy.desc': "You're 14. Scouts from three {league} clubs are at your door. This choice shapes your development — elite facilities or early minutes.",
    'academy.chip': 'ACADEMY',
    'academy.role.elite': 'Elite academy',
    'academy.note.elite': 'Best facilities in the region. High pressure, top coaching.',
    'academy.role.balanced': 'Balanced project',
    'academy.note.balanced': 'Good coaching, realistic path to first team minutes.',
    'academy.role.fastTrack': 'Fast track',
    'academy.note.fastTrack': 'Smaller stage, but early first-team debut opportunities.',
    'academy.role.euro': 'European dream',
    'academy.note.euro': 'A once-in-a-lifetime academy offer from a European giant. Extremely rare. Extremely tempting.',
    'note.joinedAcademy': 'Joined {club} academy',

    // Awards
    'award.ballon-dor': "Ballon d'Or",
    'award.the-best': 'FIFA The Best',
    'award.golden-boy': 'Golden Boy',
    'award.puskas': 'FIFA Puskás Award',
    'award.tots': 'Team of the Season',

    // Decision
    'decision.quietTitle': 'Quiet week',
    'decision.quietDesc': "No drama this season. The media is busy with someone else's scandal.",
    'btn.continue': 'Continue',
    'decision.kicker': 'DRESSING ROOM TALK',
    'decision.coinRoll': '🎲 50/50 COIN ROLL · {pct}% UPSIDE',
    'decision.penaltyKick': '⚽ PENALTY KICK',
    'decision.penaltySave': '🧤 PENALTY SAVE',
    'decision.timingGame': '⚡ TIMING MINIGAME',

    // Booster
    'booster.title': 'Off-season training',
    'booster.desc': 'Pick one program. Rarer camps give bigger boosts — gold can transform multiple stats.',

    // Club stage
    'club.title': 'Choose your next club',
    'club.desc': 'Your agent lays the offers on the table. Where does season {n} happen?',
    'offer.stay': 'STAY',
    'offer.transfer': 'TRANSFER',
    'offer.loan': 'LOAN',
    'offer.released': 'RELEASED',
    'offer.return': 'RETURN',
    'offer.loanBuyout': 'BUYOUT',

    // Simulation
    'sim.title': 'Simulating season {n}…',
    'sim.warmup': 'Warming up…',

    // History
    'hist.yo': 'y/o',
    'hist.loan': 'loan',
    'hist.summary': 'Summary',
    'hist.career': 'Career History',
    'hist.league': 'League Table',
    'hist.empty': 'No seasons played yet.<br>The story starts now.',
    'hist.joinClub': 'Join a club to see the league.',
    'hist.finalTable': 'Final table {year}',
    'hist.preseason': 'Pre-season — by squad strength',

    // Summary tab
    'sum.apps': 'Apps',
    'sum.goals': 'Goals',
    'sum.assists': 'Assists',
    'sum.saves': 'Saves',
    'sum.gc': 'GC',
    'sum.cs': 'CS',
    'sum.caps': 'Caps',
    'sum.cleanSheets': 'Clean Sheets',
    'sum.ntTeam': '{country} National Team',
    'sum.debut': 'Debut: {year}',
    'sum.ntDuty': 'National Duty',
    'sum.fifaRank': 'FIFA Rank #{rank}',
    'sum.seasons': '{n} seasons',
    'sum.season1': '1 season',

    // Chips
    'chip.injured': '🤕 Injured',
    'chip.shield': '🛡 Physio shield active',
    'chip.superAgent': '🤝 Super-Agent hired',
    'chip.injuryShield': '🛡 injury shield',
    'chip.superAgentShop': '🤝 super-agent',

    // Outcome modal
    'outcome.kicker': 'THE OUTCOME',
    'boosterOut.bronze': 'Hard work banked. Nobody claps for training camps — until they watch you play.',
    'boosterOut.silver': 'Serious work, serious gains. The coaches noticed something shift in you this summer.',
    'boosterOut.gold': 'A career-altering camp. You came back a different player. The squad noticed on day one.',
    'boosterOut.diamond': 'An otherworldly training camp. Legendary gains that defy human limits.',

    // Academy
    'academy.title': 'Choose your academy',
    'academy.desc': 'You are 14. Scouts from three clubs in {league} are at your door. This choice sets your development path — elite facilities vs early minutes.',
    'academy.chip': 'ACADEMY',
    'academy.searchCustom': '🎯 Choose Custom Starting Academy',
    'academy.searchTitle': '🎯 Select Starting Academy Club',

    // Agent & Finances Card
    'agent.title': 'FINANCES & AGENT',
    'agent.name': 'Active Agent',
    'agent.dadName': 'Family Agent (Dad)',
    'agent.dadType': 'Family Representative',
    'agent.proType': 'Professional Agent',
    'agent.contract': 'Contract',
    'agent.freeAgent': 'Free Agent',
    'agent.season1': 'Season left',
    'agent.seasonsN': 'Seasons left',
    'agent.fee': 'Annual Expenses',
    'agent.noFee': 'No Expenses',
    'agent.marketDesc': 'Hire a new representative or switch back to your Dad. Firing a paid agent requires paying their release buyout clause.',
    'agent.activeChip': 'Active',
    'agent.free': 'FREE',
    'agent.annualFee': 'Annual Fee',
    'agent.buyoutFee': 'Buyout Fee',
    'agent.hireBtn': 'Hire Agent',
    'agent.fireAndHireBtn': 'Fire {name} & Hire ({buyout} Buyout)',
    'agent.patience': 'Patience',
    'agent.greed': 'Greed',
    'agent.negotiation': 'Negotiation',
    'agent.banked': 'Banked Earnings',
    'agent.salary': 'Current Salary',
    'agent.talkBtn': '🗣️ Speak with Agent',
    'agent.targetClub': 'Target Club',
    'agent.commission': 'Transfer Cut',
    'agent.none': 'None',
    'agent.setTarget': '🎯 Declare Public Target Club',
    'agent.negotiateComm': '💸 Negotiate Transfer Commission',
    'agent.requestMove': '📋 Request Transfer / Loan List',
    'agent.demandRaise': '💰 Demand Salary Increase',
    'agent.openMarket': '🛒 Agent Market (Hire / Fire)',
    'agent.marketTitle': 'Agent Market Candidates',
    'agent.hired': 'Successfully hired {name} as your new agent!',
    'agent.hiredWithBuyout': 'Fired previous agent and paid {buyout} release clause. Hired {name}!',
    'agent.cantAffordBuyout': 'Cannot afford the {amount} release buyout clause of your current agent.',
    'agent.cantAffordSalary': 'Your annual salary ({salary}) cannot cover this agent\'s annual fee ({fee}).',
    'agent.propertyOf': 'Property of {club}',
    'agent.searchPlaceholder': 'Search club name...',
    'agent.targetSet': 'Publicly declared interest in joining {club}!',
    'agent.commSet': 'Negotiated {pct}% transfer fee commission with your agent!',
    'agent.transferRequested': 'Requested a transfer/loan list placement. Market hype increased!',
    'agent.raiseSecured': 'Agent negotiated a salary bump to {salary}/yr!',
    'agent.raiseDenied': 'The club management refused a wage raise at this time.',
    'note.transferCut': 'Earned {amount} transfer commission ({pct}%)',
    'note.demandedRaise': 'Agent secured contract raise to {salary}/yr',
    'note.paidAgentFee': 'Paid {amount} annual expenses to {name}',
    'note.ntAccepted': 'Received international call-up for {country}!',
    'note.ntDeclined': 'Declined international call-up for {country}',
    'note.ntSwitched': 'Switched national team allegiance to {country}!',

    // Season result
    'sr.kicker': 'SEASON {year} COMPLETE',
    'sr.apps': 'Apps',
    'sr.saves': 'Saves',
    'sr.conceded': 'Conceded',
    'sr.cleanSheets': 'Clean sheets',
    'sr.goals': 'Goals',
    'sr.assists': 'Assists',
    'sr.avgRating': 'Avg rating',
    'sr.intCaps': '🌍 {n} international caps',
    'sr.intCapsGoals': '🌍 {n} international caps · {g} goals for {country}',
    'sr.statsTitle': 'PLAYER STATS & SEASON EVOLUTION',
    'sr.ovr': 'OVR',
    'sr.value': 'Value',
    'sr.legacy': 'See your legacy',
    'sr.startSeason': 'Start season {n}',

    // Risk reveal
    'risk.good': 'GOOD',
    'risk.bad': 'BAD',
    'risk.deciding': 'Fate is deciding…',
    'risk.goodResult': 'Fortune smiles.',
    'risk.badResult': 'Ouch.',

    // Penalty mini
    'pen.kicker': 'THE PENALTY',
    'pen.title': 'Pick your spot',
    'pen.sub': '{good} of {total} zones beat the keeper',
    'pen.goal': 'GOOOAL!',
    'pen.saved': 'SAVED!',

    // Timing mini
    'timing.kicker': 'TIMING IS EVERYTHING',
    'timing.title': 'Stop the pointer in the green',
    'timing.sub': 'Click the bar (or press STRIKE) at the perfect moment',
    'timing.strike': 'STRIKE',
    'timing.perfect': 'PERFECT!',
    'timing.close': 'Close...',
    'timing.justAbout': 'Just about!',
    'timing.milesOff': 'Miles off.',

    // GK penalty mini
    'gk.kicker': 'PENALTY SAVE',
    'gk.title': 'Choose your dive direction',
    'gk.sub': 'Predict where the striker is placing the ball!',
    'gk.left': '⬅️ DIVE LEFT',
    'gk.center': '🧍 STAND CENTER',
    'gk.right': '➡️ DIVE RIGHT',
    'gk.saved': '🧤 GREAT SAVE!',
    'gk.goal': '⚽ GOAL! Wrong direction.',

    // NT call-up
    'nt.kicker': '🌍 INTERNATIONAL SELECTION',
    'nt.title': 'Called up for {country}!',
    'nt.desc': 'Your stellar form has earned you a call-up to represent your country on the international stage! (FIFA Rank #{rank})',
    'nt.debut': '🌍 National Team Debut',
    'nt.exposure': '🔥 International Exposure',
    'nt.btn': 'Represent Your Nation',
    'nt.declineBtn': 'Decline Call-Up',
    'nt.declinedNote': 'Declined national team call-up for {country}. Remaining eligible for future options.',
    'nt.naturalizedNote': 'Earned citizenship in {country} after 5+ seasons and accepted National Team call-up!',

    // Shop
    'shop.kicker': 'CLUB SHOP · {tier} TIER ({used}/{max} PURCHASES USED)',
    'shop.title': 'Consumables',
    'shop.balance': 'Career earnings banked: <b>{amount}</b> · {n} purchase{s} remaining',
    'shop.reroll': '🎲 Reroll Shop Options (€50K)',
    'shop.purchased': 'PURCHASED',
    'shop.close': 'Close',

    // Retire / confirm
    'retire.kicker': 'HANG UP THE BOOTS?',
    'retire.title': 'Retire at {age}?',
    'retire.warn': 'This ends the career immediately. There is no undo.',
    'retire.yes': 'Retire for good',
    'retire.no': 'Keep playing',
    'restart.kicker': 'START OVER?',
    'restart.title': 'Delete this career?',
    'restart.text': '{name}, age {age}, season {n} — everything goes back to the academy gates.',
    'restart.warn': 'This wipes the saved career permanently. There is no undo.',
    'restart.yes': 'Delete & restart',
    'btn.confirm': 'Confirm',
    'btn.cancel': 'Cancel',
    'btn.close': 'Close',
    'import.failTitle': 'Import failed',
    'import.failText': "That file doesn't look like a Career Mode '26 save. No harm done.",

    // Summary screen
    'summary.kicker': 'CAREER COMPLETE · {n} SEASON{s}',
    'summary.peakOvr': 'Peak overall',
    'summary.reachedIn': 'reached in {year}',
    'summary.peakValue': 'Peak market value',
    'summary.inYear': 'in {year}',
    'summary.savesLabel': 'Saves',
    'summary.cleanSheetsN': '{n} clean sheets',
    'summary.goalsConceded': 'Goals conceded',
    'summary.appsN': '{n} apps',
    'summary.goalsLabel': 'Goals',
    'summary.assistsLabel': 'Assists',
    'summary.allComps': 'all competitions',
    'summary.earnings': 'Career earnings',
    'summary.onConsumables': '{amount} on consumables',
    'summary.everyCent': 'every cent saved',
    'summary.legacyScore': 'Legacy score',
    'summary.legacyMetric': 'hall of fame metric',
    'summary.trophyCabinet': 'Trophy Cabinet',
    'summary.trophiesN': '{n} trophies',
    'summary.trLeague': 'League',
    'summary.trCup': 'Cup',
    'summary.trContinental': 'Continental',
    'summary.trCountry': 'Country',
    'summary.bareShelves': 'Bare shelves. The memories were the real trophies. (The fans disagree.)',
    'summary.awards': 'Individual Awards',
    'summary.intCareer': 'International career',
    'summary.capsGoals': '{caps} caps · {goals} goals',
    'summary.capsOnly': '{caps} caps',
    'summary.noIntTrophies': 'No international trophies — the quarterfinal curse was real.',
    'summary.clubCareer': 'Club career',
    'summary.newCareer': 'Start New Career',

    // Retire blurbs
    'blurb.full': 'A complete career. Age 40, nothing left in the tank. Immortal.',
    'blurb.legend': 'A legend walking away at the summit. Statues incoming.',
    'blurb.star': 'A star who lit up every stadium they touched.',
    'blurb.pro': 'A respected professional. Graft, sweat, honor — in that order.',
    'blurb.journeyman': 'The ultimate journeyman. A shirt in every color, a story in every city.',
    'blurb.wonderkid': 'The great what-if. Gone before the world saw the full show.',
    'blurb.quiet': 'A quiet career — but every kid who watched believed a little more.',

    // Stat names
    'stat.PAC': 'Pace',
    'stat.DRI': 'Dribbling',
    'stat.SHO': 'Shot',
    'stat.MEN': 'Mental',
    'stat.PAS': 'Passing',
    'stat.PHY': 'Physical',
    'stat.REF': 'Reflexes',
    'stat.LEA': 'Leadership',
    'stat.VIS': 'Vision',
    'stat.COM': 'Composure',

    // Position labels
    'pos.GK': 'Goalkeeper',
    'pos.CB': 'Centre Back',
    'pos.RB': 'Right Back',
    'pos.LB': 'Left Back',
    'pos.CM': 'Central Mid',
    'pos.RM': 'Right Mid',
    'pos.LM': 'Left Mid',
    'pos.CAM': 'Attacking Mid',
    'pos.RW': 'Right Winger',
    'pos.LW': 'Left Winger',
    'pos.ST': 'Striker',

    // Booster outcome
    'boosterOut.bronze': 'Hard work banked. Nobody claps for training camps — until they watch you play.',
    'boosterOut.silver': 'Serious work, serious gains. The coaches noticed something shift in you this summer.',
    'boosterOut.gold': 'A career-altering camp. You came back a different player. The squad noticed on day one.',

    // Shop outcome map
    'shopOut.default': 'Money well spent. Probably.',
    'shopOut.Private Chef': 'Macros on point. The nutritionist cries tears of joy.',
    'shopOut.Hyperbaric Chamber Sessions': 'You emerge from the tube feeling 18 again. Whatever your age.',
    'shopOut.Elite Mental Coach': 'Three sessions in, you start visualizing success in 4K.',
    'shopOut.Personal Video Analyst': 'Every touch reviewed. The weak spots never stood a chance.',
    'shopOut.Personal Trainer': 'He makes you carry a tire up a hill. The tire now fears YOU.',
    'shopOut.PR & Brand Team': 'Your name is suddenly everywhere. Even your barber has opinions now.',
    'shopOut.Physio Insurance Package': 'A world-class physio team now shadows you. Injuries: officially on notice.',
    'shopOut.Custom Lab Boots': "They weigh nothing. They touch the ball like it's magnetized. Weapons-grade.",
    'shopOut.Mindfulness Retreat': 'One week of silence. You return unable to hear criticism. Literal peace.',
    'shopOut.Super-Agent Package': 'Your agent now has a bigger suit and three phones. Offers incoming.',

    // Language
    'lang.label': '🌐',
  };

  /* ---- LATIN AMERICAN SPANISH ---- */
  const UI_ES = {
    // Setup
    'setup.heroTitle': "MODO CARRERA <span>'26</span>",
    'setup.heroSub': 'De los 14 a los 40. De pibe de barrio a leyenda del fútbol. Cada temporada: un dilema, un campamento de entrenamiento, una decisión de club que define tu carrera.',
    'setup.playerName': 'Nombre del jugador',
    'setup.shirtNo': 'Dorsal №',
    'setup.namePlaceholder': 'ej. Lío Fernández',
    'setup.position': 'Posición',
    'setup.posTap': 'tocá un lugar en la cancha',
    'setup.posSelect': 'Elegí tu posición',
    'setup.nationality': 'Nacionalidad',
    'setup.searchCountry': 'Buscar país…',
    'setup.startCareer': 'Iniciar Carrera',
    'setup.continue': '▶ Continuar carrera guardada',
    'setup.import': '📂 Importar archivo (.json)',
    'setup.gkNote': ' · stats de arquero: REF / LID / VIS / COM',

    // Player card
    'card.marketValue': 'valor de mercado',
    'card.stamina': 'Resistencia',
    'card.morale': 'Moral',
    'card.loyalty': 'Lealtad',
    'card.hype': 'Hype',
    'card.reputation': 'Reputación',
    'card.superAgent': '🤝 Súper-Agente Activo',
    'card.perYear': '/año',
    'card.banked': 'ahorrado',
    'card.age': 'Edad',
    'card.season': 'Temporada',
    'card.caps': 'Convocatorias',
    'card.unattached': 'Sin club · eligiendo academia',
    'tier.bronze': 'BRONCE',
    'tier.silver': 'PLATA',
    'tier.gold': 'ORO',
    'tier.diamond': 'ÍCONO',

    // Stage header
    'stage.season': 'Temporada {n}',
    'stage.age': 'Edad {n}',
    'step.decision': 'Decisión',
    'step.booster': 'Entreno',
    'step.club': 'Club',
    'stage.shopTitle': 'Tienda del club (1 por temporada)',
    'stage.menuTitle': 'Menú del juego',
    'menu.export': '💾 Exportar partida',
    'menu.retire': '👟 Retirarse',
    'menu.restart': '↺ Nuevo juego',

    // Roles
    'role.star': 'Jugador estrella',
    'role.key': 'Titular clave',
    'role.rotation': 'Jugador de rotación',
    'role.prospect': 'Promesa',

    // Raw string fallbacks
    'Elite academy': 'Academia de élite',
    'Best facilities in the region. High pressure, top coaching.': 'Las mejores instalaciones de la región. Alta presión, entrenamiento de primer nivel.',
    'Balanced project': 'Proyecto equilibrado',
    'Good coaching, realistic path to first team minutes.': 'Buen cuerpo técnico, camino real hacia minutos en primera división.',
    'Fast track': 'Camino rápido',
    'Smaller stage, but early first-team debut opportunities.': 'Escenario más chico, pero oportunidad de debut temprano en primera.',
    'European dream': 'El sueño europeo',
    'A once-in-a-lifetime academy offer from a European giant. Extremely rare. Extremely tempting.': 'Una oferta de la academia de un gigante europeo. Extremadamente rara. Tentación pura.',
    'Star player': 'Jugador estrella',
    'Key starter': 'Titular clave',
    'Rotation player': 'Jugador de rotación',
    'Prospect': 'Promesa',
    'Club Icon. Senior leader — the fans chant your name.': 'Ídolo del club. Referente del plantel — los hinchas cantan tu nombre.',
    'The fans want one more year.': 'Los hinchas piden un año más.',
    'Loyalty. The fans sing your name.': 'Lealtad. La tribuna canta tu nombre.',
    'The loan club is convinced. They want you permanently — no debate.': 'El club donde estás a préstamo se convenció. Te quieren comprar ya mismo.',
    'Solid performances earned you a permanent offer from the loan club.': 'Tus buenas actuaciones te ganaron una oferta de compra definitiva.',
    'Extend the loan — more development time and guaranteed minutes.': 'Extender el préstamo — más tiempo de desarrollo y minutos asegurados.',
    'The loan club wants you back for another season. Unfinished business.': 'Te quieren un año más a préstamo. Cuentas pendientes por saldar.',
    'Your super-agent negotiated a massive contract wage & fee! Miraculous work.': '¡Tu súper-agente negoció un contrato y sueldo impresionante! Trabajo milagroso.',
    'Development loan. Guaranteed minutes promised.': 'Préstamo de desarrollo. Minutos garantizados.',
    'Sunset league payday. Golf courses included.': 'Contrato millonario de retiro. Golf incluido.',
    'Homecoming. The prodigal returns.': 'El regreso a casa. El hijo pródigo vuelve.',
    'European royalty comes calling. This is the dream.': 'Te busca un gigante de Europa. El sueño de todos.',
    'A step up. Bigger stage, bigger pressure.': 'Un salto de calidad. Más vidriera, más presión.',
    'A fresh challenge awaits.': 'Un nuevo desafío te espera.',

    // Offer notes
    'offerNote.return': 'Volvés del préstamo a {club}. A pelear un lugar en el plantel.',
    'offerNote.newContract': 'Oferta de Renovación. Tu club dueño te ofrece renovar el contrato.',
    'offerNote.loyal': 'Ídolo del club. Referente del plantel — los hinchas cantan tu nombre.',
    'offerNote.veteran': 'Los hinchas piden un año más.',
    'offerNote.stay': 'Lealtad. La tribuna canta tu nombre.',
    'offerNote.loanConvinced': 'El club donde estás a préstamo se convenció. Te quieren comprar ya mismo.',
    'offerNote.loanSolid': 'Tus buenas actuaciones te ganaron una oferta de compra definitiva.',
    'offerNote.loanExtendYoung': 'Extender el préstamo — más tiempo de desarrollo y minutos asegurados.',
    'offerNote.loanExtendUnfinished': 'Te quieren un año más a préstamo. Cuentas pendientes por saldar.',
    'offerNote.superAgent': '¡Tu súper-agente negoció un contrato y sueldo impresionante! Trabajo milagroso.',
    'offerNote.devLoan': 'Préstamo de desarrollo. Minutos garantizados.',
    'offerNote.sunset': 'Contrato millonario de retiro. Golf incluido.',
    'offerNote.homecoming': 'El regreso a casa. El hijo pródigo vuelve.',
    'offerNote.royalty': 'Te busca un gigante de Europa. El sueño de todos.',
    'offerNote.stepUp': 'Un salto de calidad. Más vidriera, más presión.',
    'offerNote.fresh': 'Un nuevo desafío te espera.',

    // Stat notes / History notes
    'note.returned': 'Volvió del préstamo a {club}',
    'note.loanMove': 'Se fue a préstamo a {club}',
    'note.signedFor': 'Firmó con {club}',

    // Club card
    'club.level': 'Nivel del club',
    'club.fee': 'Precio:',

    // Academy
    'academy.title': 'Elegí tu academia',
    'academy.desc': 'Tenés 14 años. Scouts de tres clubes de la {league} están en tu puerta. Esta elección marca tu desarrollo — instalaciones de élite o minutos tempranos.',
    'academy.chip': 'ACADEMIA',
    'academy.searchCustom': '🎯 Elegir Academia Inicial Personalizada',
    'academy.searchTitle': '🎯 Seleccionar Club de Academia Inicial',
    'academy.role.elite': 'Academia de élite',
    'academy.note.elite': 'Las mejores instalaciones de la región. Alta presión, entrenamiento de primer nivel.',
    'academy.role.balanced': 'Proyecto equilibrado',
    'academy.note.balanced': 'Buen cuerpo técnico, camino real hacia minutos en primera división.',
    'academy.role.fastTrack': 'Camino rápido',
    'academy.note.fastTrack': 'Escenario más chico, pero oportunidad de debut temprano en primera.',
    'academy.role.euro': 'El sueño europeo',
    'academy.note.euro': 'Una oferta de la academia de un gigante europeo. Extremadamente rara. Tentación pura.',
    'note.joinedAcademy': 'Ingresó a la academia de {club}',

    // Awards
    'award.ballon-dor': 'Balón de Oro',
    'award.the-best': 'Premio The Best',
    'award.golden-boy': 'Premio Golden Boy',
    'award.puskas': 'Premio Puskás',
    'award.tots': 'Equipo de la Temporada',

    // Decision
    'decision.quietTitle': 'Semana tranquila',
    'decision.quietDesc': 'Sin drama esta temporada. Los medios están ocupados con el escándalo de otro.',
    'btn.continue': 'Continuar',
    'decision.kicker': 'CHARLA DE VESTUARIO',
    'decision.coinRoll': '🎲 MONEDA AL AIRE · {pct}% FAVORABLE',
    'decision.penaltyKick': '⚽ TIRO PENAL',
    'decision.penaltySave': '🧤 ATAJADA DE PENAL',
    'decision.timingGame': '⚡ MINIJUEGO DE TIMING',

    // Booster
    'booster.title': 'Entrenamiento de pretemporada',
    'booster.desc': 'Elegí un programa. Los campamentos más raros dan mejores mejoras — los de oro pueden transformar varias estadísticas.',

    // Club stage
    'club.title': 'Elegí tu próximo club',
    'club.desc': 'Tu agente pone las ofertas sobre la mesa. ¿Dónde jugás la temporada {n}?',
    'offer.stay': 'QUEDARSE',
    'offer.transfer': 'TRANSFERENCIA',
    'offer.loan': 'PRÉSTAMO',
    'offer.released': 'LIBRE',
    'offer.return': 'VOLVER',
    'offer.loanBuyout': 'COMPRA DEFINITIVA',
    'offerNote.loanBuyout': 'OFERTA DE COMPRA DEFINITIVA — El club a préstamo ofrece comprar tu pase definitivo',

    // Simulation
    'sim.title': 'Simulando temporada {n}…',
    'sim.warmup': 'Calentando…',

    // History
    'hist.yo': 'años',
    'hist.loan': 'préstamo',
    'hist.summary': 'Resumen',
    'hist.career': 'Historial',
    'hist.league': 'Tabla de Posiciones',
    'hist.empty': 'No hay temporadas jugadas.<br>La historia empieza ahora.',
    'hist.joinClub': 'Uníte a un club para ver la liga.',
    'hist.finalTable': 'Tabla final {year}',
    'hist.preseason': 'Pretemporada — por nivel del plantel',

    // Summary tab
    'sum.apps': 'PJ',
    'sum.goals': 'Goles',
    'sum.assists': 'Asistencias',
    'sum.saves': 'Atajadas',
    'sum.gc': 'GC',
    'sum.cs': 'VI',
    'sum.caps': 'Selección',
    'sum.cleanSheets': 'Vallas Invictas',
    'sum.ntTeam': 'Selección de {country}',
    'sum.debut': 'Debut: {year}',
    'sum.ntDuty': 'Selección Nacional',
    'sum.fifaRank': 'Ranking FIFA #{rank}',
    'sum.seasons': '{n} temporadas',
    'sum.season1': '1 temporada',

    // Chips
    'chip.injured': '🤕 Lesionado',
    'chip.shield': '🛡 Escudo kinesiológico activo',
    'chip.superAgent': '🤝 Súper-Agente contratado',
    'chip.injuryShield': '🛡 escudo de lesión',
    'chip.superAgentShop': '🤝 súper-agente',

    // Outcome modal
    'outcome.kicker': 'EL RESULTADO',
    'boosterOut.bronze': 'Trabajo duro en el banco. Nadie aplaude los campamentos de entrenamiento — hasta que te ven jugar.',
    'boosterOut.silver': 'Trabajo serio, mejoras serias. Los técnicos notaron algo distinto en vos este verano.',
    'boosterOut.gold': 'Un campamento que cambia carreras. Volviste siendo otro jugador. El plantel lo notó el primer día.',
    'boosterOut.diamond': 'Un campamento fuera de este mundo. Ganancias legendarias que desafían los límites humanos.',

    // Academy
    'academy.title': 'Elegí tu academia',
    'academy.desc': 'Tenés 14 años. Scouts de tres clubes de {league} están en tu puerta. Esta elección marca tu desarrollo — instalaciones de élite o minutos tempranos.',
    'academy.chip': 'ACADEMY',
    'academy.searchCustom': '🎯 Elegir Club de Academia Personalizado',

    // Agent & Finances Card
    'agent.title': 'FINANZAS Y AGENTE',
    'agent.name': 'Agente Activo',
    'agent.dadName': 'Padre (Agente Familiar)',
    'agent.dadType': 'Representante Familiar',
    'agent.proType': 'Agente Profesional',
    'agent.contract': 'Contrato',
    'agent.freeAgent': 'Agente Libre',
    'agent.season1': 'Temporada restante',
    'agent.seasonsN': 'Temporadas restantes',
    'agent.fee': 'Gastos Anuales',
    'agent.noFee': 'Sin Gastos',
    'agent.marketDesc': 'Contratá un nuevo representante o volvé con tu Padre. Despedir a un agente pago requiere abonar su cláusula de rescisión.',
    'agent.activeChip': 'Activo',
    'agent.free': 'GRATIS',
    'agent.annualFee': 'Costo Anual',
    'agent.buyoutFee': 'Cláusula de Rescisión',
    'agent.hireBtn': 'Contratar Agente',
    'agent.fireAndHireBtn': 'Despedir a {name} y Contratar (Cláusula {buyout})',
    'agent.patience': 'Paciencia',
    'agent.greed': 'Codicia',
    'agent.negotiation': 'Negociación',
    'agent.banked': 'Dinero Ahorrado',
    'agent.salary': 'Sueldo Actual',
    'agent.talkBtn': '🗣️ Hablar con Agente',
    'agent.targetClub': 'Club Objetivo',
    'agent.commission': 'Comisión por Pase',
    'agent.none': 'Ninguno',
    'agent.setTarget': '🎯 Declarar Club Objetivo Público',
    'agent.negotiateComm': '💸 Negociar Comisión por Transferencia',
    'agent.requestMove': '📋 Solicitar Transferencia o Préstamo',
    'agent.demandRaise': '💰 Exigir Aumento de Sueldo',
    'agent.openMarket': '🛒 Mercado de Agentes (Contratar / Despedir)',
    'agent.marketTitle': 'Candidatos a Representante',
    'agent.hired': '¡Contrataste con éxito a {name} como tu nuevo agente!',
    'agent.hiredWithBuyout': 'Despediste a tu agente anterior y pagaste la cláusula de {buyout}. ¡Contrataste a {name}!',
    'agent.cantAffordBuyout': 'No tenés suficiente dinero en el banco para pagar la cláusula de rescisión de {amount}.',
    'agent.cantAffordSalary': 'Tu sueldo anual ({salary}) no alcanza para cubrir la tarifa anual de este agente ({fee}).',
    'agent.propertyOf': 'Propiedad de {club}',
    'agent.searchPlaceholder': 'Buscar club...',
    'agent.targetSet': '¡Declaraste públicamente tu deseo de jugar en {club}!',
    'agent.commSet': '¡Conseguiste un {pct}% de comisión en tu próxima transferencia!',
    'agent.transferRequested': '¡Tu agente pidió tu salida! Aumentó tu valor y visibilidad en el mercado.',
    'agent.raiseSecured': '¡Tu agente consiguió un aumento de sueldo a {salary}/año!',
    'agent.raiseDenied': 'La directiva del club rechazó un aumento de sueldo por el momento.',
    'note.transferCut': 'Cobró {amount} por comisión de transferencia ({pct}%)',
    'note.demandedRaise': 'El agente logró un aumento salarial a {salary}/año',
    'note.paidAgentFee': 'Se abonaron {amount} de gastos anuales a {name}',
    'note.ntAccepted': '¡Convocatoria internacional con la selección de {country}!',
    'note.ntDeclined': 'Rechazó la convocatoria a la selección de {country}',
    'note.ntSwitched': '¡Nacionalizado e integrado a la selección de {country}!',

    // Season result
    'sr.kicker': 'TEMPORADA {year} COMPLETADA',
    'sr.apps': 'PJ',
    'sr.saves': 'Atajadas',
    'sr.conceded': 'Recibidos',
    'sr.cleanSheets': 'Vallas invictas',
    'sr.goals': 'Goles',
    'sr.assists': 'Asistencias',
    'sr.avgRating': 'Puntaje promedio',
    'sr.intCaps': '🌍 {n} convocatorias internacionales',
    'sr.intCapsGoals': '🌍 {n} convocatorias · {g} goles con {country}',
    'sr.statsTitle': 'ESTADÍSTICAS Y EVOLUCIÓN DE TEMPORADA',
    'sr.ovr': 'GEN',
    'sr.value': 'Valor',
    'sr.legacy': 'Ver tu legado',
    'sr.startSeason': 'Iniciar temporada {n}',

    // Risk reveal
    'risk.good': 'BIEN',
    'risk.bad': 'MAL',
    'risk.deciding': 'El destino decide…',
    'risk.goodResult': 'La suerte sonríe.',
    'risk.badResult': 'Uy.',

    // Penalty mini
    'pen.kicker': 'EL PENAL',
    'pen.title': 'Elegí tu zona',
    'pen.sub': '{good} de {total} zonas le ganan al arquero',
    'pen.goal': '¡¡GOOOL!!',
    'pen.saved': '¡ATAJADO!',

    // Timing mini
    'timing.kicker': 'TODO ES TIMING',
    'timing.title': 'Frená el puntero en el verde',
    'timing.sub': 'Hacé clic en la barra (o presioná PATEAR) en el momento justo',
    'timing.strike': 'PATEAR',
    'timing.perfect': '¡PERFECTO!',
    'timing.close': 'Cerca...',
    'timing.justAbout': '¡Por poquito!',
    'timing.milesOff': 'Lejísimos.',

    // GK penalty mini
    'gk.kicker': 'ATAJADA DE PENAL',
    'gk.title': 'Elegí tu lado para tirarte',
    'gk.sub': '¡Predecí a dónde va a patear el delantero!',
    'gk.left': '⬅️ IZQUIERDA',
    'gk.center': '🧍 QUEDARSE',
    'gk.right': '➡️ DERECHA',
    'gk.saved': '🧤 ¡GRAN ATAJADA!',
    'gk.goal': '⚽ ¡GOL! Lado equivocado.',

    // NT call-up
    'nt.kicker': '🌍 SELECCIÓN INTERNACIONAL',
    'nt.title': '¡Convocado a {country}!',
    'nt.desc': '¡Tu gran nivel te ganó una convocatoria para representar a tu país en el escenario internacional! (Ranking FIFA #{rank})',
    'nt.debut': '🌍 Debut en la Selección',
    'nt.exposure': '🔥 Exposición Internacional',
    'nt.btn': 'Representar a Tu País',
    'nt.declineBtn': 'Rechazar Convocatoria',
    'nt.declinedNote': 'Rechazó la convocatoria a la selección de {country}. Mantiene elegibilidad para el futuro.',
    'nt.naturalizedNote': '¡Obtuvo la ciudadanía en {country} tras 5+ temporadas y se unió a la Selección!',

    // Shop
    'shop.kicker': 'TIENDA · NIVEL {tier} ({used}/{max} COMPRAS USADAS)',
    'shop.title': 'Consumibles',
    'shop.balance': 'Ganancias ahorradas: <b>{amount}</b> · {n} compra{s} disponible{s}',
    'shop.reroll': '🎲 Cambiar opciones (€50K)',
    'shop.purchased': 'COMPRADO',
    'shop.close': 'Cerrar',

    // Retire / confirm
    'retire.kicker': '¿COLGAR LOS BOTINES?',
    'retire.title': '¿Retirarse a los {age}?',
    'retire.warn': 'Esto termina la carrera inmediatamente. No hay vuelta atrás.',
    'retire.yes': 'Retirarse definitivamente',
    'retire.no': 'Seguir jugando',
    'restart.kicker': '¿EMPEZAR DE NUEVO?',
    'restart.title': '¿Borrar esta carrera?',
    'restart.text': '{name}, {age} años, temporada {n} — todo vuelve a las puertas de la academia.',
    'restart.warn': 'Esto borra la carrera guardada permanentemente. No hay vuelta atrás.',
    'restart.yes': 'Borrar y reiniciar',
    'btn.confirm': 'Confirmar',
    'btn.cancel': 'Cancelar',
    'btn.close': 'Cerrar',
    'import.failTitle': 'Error al importar',
    'import.failText': 'Ese archivo no parece una partida de Modo Carrera \'26. No pasó nada.',

    // Summary screen
    'summary.kicker': 'CARRERA COMPLETA · {n} TEMPORADA{s}',
    'summary.peakOvr': 'Mejor general',
    'summary.reachedIn': 'alcanzado en {year}',
    'summary.peakValue': 'Valor máximo de mercado',
    'summary.inYear': 'en {year}',
    'summary.savesLabel': 'Atajadas',
    'summary.cleanSheetsN': '{n} vallas invictas',
    'summary.goalsConceded': 'Goles recibidos',
    'summary.appsN': '{n} partidos',
    'summary.goalsLabel': 'Goles',
    'summary.assistsLabel': 'Asistencias',
    'summary.allComps': 'todas las competencias',
    'summary.earnings': 'Ganancias totales',
    'summary.onConsumables': '{amount} en consumibles',
    'summary.everyCent': 'cada centavo ahorrado',
    'summary.legacyScore': 'Puntaje de legado',
    'summary.legacyMetric': 'métrica del salón de la fama',
    'summary.trophyCabinet': 'Vitrina de Trofeos',
    'summary.trophiesN': '{n} trofeos',
    'summary.trLeague': 'Liga',
    'summary.trCup': 'Copa',
    'summary.trContinental': 'Continental',
    'summary.trCountry': 'Selección',
    'summary.bareShelves': 'Estantes vacíos. Los recuerdos fueron los verdaderos trofeos. (Los hinchas no opinan lo mismo.)',
    'summary.awards': 'Premios Individuales',
    'summary.intCareer': 'Carrera internacional',
    'summary.capsGoals': '{caps} convocatorias · {goals} goles',
    'summary.capsOnly': '{caps} convocatorias',
    'summary.noIntTrophies': 'Sin trofeos internacionales — la maldición de los cuartos de final fue real.',
    'summary.clubCareer': 'Carrera en clubes',
    'summary.newCareer': 'Nueva Carrera',

    // Retire blurbs
    'blurb.full': 'Una carrera completa. 40 años, no queda nada en el tanque. Inmortal.',
    'blurb.legend': 'Una leyenda que se va en la cima. Ya están haciendo las estatuas.',
    'blurb.star': 'Una estrella que iluminó cada cancha que pisó.',
    'blurb.pro': 'Un profesional respetado. Trabajo, sudor, honor — en ese orden.',
    'blurb.journeyman': 'El trotamundos definitivo. Una camiseta de cada color, una historia en cada ciudad.',
    'blurb.wonderkid': 'El gran "y si...". Se fue antes de que el mundo viera el show completo.',
    'blurb.quiet': 'Una carrera tranquila — pero cada pibe que lo vio creyó un poquito más.',

    // Stat names
    'stat.PAC': 'Velocidad',
    'stat.DRI': 'Regate',
    'stat.SHO': 'Tiro',
    'stat.MEN': 'Mental',
    'stat.PAS': 'Pase',
    'stat.PHY': 'Físico',
    'stat.REF': 'Reflejos',
    'stat.LEA': 'Liderazgo',
    'stat.VIS': 'Visión',
    'stat.COM': 'Compostura',

    // Position labels
    'pos.GK': 'Arquero',
    'pos.CB': 'Defensor Central',
    'pos.RB': 'Lateral Derecho',
    'pos.LB': 'Lateral Izquierdo',
    'pos.CM': 'Mediocampista',
    'pos.RM': 'Volante Derecho',
    'pos.LM': 'Volante Izquierdo',
    'pos.CAM': 'Mediapunta',
    'pos.RW': 'Extremo Derecho',
    'pos.LW': 'Extremo Izquierdo',
    'pos.ST': 'Delantero',

    // Booster outcome
    'boosterOut.bronze': 'Trabajo duro en el banco. Nadie aplaude los campamentos de entrenamiento — hasta que te ven jugar.',
    'boosterOut.silver': 'Trabajo serio, mejoras serias. Los técnicos notaron algo distinto en vos este verano.',
    'boosterOut.gold': 'Un campamento que cambia carreras. Volviste siendo otro jugador. El plantel lo notó el primer día.',

    // Shop outcome map
    'shopOut.default': 'Plata bien gastada. Probablemente.',
    'shopOut.Private Chef': 'Macros en punto. El nutricionista llora de emoción.',
    'shopOut.Hyperbaric Chamber Sessions': 'Salís del tubo sintiéndote de 18. Sin importar tu edad.',
    'shopOut.Elite Mental Coach': 'A la tercera sesión, empezás a visualizar el éxito en 4K.',
    'shopOut.Personal Video Analyst': 'Cada toque revisado. Los puntos débiles no tuvieron chance.',
    'shopOut.Personal Trainer': 'Te hace cargar una llanta cuesta arriba. La llanta ahora te tiene miedo.',
    'shopOut.PR & Brand Team': 'Tu nombre está en todos lados de repente. Hasta tu peluquero opina.',
    'shopOut.Physio Insurance Package': 'Un equipo de fisioterapeutas de nivel mundial te sigue. Las lesiones: oficialmente advertidas.',
    'shopOut.Custom Lab Boots': 'No pesan nada. Tocan la pelota como si fuera un imán. Armamento de guerra.',
    'shopOut.Mindfulness Retreat': 'Una semana de silencio. Volvés sin poder escuchar las críticas. Paz literal.',
    'shopOut.Super-Agent Package': 'Tu agente ahora tiene un traje más caro y tres teléfonos. Vienen ofertas.',

    // Language
    'lang.label': '🌐',
  };

  /* ---------- HELPERS ---------- */

  function nestedGet(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, obj);
  }

  function T(key, params) {
    var dict = currentLang === 'es' ? UI_ES : UI_EN;
    var val = dict[key];
    if (val === undefined) val = UI_EN[key];
    if (val === undefined) return key;
    if (params) {
      Object.keys(params).forEach(function (k) {
        val = val.replace(new RegExp('\\{' + k + '\\}', 'g'), String(params[k]));
      });
    }
    return val;
  }

  function TData(type, item, field) {
    if (!item) return '';
    if (currentLang === 'en') return nestedGet(item, field);
    var esData = root.I18N_ES;
    if (!esData) return nestedGet(item, field);
    var dict = esData[type + 's'];
    if (!dict || !dict[item.id]) return nestedGet(item, field);
    var val = nestedGet(dict[item.id], field);
    return val || nestedGet(item, field);
  }

  function TD(category, id, key) {
    if (typeof id === 'string') {
      if (currentLang === 'es' && root.I18N_ES && root.I18N_ES[category] && root.I18N_ES[category][id]) {
        var entry = root.I18N_ES[category][id];
        if (typeof entry === 'string') return entry;
        if (key && entry[key]) return entry[key];
      }
      return null;
    }
    return TData(category, id, key);
  }

  function riskOutcome(id, good) {
    if (currentLang === 'es' && root.I18N_ES && root.I18N_ES.riskOutcomes && root.I18N_ES.riskOutcomes[id]) {
      const o = root.I18N_ES.riskOutcomes[id];
      return good ? o.good : o.bad;
    }
    return null;
  }

  function headlines() {
    if (currentLang === 'es' && root.I18N_ES && root.I18N_ES.headlines) return root.I18N_ES.headlines;
    return root.GAME_DATA.HEADLINES;
  }

  function simLines() {
    if (currentLang === 'es' && root.I18N_ES && root.I18N_ES.simLines) return root.I18N_ES.simLines;
    return root.GAME_DATA.SIM_LINES;
  }

  function retirementQuotes() {
    if (currentLang === 'es' && root.I18N_ES && root.I18N_ES.retirementQuotes) return root.I18N_ES.retirementQuotes;
    return root.GAME_DATA.RETIREMENT_QUOTES;
  }

  function releasedReasons() {
    if (currentLang === 'es' && root.I18N_ES && root.I18N_ES.releasedReasons) return root.I18N_ES.releasedReasons;
    return null;
  }

  function setLang(code) {
    currentLang = code;
    try { localStorage.setItem('cm26-lang', code); } catch (e) { /* ignore */ }
  }

  function getLang() { return currentLang; }

  const COUNTRY_NAMES_ES = {
    'Germany': 'Alemania', 'England': 'Inglaterra', 'Spain': 'España', 'Italy': 'Italia', 'France': 'Francia',
    'Portugal': 'Portugal', 'Netherlands': 'Países Bajos', 'Brazil': 'Brasil', 'Argentina': 'Argentina',
    'Uruguay': 'Uruguay', 'Colombia': 'Colombia', 'Chile': 'Chile', 'Mexico': 'México', 'USA': 'EE. UU.',
    'Japan': 'Japón', 'Saudi Arabia': 'Arabia Saudita', 'Turkey': 'Turquía', 'Belgium': 'Bélgica',
    'Austria': 'Austria', 'Switzerland': 'Suiza', 'Croatia': 'Croacia', 'Denmark': 'Dinamarca',
    'Norway': 'Noruega', 'Sweden': 'Suecia', 'Scotland': 'Escocia', 'Greece': 'Grecia', 'Poland': 'Polonia',
    'Czech Rep.': 'República Checa', 'Senegal': 'Senegal', 'Morocco': 'Marruecos', 'Egypt': 'Egipto',
    'Ivory Coast': 'Costa de Marfil', 'Ghana': 'Ghana', 'Nigeria': 'Nigeria', 'Cameroon': 'Camerún',
    'South Korea': 'Corea del Sur', 'Australia': 'Australia', 'Paraguay': 'Paraguay', 'Ecuador': 'Ecuador',
    'Peru': 'Perú', 'Venezuela': 'Venezuela', 'Bolivia': 'Bolivia', 'Ukraine': 'Ucrania', 'Serbia': 'Serbia',
    'Romania': 'Rumania', 'South Africa': 'Sudáfrica', 'Qatar': 'Catar', 'UAE': 'EAU',
  };

  function TCountry(name) {
    if (!name) return '';
    if (currentLang === 'es' && COUNTRY_NAMES_ES[name]) return COUNTRY_NAMES_ES[name];
    return name;
  }

  root.I18n = {
    T: T, TData: TData, TD: TD, TCountry: TCountry, riskOutcome: riskOutcome, setLang: setLang, getLang: getLang,
    headlines: headlines, simLines: simLines, retirementQuotes: retirementQuotes, releasedReasons: releasedReasons
  };
})(typeof window !== 'undefined' ? window : globalThis);
