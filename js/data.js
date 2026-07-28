/* ============================================================
   CAREER MODE '26 — static game data
   Countries (FIFA top 50), clubs, positions, decision cards,
   training boosters, flavour text.
   ============================================================ */
(function (root) {
  'use strict';

  const FIELD_STATS = [
    { k: 'PAC', name: 'Pace' },
    { k: 'DRI', name: 'Dribbling' },
    { k: 'SHO', name: 'Shot' },
    { k: 'MEN', name: 'Mental' },
    { k: 'PAS', name: 'Passing' },
    { k: 'PHY', name: 'Physical' },
  ];

  const GK_STATS = [
    { k: 'PAC', name: 'Pace' },
    { k: 'PAS', name: 'Passing' },
    { k: 'REF', name: 'Reflexes' },
    { k: 'LEA', name: 'Leadership' },
    { k: 'VIS', name: 'Vision' },
    { k: 'COM', name: 'Composure' },
  ];

  const POSITIONS = [
    { id: 'GK',  label: 'Goalkeeper',      gk: true },
    { id: 'CB',  label: 'Centre Back' },
    { id: 'RB',  label: 'Right Back' },
    { id: 'LB',  label: 'Left Back' },
    { id: 'CM',  label: 'Central Mid' },
    { id: 'RM',  label: 'Right Mid' },
    { id: 'LM',  label: 'Left Mid' },
    { id: 'CAM', label: 'Attacking Mid' },
    { id: 'RW',  label: 'Right Winger' },
    { id: 'LW',  label: 'Left Winger' },
    { id: 'ST',  label: 'Striker' },
  ];

  // Overall rating weights per position (must sum to 1)
  const OVR_WEIGHTS = {
    GK:  { REF: .30, COM: .20, VIS: .15, LEA: .15, PAS: .10, PAC: .10 },
    CB:  { PHY: .30, MEN: .25, PAC: .20, PAS: .15, DRI: .10 },
    RB:  { PAC: .30, PHY: .20, PAS: .20, DRI: .15, MEN: .15 },
    LB:  { PAC: .30, PHY: .20, PAS: .20, DRI: .15, MEN: .15 },
    CM:  { PAS: .30, MEN: .20, DRI: .15, PHY: .15, SHO: .10, PAC: .10 },
    RM:  { PAC: .25, PAS: .25, DRI: .20, SHO: .15, MEN: .15 },
    LM:  { PAC: .25, PAS: .25, DRI: .20, SHO: .15, MEN: .15 },
    CAM: { PAS: .30, DRI: .20, SHO: .20, MEN: .15, PAC: .15 },
    RW:  { PAC: .25, DRI: .25, SHO: .20, PAS: .15, MEN: .10, PHY: .05 },
    LW:  { PAC: .25, DRI: .25, SHO: .20, PAS: .15, MEN: .10, PHY: .05 },
    ST:  { SHO: .30, PAC: .20, DRI: .20, PHY: .10, MEN: .10, PAS: .10 },
  };

  // Attacking output (per-90 base rates at OVR ~85)
  const ATTACK_RATES = {
    GK:  { g: 0.00, a: 0.01 },
    CB:  { g: 0.04, a: 0.03 },
    RB:  { g: 0.03, a: 0.07 },
    LB:  { g: 0.03, a: 0.07 },
    CM:  { g: 0.13, a: 0.14 },
    RM:  { g: 0.16, a: 0.18 },
    LM:  { g: 0.16, a: 0.18 },
    CAM: { g: 0.28, a: 0.26 },
    RW:  { g: 0.36, a: 0.24 },
    LW:  { g: 0.36, a: 0.24 },
    ST:  { g: 0.58, a: 0.14 },
  };

  /* ----------------------------------------------------------
     COUNTRIES — FIFA ranking top 50.
     c = flagcdn code, confed, league name, domestic cup name,
     clubs: n = name, s = strength 60-97, b = badge search alias
     ---------------------------------------------------------- */
  const COUNTRIES = [
    { id: 'AR', name: 'Argentina', code: 'ar', rank: 1, confed: 'CONMEBOL', league: 'Primera División', cup: 'Copa Argentina', clubs: [
      { n: 'River Plate', s: 84 }, { n: 'Boca Juniors', s: 83 }, { n: 'Racing Club', s: 78, b: 'Racing Club' },
      { n: 'Independiente', s: 77 }, { n: 'San Lorenzo', s: 76 }, { n: 'Estudiantes', s: 76, b: 'Estudiantes La Plata' },
      { n: 'Vélez Sarsfield', s: 75, b: 'Velez Sarsfield' }, { n: 'Talleres', s: 75 },
      { n: 'Lanús', s: 74, b: 'Lanus' }, { n: 'Newell\'s', s: 73, b: 'Newells Old Boys' }, { n: 'Rosario Central', s: 73 },
      { n: 'Defensa y Justicia', s: 72 }, { n: 'Huracán', s: 72, b: 'Huracan' }, { n: 'Argentinos Juniors', s: 71 },
      { n: 'Godoy Cruz', s: 71 }, { n: 'Belgrano', s: 70 } ] },
    { id: 'FR', name: 'France', code: 'fr', rank: 2, confed: 'UEFA', league: 'Ligue 1', cup: 'Coupe de France', clubs: [
      { n: 'Paris Saint-Germain', s: 90, b: 'Paris SG' }, { n: 'Marseille', s: 82, b: 'Olympique Marseille' },
      { n: 'Monaco', s: 81, b: 'AS Monaco' }, { n: 'Lyon', s: 80, b: 'Olympique Lyon' },
      { n: 'Lille', s: 79 }, { n: 'Nice', s: 78, b: 'OGC Nice' },
      { n: 'Lens', s: 78, b: 'RC Lens' }, { n: 'Rennes', s: 77, b: 'Stade Rennais' }, { n: 'Strasbourg', s: 76 },
      { n: 'Toulouse', s: 75 }, { n: 'Nantes', s: 74 }, { n: 'Brest', s: 74, b: 'Stade Brestois' },
      { n: 'Montpellier', s: 72 }, { n: 'Auxerre', s: 72 }, { n: 'Lorient', s: 71 }, { n: 'Le Havre', s: 71 },
      { n: 'Angers', s: 70 }, { n: 'Metz', s: 70 } ] },
    { id: 'ES', name: 'Spain', code: 'es', rank: 3, confed: 'UEFA', league: 'LaLiga', cup: 'Copa del Rey', clubs: [
      { n: 'Real Madrid', s: 93 }, { n: 'Barcelona', s: 91, b: 'FC Barcelona' },
      { n: 'Atlético Madrid', s: 87, b: 'Atletico Madrid' }, { n: 'Athletic Club', s: 82, b: 'Athletic Bilbao' },
      { n: 'Villarreal', s: 81 }, { n: 'Real Sociedad', s: 81 }, { n: 'Real Betis', s: 79 }, { n: 'Sevilla', s: 79 },
      { n: 'Valencia', s: 78 }, { n: 'Girona', s: 78 }, { n: 'Celta Vigo', s: 76 }, { n: 'Osasuna', s: 75 },
      { n: 'Getafe', s: 74 }, { n: 'Espanyol', s: 74 }, { n: 'Mallorca', s: 74 }, { n: 'Rayo Vallecano', s: 74 },
      { n: 'Alavés', s: 73, b: 'Alaves' }, { n: 'Las Palmas', s: 72 }, { n: 'Levante', s: 71 }, { n: 'Elche', s: 70 } ] },
    { id: 'EN', name: 'England', code: 'gb-eng', rank: 4, confed: 'UEFA', league: 'Premier League', cup: 'FA Cup', clubs: [
      { n: 'Manchester City', s: 92 }, { n: 'Arsenal', s: 90 }, { n: 'Liverpool', s: 90 },
      { n: 'Chelsea', s: 86 }, { n: 'Tottenham', s: 84, b: 'Tottenham Hotspur' }, { n: 'Newcastle', s: 84, b: 'Newcastle United' },
      { n: 'Manchester United', s: 84 }, { n: 'Aston Villa', s: 83 }, { n: 'Brighton', s: 81, b: 'Brighton & Hove Albion' },
      { n: 'West Ham', s: 79, b: 'West Ham United' },
      { n: 'Crystal Palace', s: 78 }, { n: 'Fulham', s: 77 }, { n: 'Bournemouth', s: 77, b: 'AFC Bournemouth' },
      { n: 'Brentford', s: 77 }, { n: 'Everton', s: 76 }, { n: 'Nottingham Forest', s: 76 },
      { n: 'Wolves', s: 75, b: 'Wolverhampton Wanderers' }, { n: 'Leicester', s: 74, b: 'Leicester City' },
      { n: 'Leeds', s: 74, b: 'Leeds United' }, { n: 'Sunderland', s: 73 } ] },
    { id: 'BR', name: 'Brazil', code: 'br', rank: 5, confed: 'CONMEBOL', league: 'Série A', cup: 'Copa do Brasil', clubs: [
      { n: 'Flamengo', s: 83 }, { n: 'Palmeiras', s: 83 }, { n: 'Botafogo', s: 80 },
      { n: 'Corinthians', s: 80 }, { n: 'São Paulo', s: 79, b: 'Sao Paulo' }, { n: 'Atlético Mineiro', s: 79, b: 'Atletico Mineiro' },
      { n: 'Fluminense', s: 78 }, { n: 'Grêmio', s: 78, b: 'Gremio' }, { n: 'Santos', s: 76 },
      { n: 'Internacional', s: 77 }, { n: 'Cruzeiro', s: 77 }, { n: 'Athletico-PR', s: 76, b: 'Athletico Paranaense' },
      { n: 'Bahia', s: 75 }, { n: 'Vasco', s: 75, b: 'Vasco da Gama' }, { n: 'Fortaleza', s: 74 },
      { n: 'Bragantino', s: 74, b: 'Red Bull Bragantino' }, { n: 'Ceará', s: 71, b: 'Ceara' },
      { n: 'Juventude', s: 70 }, { n: 'Vitória', s: 70, b: 'Vitoria' }, { n: 'Sport Recife', s: 70 } ] },
    { id: 'PT', name: 'Portugal', code: 'pt', rank: 6, confed: 'UEFA', league: 'Primeira Liga', cup: 'Taça de Portugal', clubs: [
      { n: 'Sporting CP', s: 85, b: 'Sporting CP' }, { n: 'Benfica', s: 85, b: 'SL Benfica' },
      { n: 'Porto', s: 84, b: 'FC Porto' }, { n: 'Braga', s: 79, b: 'Sporting Braga' },
      { n: 'Vitória Guimarães', s: 76, b: 'Vitoria Guimaraes' },
      { n: 'Famalicão', s: 73, b: 'Famalicao' }, { n: 'Estoril', s: 71 }, { n: 'Casa Pia', s: 71 },
      { n: 'Santa Clara', s: 71 }, { n: 'Gil Vicente', s: 70 }, { n: 'Rio Ave', s: 70 },
      { n: 'Moreirense', s: 70 }, { n: 'Arouca', s: 70 }, { n: 'Nacional Madeira', s: 69, b: 'Nacional' },
      { n: 'Estrela', s: 68, b: 'Estrela Amadora' }, { n: 'Alverca', s: 68 }, { n: 'Farense', s: 68 }, { n: 'AVS', s: 67 } ] },
    { id: 'NL', name: 'Netherlands', code: 'nl', rank: 7, confed: 'UEFA', league: 'Eredivisie', cup: 'KNVB Cup', clubs: [
      { n: 'Ajax', s: 83 }, { n: 'PSV', s: 83, b: 'PSV Eindhoven' }, { n: 'Feyenoord', s: 82 },
      { n: 'AZ Alkmaar', s: 78 }, { n: 'Utrecht', s: 75, b: 'FC Utrecht' },
      { n: 'Twente', s: 76, b: 'FC Twente' }, { n: 'NEC', s: 73, b: 'NEC Nijmegen' }, { n: 'Go Ahead Eagles', s: 72 },
      { n: 'Sparta Rotterdam', s: 72 }, { n: 'Heerenveen', s: 72 }, { n: 'Groningen', s: 71 },
      { n: 'Willem II', s: 70 }, { n: 'Heracles', s: 69 }, { n: 'NAC Breda', s: 69 },
      { n: 'Fortuna Sittard', s: 69 }, { n: 'Zwolle', s: 69, b: 'PEC Zwolle' }, { n: 'Volendam', s: 67 }, { n: 'Telstar', s: 66 } ] },
    { id: 'BE', name: 'Belgium', code: 'be', rank: 8, confed: 'UEFA', league: 'Pro League', cup: 'Belgian Cup', clubs: [
      { n: 'Club Brugge', s: 80 }, { n: 'Union Saint-Gilloise', s: 78, b: 'Union St Gilloise' },
      { n: 'Anderlecht', s: 78 }, { n: 'Genk', s: 77 }, { n: 'Gent', s: 76, b: 'KAA Gent' },
      { n: 'Antwerp', s: 76 }, { n: 'Standard Liège', s: 74, b: 'Standard Liege' }, { n: 'Charleroi', s: 72 },
      { n: 'Mechelen', s: 72, b: 'KV Mechelen' }, { n: 'Cercle Brugge', s: 71 }, { n: 'OH Leuven', s: 71 },
      { n: 'Sint-Truiden', s: 70 }, { n: 'Westerlo', s: 69 }, { n: 'Zulte Waregem', s: 69 }, { n: 'Dender', s: 67 } ] },
    { id: 'IT', name: 'Italy', code: 'it', rank: 9, confed: 'UEFA', league: 'Serie A', cup: 'Coppa Italia', clubs: [
      { n: 'Inter', s: 90 }, { n: 'Napoli', s: 87 }, { n: 'Juventus', s: 86 }, { n: 'Milan', s: 86, b: 'AC Milan' },
      { n: 'Atalanta', s: 85 }, { n: 'Roma', s: 83, b: 'AS Roma' }, { n: 'Lazio', s: 82 },
      { n: 'Fiorentina', s: 81 }, { n: 'Bologna', s: 80 }, { n: 'Torino', s: 77 },
      { n: 'Como', s: 76 }, { n: 'Udinese', s: 75 }, { n: 'Genoa', s: 74 }, { n: 'Parma', s: 74 },
      { n: 'Empoli', s: 73 }, { n: 'Sassuolo', s: 73 }, { n: 'Cagliari', s: 73 }, { n: 'Verona', s: 72, b: 'Hellas Verona' },
      { n: 'Lecce', s: 72 }, { n: 'Pisa', s: 70 }, { n: 'Cremonese', s: 70 } ] },
    { id: 'DE', name: 'Germany', code: 'de', rank: 10, confed: 'UEFA', league: 'Bundesliga', cup: 'DFB-Pokal', clubs: [
      { n: 'Bayern Munich', s: 91 }, { n: 'Bayer Leverkusen', s: 87, b: 'Bayer 04 Leverkusen' },
      { n: 'Borussia Dortmund', s: 86 }, { n: 'RB Leipzig', s: 84 }, { n: 'Stuttgart', s: 82, b: 'VfB Stuttgart' },
      { n: 'Eintracht Frankfurt', s: 81 }, { n: 'Wolfsburg', s: 78, b: 'VfL Wolfsburg' },
      { n: 'Gladbach', s: 78, b: 'Borussia Monchengladbach' },
      { n: 'Freiburg', s: 79, b: 'SC Freiburg' }, { n: 'Hoffenheim', s: 77 }, { n: 'Mainz', s: 76 },
      { n: 'Union Berlin', s: 76 }, { n: 'Werder Bremen', s: 75 }, { n: 'Augsburg', s: 74 },
      { n: 'Köln', s: 73, b: 'FC Koln' }, { n: 'Hamburg', s: 73, b: 'Hamburger SV' },
      { n: 'Heidenheim', s: 72 }, { n: 'St. Pauli', s: 72 } ] },
    { id: 'HR', name: 'Croatia', code: 'hr', rank: 11, confed: 'UEFA', league: 'HNL', cup: 'Croatian Cup', clubs: [
      { n: 'Dinamo Zagreb', s: 77 }, { n: 'Hajduk Split', s: 74 }, { n: 'Rijeka', s: 73, b: 'HNK Rijeka' },
      { n: 'Osijek', s: 70 }, { n: 'Lokomotiva Zagreb', s: 68 }, { n: 'Varaždin', s: 67, b: 'NK Varazdin' },
      { n: 'Slaven Belupo', s: 66 }, { n: 'Istra 1961', s: 66 }, { n: 'Gorica', s: 65, b: 'HNK Gorica' }, { n: 'Vukovar 91', s: 63 } ] },
    { id: 'MA', name: 'Morocco', code: 'ma', rank: 12, confed: 'CAF', league: 'Botola', cup: 'Coupe du Trône', clubs: [
      { n: 'Wydad', s: 72, b: 'Wydad Casablanca' }, { n: 'Raja', s: 72, b: 'Raja Casablanca' },
      { n: 'RS Berkane', s: 70 }, { n: 'FUS Rabat', s: 68 },
      { n: 'FAR Rabat', s: 70 }, { n: 'Maghreb Fès', s: 67, b: 'Maghreb Fez' }, { n: 'Ittihad Tanger', s: 66 },
      { n: 'OC Safi', s: 66 }, { n: 'Difaâ El Jadida', s: 65, b: 'Difaa El Jadida' }, { n: 'Hassania Agadir', s: 65 },
      { n: 'Moghreb Tétouan', s: 65, b: 'Moghreb Tetouan' }, { n: 'Chabab Mohammedia', s: 64 },
      { n: 'Union Touarga', s: 64 }, { n: 'Renaissance Zemamra', s: 63 } ] },
    { id: 'UY', name: 'Uruguay', code: 'uy', rank: 13, confed: 'CONMEBOL', league: 'Primera División', cup: 'Copa Uruguay', clubs: [
      { n: 'Nacional', s: 75, b: 'Club Nacional' }, { n: 'Peñarol', s: 75, b: 'Penarol' },
      { n: 'Defensor Sporting', s: 70 }, { n: 'Danubio', s: 69 },
      { n: 'Liverpool Montevideo', s: 70 }, { n: 'Cerro Largo', s: 68 }, { n: 'Boston River', s: 68 },
      { n: 'Racing Montevideo', s: 67 }, { n: 'River Plate Montevideo', s: 67 }, { n: 'Wanderers', s: 67, b: 'Montevideo Wanderers' },
      { n: 'Plaza Colonia', s: 66 }, { n: 'Fénix', s: 65, b: 'Fenix' }, { n: 'Deportivo Maldonado', s: 65 }, { n: 'Juventud', s: 64 } ] },
    { id: 'CO', name: 'Colombia', code: 'co', rank: 14, confed: 'CONMEBOL', league: 'Liga BetPlay', cup: 'Copa Colombia', clubs: [
      { n: 'Atlético Nacional', s: 75, b: 'Atletico Nacional' }, { n: 'Millonarios', s: 74 },
      { n: 'América de Cali', s: 73, b: 'America de Cali' }, { n: 'Junior', s: 73, b: 'Junior Barranquilla' },
      { n: 'Deportes Tolima', s: 71 },
      { n: 'Deportivo Cali', s: 72 }, { n: 'Santa Fe', s: 72, b: 'Independiente Santa Fe' },
      { n: 'Independiente Medellín', s: 72, b: 'Independiente Medellin' }, { n: 'Bucaramanga', s: 70, b: 'Atletico Bucaramanga' },
      { n: 'Once Caldas', s: 70 }, { n: 'Deportivo Pasto', s: 69 }, { n: 'La Equidad', s: 69 },
      { n: 'Águilas Doradas', s: 68, b: 'Aguilas Doradas' }, { n: 'Deportivo Pereira', s: 68 },
      { n: 'Envigado', s: 67 }, { n: 'Alianza', s: 66, b: 'Alianza FC' } ] },
    { id: 'MX', name: 'Mexico', code: 'mx', rank: 15, confed: 'CONCACAF', league: 'Liga MX', cup: 'Copa MX', clubs: [
      { n: 'América', s: 78, b: 'Club America' }, { n: 'Tigres', s: 77, b: 'Tigres UANL' },
      { n: 'Monterrey', s: 77 }, { n: 'Cruz Azul', s: 76 }, { n: 'Toluca', s: 75 },
      { n: 'Chivas', s: 75, b: 'Guadalajara' }, { n: 'Pumas', s: 74, b: 'Pumas UNAM' }, { n: 'León', s: 74, b: 'Club Leon' },
      { n: 'Pachuca', s: 74 }, { n: 'Santos Laguna', s: 73 }, { n: 'Atlas', s: 72 }, { n: 'Necaxa', s: 71 },
      { n: 'Puebla', s: 70 }, { n: 'Tijuana', s: 70 }, { n: 'Querétaro', s: 70, b: 'Queretaro' },
      { n: 'Juárez', s: 69, b: 'FC Juarez' }, { n: 'Mazatlán', s: 69, b: 'Mazatlan' }, { n: 'Atlético San Luis', s: 69, b: 'Atletico San Luis' } ] },
    { id: 'US', name: 'United States', code: 'us', rank: 16, confed: 'CONCACAF', league: 'MLS', cup: 'US Open Cup', clubs: [
      { n: 'Inter Miami', s: 77 }, { n: 'LAFC', s: 76, b: 'Los Angeles FC' }, { n: 'LA Galaxy', s: 75 },
      { n: 'Columbus Crew', s: 75 }, { n: 'Seattle Sounders', s: 74 }, { n: 'Atlanta United', s: 74 },
      { n: 'NYCFC', s: 73, b: 'New York City FC' },
      { n: 'Cincinnati', s: 74, b: 'FC Cincinnati' }, { n: 'Orlando City', s: 73 }, { n: 'Philadelphia Union', s: 72 },
      { n: 'Austin FC', s: 72 }, { n: 'Nashville SC', s: 72 }, { n: 'Portland Timbers', s: 72 },
      { n: 'Real Salt Lake', s: 71 }, { n: 'Sporting KC', s: 71, b: 'Sporting Kansas City' }, { n: 'Houston Dynamo', s: 71 },
      { n: 'Minnesota United', s: 71 }, { n: 'DC United', s: 70 }, { n: 'Chicago Fire', s: 70 },
      { n: 'Charlotte FC', s: 70 }, { n: 'San Jose Earthquakes', s: 69 } ] },
    { id: 'CH', name: 'Switzerland', code: 'ch', rank: 17, confed: 'UEFA', league: 'Super League', cup: 'Swiss Cup', clubs: [
      { n: 'Young Boys', s: 76 }, { n: 'Basel', s: 74, b: 'FC Basel' }, { n: 'Servette', s: 73 },
      { n: 'St. Gallen', s: 72, b: 'FC St Gallen' }, { n: 'Zürich', s: 72, b: 'FC Zurich' },
      { n: 'Lugano', s: 73 }, { n: 'Luzern', s: 72 }, { n: 'Sion', s: 69 }, { n: 'Grasshoppers', s: 69 },
      { n: 'Lausanne', s: 69 }, { n: 'Thun', s: 67 }, { n: 'Winterthur', s: 66 }, { n: 'Yverdon', s: 65 } ] },
    { id: 'JP', name: 'Japan', code: 'jp', rank: 18, confed: 'AFC', league: 'J1 League', cup: "Emperor's Cup", clubs: [
      { n: 'Vissel Kobe', s: 73 }, { n: 'Kawasaki Frontale', s: 73 }, { n: 'Yokohama F. Marinos', s: 73, b: 'Yokohama F Marinos' },
      { n: 'Kashima Antlers', s: 72 }, { n: 'Urawa Red Diamonds', s: 72 }, { n: 'Gamba Osaka', s: 71 },
      { n: 'Sanfrecce Hiroshima', s: 72 }, { n: 'Cerezo Osaka', s: 71 }, { n: 'FC Tokyo', s: 70 },
      { n: 'Nagoya Grampus', s: 70 }, { n: 'Kashiwa Reysol', s: 70 }, { n: 'Shimizu S-Pulse', s: 68 },
      { n: 'Kyoto Sanga', s: 68 }, { n: 'Avispa Fukuoka', s: 68 }, { n: 'Consadole Sapporo', s: 68 },
      { n: 'Albirex Niigata', s: 67 }, { n: 'Sagan Tosu', s: 67 }, { n: 'Shonan Bellmare', s: 67 } ] },
    { id: 'SN', name: 'Senegal', code: 'sn', rank: 19, confed: 'CAF', league: 'Ligue 1', cup: 'Coupe du Sénégal', clubs: [
      { n: 'Génération Foot', s: 66, b: 'Generation Foot' }, { n: 'ASC Jaraaf', s: 64 },
      { n: 'Teungueth FC', s: 63 }, { n: 'Casa Sports', s: 62 },
      { n: 'Diambars', s: 63 }, { n: 'Dakar Sacré-Cœur', s: 62, b: 'Dakar Sacre-Coeur' }, { n: 'AS Pikine', s: 62 },
      { n: 'Guédiawaye', s: 61, b: 'Guediawaye' }, { n: 'Stade de Mbour', s: 60 }, { n: 'US Gorée', s: 60, b: 'US Goree' },
      { n: 'Ndiambour', s: 59 }, { n: 'Sonacos', s: 59 } ] },
    { id: 'DK', name: 'Denmark', code: 'dk', rank: 20, confed: 'UEFA', league: 'Superliga', cup: 'Danish Cup', clubs: [
      { n: 'Copenhagen', s: 77, b: 'FC Copenhagen' }, { n: 'Midtjylland', s: 76, b: 'FC Midtjylland' },
      { n: 'Brøndby', s: 74, b: 'Brondby' }, { n: 'Nordsjælland', s: 74, b: 'FC Nordsjaelland' }, { n: 'Aarhus', s: 71, b: 'AGF Aarhus' },
      { n: 'Randers', s: 71 }, { n: 'Silkeborg', s: 70 }, { n: 'Viborg', s: 69 }, { n: 'OB', s: 69, b: 'Odense BK' },
      { n: 'Sønderjyske', s: 68, b: 'Sonderjyske' }, { n: 'Lyngby', s: 67 }, { n: 'Vejle', s: 66 } ] },
    { id: 'AT', name: 'Austria', code: 'at', rank: 21, confed: 'UEFA', league: 'Bundesliga', cup: 'Austrian Cup', clubs: [
      { n: 'Red Bull Salzburg', s: 79 }, { n: 'Sturm Graz', s: 76 }, { n: 'Rapid Wien', s: 74, b: 'Rapid Vienna' },
      { n: 'Austria Wien', s: 73, b: 'Austria Vienna' }, { n: 'LASK', s: 73 },
      { n: 'Wolfsberger', s: 72, b: 'Wolfsberger AC' }, { n: 'Hartberg', s: 69 }, { n: 'Austria Klagenfurt', s: 68 },
      { n: 'WSG Tirol', s: 68 }, { n: 'Ried', s: 68, b: 'SV Ried' }, { n: 'Altach', s: 68, b: 'Rheindorf Altach' },
      { n: 'Blau-Weiß Linz', s: 67, b: 'Blau-Weiss Linz' } ] },
    { id: 'UA', name: 'Ukraine', code: 'ua', rank: 22, confed: 'UEFA', league: 'Premier League', cup: 'Ukrainian Cup', clubs: [
      { n: 'Shakhtar', s: 78, b: 'Shakhtar Donetsk' }, { n: 'Dynamo Kyiv', s: 76 },
      { n: 'Dnipro-1', s: 72 }, { n: 'Zorya', s: 71, b: 'Zorya Luhansk' },
      { n: 'Oleksandriya', s: 70 }, { n: 'Polissya Zhytomyr', s: 69 }, { n: 'Kryvbas', s: 69 },
      { n: 'Kolos Kovalivka', s: 68 }, { n: 'Vorskla Poltava', s: 67 }, { n: 'Rukh Lviv', s: 67 },
      { n: 'LNZ Cherkasy', s: 66 }, { n: 'Veres Rivne', s: 66 }, { n: 'Obolon Kyiv', s: 65 }, { n: 'Chornomorets Odesa', s: 65 } ] },
    { id: 'KR', name: 'Korea Republic', code: 'kr', rank: 23, confed: 'AFC', league: 'K League 1', cup: 'Korean FA Cup', clubs: [
      { n: 'Ulsan HD', s: 73, b: 'Ulsan Hyundai' }, { n: 'Jeonbuk', s: 72, b: 'Jeonbuk Hyundai Motors' },
      { n: 'FC Seoul', s: 71 }, { n: 'Pohang Steelers', s: 71 },
      { n: 'Gimcheon Sangmu', s: 70 }, { n: 'Gwangju FC', s: 69 }, { n: 'Suwon Samsung', s: 69 },
      { n: 'Daegu FC', s: 68 }, { n: 'Daejeon Hana Citizen', s: 68 }, { n: 'Gangwon FC', s: 68 },
      { n: 'Jeju United', s: 67 }, { n: 'Incheon United', s: 67 } ] },
    { id: 'EC', name: 'Ecuador', code: 'ec', rank: 24, confed: 'CONMEBOL', league: 'LigaPro', cup: 'Copa Ecuador', clubs: [
      { n: 'LDU Quito', s: 74 }, { n: 'Independiente del Valle', s: 74 }, { n: 'Barcelona SC', s: 73, b: 'Barcelona Guayaquil' },
      { n: 'Emelec', s: 72 },
      { n: 'Aucas', s: 70 }, { n: 'Universidad Católica Quito', s: 70, b: 'Universidad Catolica Quito' },
      { n: 'Delfín', s: 69, b: 'Delfin' }, { n: 'Deportivo Cuenca', s: 68 }, { n: 'Técnico Universitario', s: 68, b: 'Tecnico Universitario' },
      { n: 'Orense', s: 67 }, { n: 'Macará', s: 67, b: 'Macara' }, { n: 'Mushuc Runa', s: 66 } ] },
    { id: 'AU', name: 'Australia', code: 'au', rank: 25, confed: 'AFC', league: 'A-League', cup: 'Australia Cup', clubs: [
      { n: 'Sydney FC', s: 70 }, { n: 'Melbourne City', s: 70 }, { n: 'Melbourne Victory', s: 69 },
      { n: 'Central Coast Mariners', s: 68 },
      { n: 'Western Sydney', s: 68, b: 'Western Sydney Wanderers' }, { n: 'Adelaide United', s: 68 },
      { n: 'Wellington Phoenix', s: 67 }, { n: 'Brisbane Roar', s: 67 }, { n: 'Newcastle Jets', s: 66 },
      { n: 'Macarthur FC', s: 66 }, { n: 'Perth Glory', s: 66 }, { n: 'Western United', s: 65 } ] },
    { id: 'TR', name: 'Türkiye', code: 'tr', rank: 26, confed: 'UEFA', league: 'Süper Lig', cup: 'Turkish Cup', clubs: [
      { n: 'Galatasaray', s: 82 }, { n: 'Fenerbahçe', s: 82, b: 'Fenerbahce' }, { n: 'Beşiktaş', s: 79, b: 'Besiktas' },
      { n: 'Trabzonspor', s: 77 }, { n: 'Başakşehir', s: 74, b: 'Istanbul Basaksehir' },
      { n: 'Samsunspor', s: 73 }, { n: 'Göztepe', s: 72, b: 'Goztepe' }, { n: 'Konyaspor', s: 72 },
      { n: 'Rizespor', s: 71, b: 'Caykur Rizespor' }, { n: 'Antalyaspor', s: 71 }, { n: 'Kasımpaşa', s: 71, b: 'Kasimpasa' },
      { n: 'Sivasspor', s: 71 }, { n: 'Eyüpspor', s: 71, b: 'Eyupspor' }, { n: 'Adana Demirspor', s: 70 },
      { n: 'Alanyaspor', s: 70 }, { n: 'Gaziantep', s: 70 }, { n: 'Kayserispor', s: 70 }, { n: 'Gençlerbirliği', s: 69, b: 'Genclerbirligi' } ] },
    { id: 'SE', name: 'Sweden', code: 'se', rank: 27, confed: 'UEFA', league: 'Allsvenskan', cup: 'Svenska Cupen', clubs: [
      { n: 'Malmö FF', s: 74, b: 'Malmo FF' }, { n: 'Hammarby', s: 71 }, { n: 'Djurgården', s: 71, b: 'Djurgardens IF' },
      { n: 'AIK', s: 70, b: 'AIK Stockholm' },
      { n: 'Elfsborg', s: 72, b: 'IF Elfsborg' }, { n: 'Häcken', s: 71, b: 'BK Hacken' }, { n: 'Norrköping', s: 69 },
      { n: 'IFK Göteborg', s: 69, b: 'IFK Goteborg' }, { n: 'GAIS', s: 68 }, { n: 'Sirius', s: 68, b: 'IK Sirius' },
      { n: 'Brommapojkarna', s: 67 }, { n: 'Värnamo', s: 66, b: 'IFK Varnamo' }, { n: 'Halmstad', s: 66 }, { n: 'Öster', s: 65, b: 'Oster' } ] },
    { id: 'WA', name: 'Wales', code: 'gb-wls', rank: 28, confed: 'UEFA', league: 'Cymru Premier', cup: 'Welsh Cup', clubs: [
      { n: 'The New Saints', s: 62 }, { n: 'Connah\'s Quay', s: 60, b: 'Connahs Quay Nomads' },
      { n: 'Penybont', s: 58 }, { n: 'Bala Town', s: 57 },
      { n: 'Cardiff MU', s: 57 }, { n: 'Caernarfon', s: 56 }, { n: 'Newtown', s: 56 },
      { n: 'Barry Town', s: 55 }, { n: 'Haverfordwest', s: 55 }, { n: 'Flint Town', s: 54, b: 'Flint Town United' } ] },
    { id: 'PL', name: 'Poland', code: 'pl', rank: 29, confed: 'UEFA', league: 'Ekstraklasa', cup: 'Polish Cup', clubs: [
      { n: 'Legia Warsaw', s: 73 }, { n: 'Raków', s: 73, b: 'Rakow Czestochowa' }, { n: 'Lech Poznań', s: 72, b: 'Lech Poznan' },
      { n: 'Jagiellonia', s: 72, b: 'Jagiellonia Bialystok' }, { n: 'Wisła Kraków', s: 70, b: 'Wisla Krakow' },
      { n: 'Pogoń Szczecin', s: 71, b: 'Pogon Szczecin' }, { n: 'Górnik Zabrze', s: 70, b: 'Gornik Zabrze' },
      { n: 'Cracovia', s: 69 }, { n: 'Piast Gliwice', s: 69 }, { n: 'Widzew Łódź', s: 68, b: 'Widzew Lodz' },
      { n: 'Zagłębie Lubin', s: 68, b: 'Zaglebie Lubin' }, { n: 'Radomiak Radom', s: 67 }, { n: 'Stal Mielec', s: 66 },
      { n: 'Korona Kielce', s: 66 }, { n: 'Motor Lublin', s: 66 }, { n: 'GKS Katowice', s: 66 } ] },
    { id: 'RS', name: 'Serbia', code: 'rs', rank: 30, confed: 'UEFA', league: 'SuperLiga', cup: 'Serbian Cup', clubs: [
      { n: 'Red Star Belgrade', s: 77, b: 'Crvena Zvezda' }, { n: 'Partizan', s: 74, b: 'Partizan Belgrade' },
      { n: 'TSC', s: 70, b: 'TSC Backa Topola' }, { n: 'Vojvodina', s: 69 },
      { n: 'Čukarički', s: 68, b: 'Cukaricki' }, { n: 'OFK Beograd', s: 67 }, { n: 'Radnički Niš', s: 66, b: 'Radnicki Nis' },
      { n: 'Spartak Subotica', s: 66 }, { n: 'Novi Pazar', s: 65 }, { n: 'Napredak', s: 65 },
      { n: 'Železničar', s: 64, b: 'Zeleznicar' }, { n: 'Mladost Lučani', s: 64, b: 'Mladost Lucani' } ] },
    { id: 'NO', name: 'Norway', code: 'no', rank: 31, confed: 'UEFA', league: 'Eliteserien', cup: 'Norwegian Cup', clubs: [
      { n: 'Bodø/Glimt', s: 77, b: 'Bodo/Glimt' }, { n: 'Molde', s: 73 }, { n: 'Brann', s: 72, b: 'SK Brann' },
      { n: 'Rosenborg', s: 71 },
      { n: 'Viking', s: 71 }, { n: 'Tromsø', s: 70, b: 'Tromso' }, { n: 'Fredrikstad', s: 69 },
      { n: 'Vålerenga', s: 69, b: 'Valerenga' }, { n: 'Lillestrøm', s: 68, b: 'Lillestrom' }, { n: 'Sarpsborg 08', s: 68 },
      { n: 'Strømsgodset', s: 67, b: 'Stromsgodset' }, { n: 'Haugesund', s: 66 }, { n: 'Kristiansund', s: 66 }, { n: 'HamKam', s: 66 } ] },
    { id: 'EG', name: 'Egypt', code: 'eg', rank: 32, confed: 'CAF', league: 'Premier League', cup: 'Egypt Cup', clubs: [
      { n: 'Al Ahly', s: 77 }, { n: 'Pyramids', s: 75 }, { n: 'Zamalek', s: 74 }, { n: 'Ismaily', s: 68 },
      { n: 'Al Masry', s: 69 }, { n: 'Future FC', s: 69 }, { n: 'Ceramica Cleopatra', s: 68 }, { n: 'ZED FC', s: 67 },
      { n: 'Smouha', s: 67 }, { n: 'ENPPI', s: 66 }, { n: 'Talaea El Gaish', s: 66 }, { n: 'National Bank', s: 66 },
      { n: 'Pharco', s: 66 }, { n: 'Ghazl El Mahalla', s: 65 } ] },
    { id: 'DZ', name: 'Algeria', code: 'dz', rank: 33, confed: 'CAF', league: 'Ligue 1', cup: 'Algerian Cup', clubs: [
      { n: 'CR Belouizdad', s: 70 }, { n: 'MC Alger', s: 69 }, { n: 'USM Alger', s: 69 },
      { n: 'JS Kabylie', s: 68 }, { n: 'ES Sétif', s: 68, b: 'ES Setif' },
      { n: 'CS Constantine', s: 68 }, { n: 'JS Saoura', s: 66 }, { n: 'Paradou', s: 66 },
      { n: 'ASO Chlef', s: 65 }, { n: 'NC Magra', s: 64 }, { n: 'USM Khenchela', s: 64 },
      { n: 'Olympique Akbou', s: 63 }, { n: 'MC El Bayadh', s: 63 }, { n: 'RC Kouba', s: 62 } ] },
    { id: 'IR', name: 'Iran', code: 'ir', rank: 34, confed: 'AFC', league: 'Persian Gulf Pro League', cup: 'Hazfi Cup', clubs: [
      { n: 'Persepolis', s: 71 }, { n: 'Esteghlal', s: 71 }, { n: 'Sepahan', s: 70 }, { n: 'Tractor', s: 68 },
      { n: 'Foolad', s: 67 }, { n: 'Gol Gohar', s: 66 }, { n: 'Zob Ahan', s: 66 }, { n: 'Mes Rafsanjan', s: 65 },
      { n: 'Malavan', s: 64 }, { n: 'Aluminium Arak', s: 64 }, { n: 'Nassaji', s: 64 },
      { n: 'Shams Azar', s: 64 }, { n: 'Havadar', s: 63 }, { n: 'Paykan', s: 63 } ] },
    { id: 'NG', name: 'Nigeria', code: 'ng', rank: 35, confed: 'CAF', league: 'NPFL', cup: 'Nigeria FA Cup', clubs: [
      { n: 'Enyimba', s: 67 }, { n: 'Rivers United', s: 66 }, { n: 'Remo Stars', s: 66 },
      { n: 'Kano Pillars', s: 64 }, { n: 'Shooting Stars', s: 63 },
      { n: 'Plateau United', s: 65 }, { n: 'Bendel Insurance', s: 64 }, { n: 'Rangers International', s: 64 },
      { n: 'Kwara United', s: 64 }, { n: 'Abia Warriors', s: 63 }, { n: 'Nasarawa United', s: 63 },
      { n: 'Akwa United', s: 62 }, { n: 'Wikki Tourists', s: 62 }, { n: 'Niger Tornadoes', s: 62 }, { n: 'Ikorodu City', s: 61 } ] },
    { id: 'CI', name: 'Côte d\'Ivoire', code: 'ci', rank: 36, confed: 'CAF', league: 'Ligue 1', cup: 'Coupe de Côte d\'Ivoire', clubs: [
      { n: 'ASEC Mimosas', s: 68 }, { n: 'San Pedro', s: 66, b: 'FC San Pedro' }, { n: 'Africa Sports', s: 65 },
      { n: 'Stade d\'Abidjan', s: 64 },
      { n: 'SOL FC', s: 64 }, { n: 'Racing d\'Abidjan', s: 63 }, { n: 'SO Armée', s: 62, b: 'SO Armee' },
      { n: 'Sporting Gagnoa', s: 62 }, { n: 'AS Denguelé', s: 62, b: 'AS Denguele' }, { n: 'Bouaké FC', s: 61, b: 'Bouake FC' } ] },
    { id: 'GR', name: 'Greece', code: 'gr', rank: 37, confed: 'UEFA', league: 'Super League', cup: 'Greek Cup', clubs: [
      { n: 'Olympiacos', s: 79 }, { n: 'PAOK', s: 77 }, { n: 'Panathinaikos', s: 76 },
      { n: 'AEK', s: 76, b: 'AEK Athens' }, { n: 'Aris', s: 72, b: 'Aris Thessaloniki' },
      { n: 'Asteras Tripolis', s: 69 }, { n: 'OFI Crete', s: 69 }, { n: 'Atromitos', s: 68 },
      { n: 'Panetolikos', s: 68 }, { n: 'Volos', s: 66 }, { n: 'Panserraikos', s: 66 },
      { n: 'Levadiakos', s: 66 }, { n: 'Lamia', s: 65 }, { n: 'Kifisia', s: 65 } ] },
    { id: 'TN', name: 'Tunisia', code: 'tn', rank: 38, confed: 'CAF', league: 'Ligue 1', cup: 'Tunisian Cup', clubs: [
      { n: 'Espérance', s: 73, b: 'Esperance Tunis' }, { n: 'Étoile du Sahel', s: 71, b: 'Etoile du Sahel' },
      { n: 'Club Africain', s: 70 }, { n: 'CS Sfaxien', s: 69 },
      { n: 'US Monastir', s: 68 }, { n: 'Stade Tunisien', s: 66 }, { n: 'Olympique Béja', s: 65, b: 'Olympique Beja' },
      { n: 'CA Bizertin', s: 65 }, { n: 'AS Marsa', s: 64 }, { n: 'US Ben Guerdane', s: 64 },
      { n: 'JS Omrane', s: 63 }, { n: 'EGS Gafsa', s: 62 } ] },
    { id: 'SC', name: 'Scotland', code: 'gb-sct', rank: 39, confed: 'UEFA', league: 'Premiership', cup: 'Scottish Cup', clubs: [
      { n: 'Celtic', s: 81 }, { n: 'Rangers', s: 80 }, { n: 'Aberdeen', s: 73 },
      { n: 'Hearts', s: 73, b: 'Heart of Midlothian' }, { n: 'Hibernian', s: 72 },
      { n: 'Kilmarnock', s: 71 }, { n: 'St Mirren', s: 70 }, { n: 'Dundee United', s: 70 },
      { n: 'Motherwell', s: 69 }, { n: 'St Johnstone', s: 68 }, { n: 'Ross County', s: 67 }, { n: 'Livingston', s: 66 } ] },
    { id: 'PY', name: 'Paraguay', code: 'py', rank: 40, confed: 'CONMEBOL', league: 'Primera División', cup: 'Copa Paraguay', clubs: [
      { n: 'Olimpia', s: 74 }, { n: 'Cerro Porteño', s: 74, b: 'Cerro Porteno' }, { n: 'Libertad', s: 72 },
      { n: 'Guaraní', s: 70, b: 'Club Guarani' },
      { n: 'Nacional Asunción', s: 69, b: 'Nacional Asuncion' }, { n: 'Sportivo Luqueño', s: 68, b: 'Sportivo Luqueno' },
      { n: 'Sportivo Ameliano', s: 67 }, { n: '2 de Mayo', s: 66 }, { n: 'General Caballero', s: 65 },
      { n: 'Deportivo Recoleta', s: 65 }, { n: 'Atlético Tembetary', s: 64, b: 'Atletico Tembetary' } ] },
    { id: 'CL', name: 'Chile', code: 'cl', rank: 41, confed: 'CONMEBOL', league: 'Primera División', cup: 'Copa Chile', clubs: [
      { n: 'Colo-Colo', s: 74, b: 'Colo Colo' }, { n: 'Universidad de Chile', s: 73, b: 'Universidad de Chile' },
      { n: 'Universidad Católica', s: 73, b: 'Universidad Catolica' }, { n: 'Unión Española', s: 70, b: 'Union Espanola' },
      { n: 'Palestino', s: 70 },
      { n: 'Huachipato', s: 70 }, { n: 'Coquimbo Unido', s: 68 }, { n: 'Audax Italiano', s: 68 },
      { n: 'O\'Higgins', s: 68 }, { n: 'Ñublense', s: 68, b: 'Nublense' }, { n: 'Cobresal', s: 67 },
      { n: 'Everton Viña', s: 67, b: 'Everton CD' }, { n: 'Deportes Iquique', s: 66 }, { n: 'La Serena', s: 66 } ] },
    { id: 'PE', name: 'Peru', code: 'pe', rank: 42, confed: 'CONMEBOL', league: 'Liga 1', cup: 'Copa Bicentenario', clubs: [
      { n: 'Universitario', s: 72 }, { n: 'Sporting Cristal', s: 72 }, { n: 'Alianza Lima', s: 71 },
      { n: 'Melgar', s: 69, b: 'FBC Melgar' },
      { n: 'Cienciano', s: 68 }, { n: 'Cusco FC', s: 67 }, { n: 'ADT', s: 66 },
      { n: 'Sport Huancayo', s: 66 }, { n: 'Atlético Grau', s: 66, b: 'Atletico Grau' },
      { n: 'Deportivo Garcilaso', s: 66 }, { n: 'Comerciantes Unidos', s: 65 }, { n: 'Juan Pablo II', s: 64 } ] },
    { id: 'VE', name: 'Venezuela', code: 've', rank: 43, confed: 'CONMEBOL', league: 'Liga FUTVE', cup: 'Copa Venezuela', clubs: [
      { n: 'Deportivo Táchira', s: 68, b: 'Deportivo Tachira' }, { n: 'Caracas', s: 67 },
      { n: 'Metropolitanos', s: 64 }, { n: 'Estudiantes de Mérida', s: 64, b: 'Estudiantes de Merida' },
      { n: 'Carabobo', s: 66 }, { n: 'Monagas', s: 66 }, { n: 'Portuguesa', s: 65 },
      { n: 'Zamora', s: 65 }, { n: 'Academia Puerto Cabello', s: 65 }, { n: 'Deportivo La Guaira', s: 65 },
      { n: 'Rayo Zuliano', s: 63 }, { n: 'Yaracuyanos', s: 62 } ] },
    { id: 'CA', name: 'Canada', code: 'ca', rank: 44, confed: 'CONCACAF', league: 'Canadian Championship', cup: 'Canadian Championship', clubs: [
      { n: 'Toronto FC', s: 71 }, { n: 'Vancouver Whitecaps', s: 71 }, { n: 'CF Montréal', s: 70, b: 'CF Montreal' },
      { n: 'Forge FC', s: 65 }, { n: 'Cavalry FC', s: 64 },
      { n: 'Atlético Ottawa', s: 63, b: 'Atletico Ottawa' }, { n: 'Pacific FC', s: 62 }, { n: 'HFX Wanderers', s: 62 },
      { n: 'Valour FC', s: 61 }, { n: 'York United', s: 61 } ] },
    { id: 'QA', name: 'Qatar', code: 'qa', rank: 45, confed: 'AFC', league: 'Stars League', cup: 'Emir Cup', clubs: [
      { n: 'Al-Sadd', s: 73, b: 'Al Sadd' }, { n: 'Al-Duhail', s: 72, b: 'Al Duhail' },
      { n: 'Al-Rayyan', s: 70, b: 'Al Rayyan' }, { n: 'Al-Arabi', s: 68, b: 'Al Arabi' },
      { n: 'Al-Gharafa', s: 70 }, { n: 'Al-Wakrah', s: 68 }, { n: 'Qatar SC', s: 67 },
      { n: 'Umm Salal', s: 66 }, { n: 'Al-Shahania', s: 65 }, { n: 'Al-Khor', s: 64 },
      { n: 'Al-Sailiya', s: 64 }, { n: 'Al-Shamal', s: 64 } ] },
    { id: 'SA', name: 'Saudi Arabia', code: 'sa', rank: 46, confed: 'AFC', league: 'Pro League', cup: "King's Cup", clubs: [
      { n: 'Al-Hilal', s: 82, b: 'Al Hilal' }, { n: 'Al-Nassr', s: 81, b: 'Al Nassr' },
      { n: 'Al-Ittihad', s: 80, b: 'Al Ittihad' }, { n: 'Al-Ahli', s: 79, b: 'Al Ahli Jeddah' },
      { n: 'Al-Ettifaq', s: 75, b: 'Al Ettifaq' },
      { n: 'Al-Shabab', s: 74 }, { n: 'Al-Taawoun', s: 74 }, { n: 'Al-Fateh', s: 72 },
      { n: 'Al-Khaleej', s: 70 }, { n: 'Al-Raed', s: 70 }, { n: 'Al-Fayha', s: 70 },
      { n: 'Damac', s: 69 }, { n: 'Neom SC', s: 69 }, { n: 'Al-Okhdood', s: 68 },
      { n: 'Al-Riyadh', s: 68 }, { n: 'Al-Najma', s: 67 } ] },
    { id: 'ZA', name: 'South Africa', code: 'za', rank: 47, confed: 'CAF', league: 'Premiership', cup: 'Nedbank Cup', clubs: [
      { n: 'Mamelodi Sundowns', s: 74 }, { n: 'Orlando Pirates', s: 72 }, { n: 'Kaizer Chiefs', s: 71 },
      { n: 'SuperSport United', s: 68 },
      { n: 'Stellenbosch', s: 70 }, { n: 'Cape Town City', s: 68 }, { n: 'AmaZulu', s: 67 },
      { n: 'Sekhukhune United', s: 67 }, { n: 'Golden Arrows', s: 66 }, { n: 'TS Galaxy', s: 66 },
      { n: 'Richards Bay', s: 66 }, { n: 'Chippa United', s: 65 }, { n: 'Polokwane City', s: 65 }, { n: 'Marumo Gallants', s: 64 } ] },
    { id: 'CR', name: 'Costa Rica', code: 'cr', rank: 48, confed: 'CONCACAF', league: 'Liga FPD', cup: 'Copa Costa Rica', clubs: [
      { n: 'Saprissa', s: 71, b: 'Deportivo Saprissa' }, { n: 'Alajuelense', s: 71, b: 'LD Alajuelense' },
      { n: 'Herediano', s: 70 }, { n: 'Cartaginés', s: 65, b: 'Cartagines' },
      { n: 'San Carlos', s: 66 }, { n: 'Puntarenas', s: 64 }, { n: 'Sporting San José', s: 64, b: 'Sporting San Jose' },
      { n: 'Pérez Zeledón', s: 63, b: 'Perez Zeledon' }, { n: 'Santos de Guápiles', s: 63, b: 'Santos de Guapiles' },
      { n: 'Guanacasteca', s: 62 } ] },
    { id: 'CM', name: 'Cameroon', code: 'cm', rank: 49, confed: 'CAF', league: 'Elite One', cup: 'Cameroon Cup', clubs: [
      { n: 'Coton Sport', s: 65 }, { n: 'Canon Yaoundé', s: 63, b: 'Canon Yaounde' },
      { n: 'Union Douala', s: 63 }, { n: 'Fovu Club', s: 61 },
      { n: 'APEJES', s: 62 }, { n: 'Astres Douala', s: 62 }, { n: 'Colombe', s: 61 },
      { n: 'PWD Bamenda', s: 60 }, { n: 'Stade Renard', s: 60 }, { n: 'Young Sport Academy', s: 59 } ] },
    { id: 'ML', name: 'Mali', code: 'ml', rank: 50, confed: 'CAF', league: 'Première Division', cup: 'Coupe du Mali', clubs: [
      { n: 'Stade Malien', s: 65 }, { n: 'Djoliba', s: 64 }, { n: 'Real Bamako', s: 62 },
      { n: 'US Bougouba', s: 61 }, { n: 'AS Police', s: 61 }, { n: 'Onze Créateurs', s: 60, b: 'Onze Createurs' },
      { n: 'Afrique Football Élite', s: 59, b: 'Afrique Football Elite' }, { n: 'USC Kita', s: 58 } ] },
  ];

  /* ----------------------------------------------------------
     DECISION CARDS — media/dressing-room situations.
     fx: stats {STAT: n}, form (season multiplier delta),
     hype (market value buzz), optional risk {p, good, bad}
     ---------------------------------------------------------- */
  const DECISIONS = [
    // ---- YOUTH (14-18) ----
    { id: 'viral-nutmeg', min: 14, max: 18, title: 'Viral Nutmeg',
      desc: 'Your street nutmeg clip hits 3M views. A football podcast wants you on tonight\'s episode.',
      a: { label: 'Hop on the pod', sub: 'Talk your talk', fx: { stats: { MEN: 2 }, form: .02, hype: 2 }, out: 'You were a natural. The clip of you saying "I\'m just getting started" gets 500K likes.' },
      b: { label: 'Politely decline', sub: 'Gym time instead', fx: { stats: { PHY: 2 }, form: .01 }, out: 'No shortcuts. The gym session is brutal. Your legs will thank you in April.' } },
    { id: 'pink-boots', min: 14, max: 20, title: 'The Pink Boots',
      desc: 'Your boot sponsor sends their new model. They are extremely, aggressively pink.',
      a: { label: 'Wear them loud', sub: 'Stand out', fx: { stats: { MEN: 1, DRI: 1 }, hype: 2 }, out: 'The boots become a meme, then a trend. Sales spike 300%. The sponsor loves you.' },
      b: { label: 'Classic black', sub: 'Old school', fx: { stats: { MEN: 1 }, form: .01 }, out: 'Black boots, no nonsense. The purists approve. Your grandad approves more.' } },
    { id: 'abuela-asado', min: 14, max: 19, title: 'Abuela\'s Asado',
      desc: 'Grandma\'s Sunday asado is legendary. The club nutritionist has opinions about it.',
      a: { label: 'Asado is life', sub: 'Family first', fx: { stats: { MEN: 2, PHY: -1 } }, out: 'Worth it. Abuela cries with joy. The nutritionist cries too, differently.' },
      b: { label: 'Grilled chicken sadness', sub: 'Stick to the plan', fx: { stats: { PHY: 2, MEN: -1 } }, out: 'You eat plain chicken while everyone feasts. Your body fat % drops. Your soul, slightly too.' } },
    { id: 'hazing', min: 14, max: 17, title: 'Initiation Ceremony',
      desc: 'Senior squad initiation: sing your national anthem in front of everyone. In a dinosaur costume.',
      a: { label: 'Belt it out. Loud.', sub: 'Full commitment', fx: { stats: { MEN: 2 }, form: .02 }, out: 'You hit the high note. The captain stands and applauds. You\'re one of them now.' },
      b: { label: 'Hide in the physio room', sub: 'Not today', fx: { stats: { MEN: -1 } }, out: 'You dodge the dinosaur, but the dressing room notices. Mild awkwardness for a week.' } },
    { id: 'exam-final', min: 14, max: 16, title: 'Clash of Schedules',
      desc: 'Youth tournament final is the same day as your school exam. Mom is watching this decision closely.',
      a: { label: 'Football first', sub: 'The final matters', fx: { stats: { DRI: 2, MEN: 1 } }, out: 'You play a blinder and lift the trophy. The school lets you resit. Everyone wins.' },
      b: { label: 'Books first', sub: 'Mom is happy', fx: { stats: { MEN: 1 }, form: -.02 }, out: 'You pass the exam. The team wins without you. Mom frames your B+.' } },
    { id: 'position-switch', min: 14, max: 18, pos: 'field', title: 'New Role Experiment',
      desc: 'The academy coach wants to try you in a completely new role this season.',
      a: { label: 'Trust the coach', sub: 'Versatility is value', fx: { stats: { PAS: 2, MEN: 1 } }, out: 'It clicks by October. You now understand the pitch like a chessboard.' },
      b: { label: 'I know my position', sub: 'Stand firm', fx: { stats: { SHO: 2, MEN: -1 } }, out: 'You stay put and sharpen your craft. The coach respects the conviction. Mostly.' } },
    { id: 'late-nights', min: 14, max: 19, title: 'One More Game',
      desc: 'It\'s 2AM. You\'re one win from Elite Division on the console. Training is at 8.',
      a: { label: 'One more game', sub: 'It\'s basically research', fx: { stats: { MEN: 1, PAC: -1 }, form: -.04 }, out: 'You win, then lose four hours of sleep. Training is a fog. The coach narrows his eyes.' },
      b: { label: 'Sleep like a pro', sub: 'Recovery is a skill', fx: { stats: { MEN: 1 }, form: .03 }, out: 'Nine hours of sleep. You float through training like a caffeinated ghost.' } },
    { id: 'agent-kid', min: 14, max: 17, title: 'Slick Rick Appears',
      desc: 'A guy in a shiny suit says he can make you "the next big thing". He wants 20%.',
      a: { label: 'Sign with Slick Rick', sub: 'He has connections', fx: { stats: { MEN: 1 }, hype: 3 }, out: 'Rick gets your name in three newspapers and one slightly dodgy website. Buzz is buzz.' },
      b: { label: 'My uncle handles it', sub: 'Family management', fx: { stats: { MEN: 2 } }, out: 'Uncle Tito negotiates with the fury of a thousand lawyers. For free. With empanadas.' } },
    { id: 'youth-captain', min: 15, max: 18, title: 'The Armband',
      desc: 'Youth final. The coach hands you the captain\'s armband in front of everyone.',
      a: { label: 'Lead by shouting', sub: 'Vocal leader', fx: { stats: { MEN: 2 }, form: .02 }, out: 'You orchestrate like a tiny furious conductor. The team responds. You lift the cup.' },
      b: { label: 'Lead by example', sub: 'Let football speak', fx: { stats: { DRI: 1, MEN: 1 } }, out: 'You say four words all game and dominate every blade of grass. Silent captain. Feared captain.' } },
    { id: 'injury-scare', min: 14, max: 19, title: 'Twinge Before The Showcase',
      desc: 'Hamstring tightness the morning of the big showcase. There are scouts in the stands.',
      a: { label: 'Play through it', sub: 'Scouts wait for no one', fx: { risk: { p: .5, good: { stats: { MEN: 2 }, form: .04 }, bad: { stats: { PAC: -1 }, form: -.06 } } },
        out: '' },
      b: { label: 'Sit it out', sub: 'Career is a marathon', fx: { stats: { MEN: 1 }, form: -.02 }, out: 'You watch from the stands with an ice pack. Smart, boring, alive. The scouts will be back.' } },
    { id: 'first-yellow', min: 14, max: 18, title: 'The Ref Wave-Off',
      desc: 'You got hacked down. The ref waves play on. Again. Third time this half.',
      a: { label: 'Complain loudly', sub: 'Justice!', fx: { stats: { MEN: -1 }, form: .01 }, out: 'Yellow card. But the fire lights something in you — you play furious and fearless.' },
      b: { label: 'Score instead', sub: 'Best revenge', fx: { stats: { SHO: 1, MEN: 1 } }, out: 'You channel it into a top-corner finish. The ref avoids eye contact. Delicious.' } },
    { id: 'smelly-bibs', min: 14, max: 17, title: 'The Bibs',
      desc: 'Training bibs smell like 40 years of regret. The kit man shrugs.',
      a: { label: 'Wear it with pride', sub: 'Earn the real shirt', fx: { stats: { MEN: 1, PHY: 1 } }, out: 'You smell like legacy. You play like it too. The kit man nods with respect.' },
      b: { label: 'Demand fresh bibs', sub: 'Standards matter', fx: { stats: { MEN: -1 } }, out: 'New bibs arrive. The veterans call you "Princess" for a month. It sticks a little.' } },

    // ---- RISE (18-22) ----
    { id: 'release-clause', min: 18, max: 22, title: 'First Pro Contract',
      desc: 'Your agent demands a €50M release clause. The club\'s lawyer audibly laughs across the table.',
      a: { label: 'Hold out for the clause', sub: 'Bet on yourself', fx: { stats: { MEN: 2 }, hype: 2 }, out: 'Three tense weeks later: €40M clause. The lawyer stops laughing. Your agent buys a nicer suit.' },
      b: { label: 'Sign and focus', sub: 'Football first', fx: { stats: { MEN: 1 }, form: .03 }, out: 'Signed in a day. The club loves you. The fans make a banner. Your agent sulks briefly.' } },
    { id: 'nightclub-leak', min: 18, max: 26, title: 'The "Nightclub" Photo',
      desc: 'A photo of you "at a nightclub" (it was your cousin\'s birthday dinner) leaks before the derby.',
      a: { label: 'Address it head-on', sub: '"I had one (1) lemonade"', fx: { stats: { MEN: 1 }, form: .01 }, out: 'The press conference clip goes viral for your deadpan delivery. Story dead by Tuesday.' },
      b: { label: 'Say nothing, score', sub: 'Let the brace talk', fx: { stats: { SHO: 2 }, form: .02 }, out: 'Two goals in the derby. Nobody remembers the photo. Everybody remembers the second goal.' } },
    { id: 'pod-trashtalk', min: 18, max: 27, title: 'Podcast Trap Question',
      desc: 'On the league\'s biggest podcast, the host asks about your rival club\'s defence. He\'s smiling.',
      a: { label: '"Couldn\'t park a bus with a SATNAV"', sub: 'Full send', fx: { stats: { MEN: 2 }, form: .02, hype: 2 }, out: 'The quote is everywhere by morning. Their fans are furious. Your fans have a new chant.' },
      b: { label: '"Full respect to them"', sub: 'Diplomatic', fx: { stats: { MEN: 1 }, form: .02 }, out: 'Boring, classy, bulletproof. The pundits call you "mature beyond your years".' } },
    { id: 'nt-debut', min: 18, max: 24, title: 'First Call-Up',
      desc: 'First national team call-up. The dressing room is full of the players from your childhood posters.',
      a: { label: 'Ask everyone for shirts', sub: 'Fan mode', fx: { stats: { MEN: 1 } }, out: 'You collect six shirts and one priceless story about the captain\'s pre-match ritual.' },
      b: { label: 'Act like you belong', sub: 'Equals, not idols', fx: { stats: { MEN: 2 }, form: .02 }, out: 'You nutmeg the captain in training. The room goes silent, then erupts. You belong.' } },
    { id: 'deadline-day', min: 18, max: 25, title: 'Deadline Day',
      desc: 'Your agent calls at 9AM: "Don\'t move. Something\'s cooking." It is now 9PM.',
      a: { label: 'Refresh your phone for 9 hours', sub: 'Here we go?', fx: { stats: { MEN: 1 }, hype: 2 }, out: 'Nothing happens. But a fabrizio-style tweet with your name gets 40K likes. Net positive.' },
      b: { label: 'Turn it off, train', sub: 'No distractions', fx: { stats: { PHY: 1, MEN: 1 } }, out: 'Best session of the month. The move never existed. The gains are real though.' } },
    { id: 'coach-rift', min: 18, max: 26, title: '"Your Numbers Are Mid"',
      desc: 'The new manager says your numbers are "mid". He is 54 years old. He used the word "mid".',
      a: { label: 'Win him over in training', sub: 'Prove it daily', fx: { stats: { PHY: 2 }, form: .03 }, out: 'Six weeks of war-level training. He starts you and calls you "a manager\'s dream".' },
      b: { label: 'Subtweet "ok 😴"', sub: 'Petty but honest', fx: { stats: { MEN: -1 }, form: -.01, hype: 1 }, out: 'The internet loves it. The manager does not. You spend two weeks on the bench.' } },
    { id: 'tiktok-sponsor', min: 18, max: 27, title: 'The Dance Trend',
      desc: 'Your sponsor asks you to do a dance trend. You have two left feet — unfortunate for a footballer.',
      a: { label: 'Commit to the bit', sub: 'Full chaos', fx: { stats: { MEN: 1 }, hype: 2 }, out: 'It\'s so bad it\'s perfect. 12M views. The sponsor names a boot after your worst move.' },
      b: { label: 'Negotiate: trick shots only', sub: 'Stay on brand', fx: { stats: { DRI: 2 } }, out: 'The trick shot video is genuinely absurd. Crossbar from the car park. 8M views, zero dignity lost.' } },
    { id: 'pen-duty', min: 18, max: 28, pos: 'field', title: 'Penalty Politics',
      desc: 'The striker just missed his third penalty. The fans chant YOUR name for the next one.',
      a: { label: 'Grab the ball', sub: 'New sheriff', fx: { stats: { SHO: 2, MEN: 2 } }, out: 'You bury it. The striker glares, then shrugs, then passes you the ball next time. Order restored.' },
      b: { label: 'Not my job', sub: 'Hierarchy matters', fx: { stats: { MEN: 1 } }, out: 'The striker scores the next one and dedicates it to you. Dressing room harmony: intact.' } },
    { id: 'charity-match', min: 18, max: 30, title: 'Rest Day Dilemma',
      desc: 'A charity futsal game for the kids\' hospital is scheduled on your only rest day.',
      a: { label: 'Play, obviously', sub: 'The kids go wild', fx: { stats: { MEN: 2 }, form: -.01, hype: 1 }, out: 'You let a 9-year-old score past you. The video is the sweetest thing on the internet this week.' },
      b: { label: 'Donate instead', sub: 'Recovery matters', fx: { stats: { MEN: 1 }, form: .01 }, out: 'Quiet donation, full recovery. The hospital still names a ward shelf after you.' } },
    { id: 'icon-compare', min: 18, max: 24, title: 'The Comparison',
      desc: 'The local paper compares you to the club\'s greatest-ever legend. No pressure at all.',
      a: { label: '"I\'m writing my own story"', sub: 'Embrace it', fx: { stats: { MEN: 2 }, hype: 2 }, out: 'The quote becomes a mural outside the stadium within a month. You walk past it daily. Fuel.' },
      b: { label: '"I\'m nobody yet"', sub: 'Stay humble', fx: { stats: { MEN: 1 }, form: .02 }, out: 'The legend himself reposts it: "This kid gets it." You screenshot it forever.' } },
    { id: 'psychologist', min: 18, max: 28, title: 'The Sports Psychologist',
      desc: 'The club hires a sports psychologist. She carries a crystal. For "vibes".',
      a: { label: 'Book weekly sessions', sub: 'Open mind', fx: { stats: { MEN: 3 } }, out: 'The crystal is nonsense, but the breathing work is real. You\'re ice-cold in big moments now.' },
      b: { label: '"My vibe is goals"', sub: 'Old school', fx: { stats: { SHO: 1 } }, out: 'She laughs, you laugh, you score a hat-trick that weekend. Different kinds of therapy.' } },
    { id: 'supercar', min: 18, max: 27, title: 'First Big Paycheck',
      desc: 'The dealership knows you got paid. The dealership always knows.',
      a: { label: 'Buy the neon supercar', sub: 'You earned it', fx: { stats: { MEN: 1 }, hype: 2, form: -.01 }, out: 'It\'s ridiculous. It\'s magnificent. The manager calls it "a cry for help" but asks for a ride.' },
      b: { label: 'Index funds. Boring. Rich.', sub: 'Future you says thanks', fx: { stats: { MEN: 2 } }, out: 'Compound interest begins its silent, beautiful work. Your accountant sheds a proud tear.' } },

    // ---- PRIME (23-32) ----
    { id: 'captaincy', min: 23, max: 31, title: 'The Squad Has Voted',
      desc: 'The captain left. The squad voted. It\'s you. The armband is on your peg.',
      a: { label: 'Accept the armband', sub: 'Lead the era', fx: { stats: { MEN: 3 }, hype: 1 }, out: 'First speech: 30 seconds, zero clichés. The kit man applauds. That\'s how you know it landed.' },
      b: { label: 'Pass it to the veteran', sub: 'Not yet', fx: { stats: { MEN: 1 }, form: .01 }, out: 'The veteran is touched. He plays the season of his life. Quiet leadership is still leadership.' } },
    { id: 'documentary', min: 23, max: 30, title: 'The Docuseries',
      desc: 'A streaming giant wants a 6-part documentary on your season. Cameras everywhere. Everywhere.',
      a: { label: 'Cameras everywhere', sub: 'Content is king', fx: { stats: { MEN: 1 }, hype: 3, form: -.02 }, out: 'Episode 3 — the half-time rant — wins an award. Your focus wobbles slightly. Worth it?' },
      b: { label: 'No distractions', sub: 'The season first', fx: { stats: { MEN: 1 }, form: .02 }, out: 'They film a rival instead. Their star has a meltdown on camera. You just keep winning quietly.' } },
    { id: 'contract-year', min: 24, max: 30, title: 'Contract Year',
      desc: 'Final year of your deal. The fans want you to stay. The board is suspiciously silent.',
      a: { label: 'Ball out, let football talk', sub: 'Earn the offer', fx: { stats: { SHO: 1 }, form: .04 }, out: 'You play like a man possessed. The board appears with a new contract by spring. Funny that.' },
      b: { label: 'Angle for the move', sub: 'Keep options open', fx: { stats: { MEN: 1 }, hype: 2, form: -.01 }, out: 'Your agent leaks "interest from abroad". Three clubs call. The fans are nervous. Chess, not checkers.' } },
    { id: 'fashion-line', min: 23, max: 32, title: 'The Fashion Drop',
      desc: 'Your streetwear collab drops this week. The scarf-hat combo is... divisive.',
      a: { label: 'Wear it to the presser', sub: 'Own the look', fx: { stats: { MEN: 2 }, hype: 2 }, out: 'Fashion Twitter declares war on itself. It sells out in 40 minutes. You are a "visionary" now.' },
      b: { label: 'Donate the stock', sub: 'Quiet exit', fx: { stats: { MEN: 1 } }, out: 'The scarf-hat becomes an ironic cult item at charity shops. Somehow this is also a win.' } },
    { id: 'semi-pen', min: 23, max: 32, pos: 'field', title: 'Semi-Final, 89th Minute',
      desc: 'Penalty to win it. The keeper is doing the wobbly-legs routine. 70,000 people hold their breath.',
      a: { label: 'Take it yourself', sub: 'Pick your spot — 2 of 5 zones beat him',
        mini: { type: 'penalty', zones: 5, goodZones: 2, results: {
          good: { fx: { stats: { MEN: 3, SHO: 1 }, form: .05 }, out: 'You bury it. The keeper went the wrong way entirely. The stadium is a wall of sound. FINAL.' },
          bad: { fx: { stats: { MEN: -2 }, form: -.03 }, out: 'Saved. He guessed right and parries it away. The silence is deafening. The replay plays on loop in your head.' } } } },
      b: { label: 'Pick a corner, smash it', sub: 'Percentage play', fx: { stats: { SHO: 1, MEN: 1 }, form: .02 }, out: 'Top corner. Keeper went the right way. Didn\'t matter. The net is still shaking.' } },
    { id: 'bust-up', min: 24, max: 32, title: 'Half-Time Volcano',
      desc: 'The manager says the team is "playing like it\'s a testimonial match". He\'s looking directly at you.',
      a: { label: 'Fight for your place', sub: 'Respond on the pitch', fx: { stats: { MEN: 2 }, form: .03 }, out: 'Second half: you run like three men. Man of the match. He apologizes in the presser. Respect earned.' },
      b: { label: 'Request a transfer internally', sub: 'Enough', fx: { stats: { MEN: 1 }, hype: 2, form: -.02 }, out: 'Word gets out. Three sporting directors call your agent before dinner. Interesting.' } },
    { id: 'esports', min: 23, max: 33, title: 'Your Esports Team Is Bad',
      desc: 'You bought an esports team. Their football-game roster is, ironically, terrible.',
      a: { label: 'Rebrand: sign streamers', sub: 'Content over wins', fx: { stats: { MEN: 1 }, hype: 2 }, out: 'The team still loses but the streams are hilarious. Merch sales cover the losses. Business!' },
      b: { label: 'Scout properly', sub: 'Win or nothing', fx: { stats: { MEN: 2 } }, out: 'You scout a 16-year-old from a basement qualifier. She wins the regionals. Talent ID: you have it.' } },
    { id: 'testimonial-dinner', min: 25, max: 34, title: 'The Legend\'s Dinner',
      desc: 'A club legend\'s testimonial dinner is the night before your match. Everyone will be there.',
      a: { label: 'Go, network, leave by 9', sub: 'Disciplined cameo', fx: { stats: { MEN: 1 } }, out: 'You hear a story about the 1994 dressing room that changes how you see the badge. Home by 9:07.' },
      b: { label: 'Recovery boots and sleep', sub: 'Robot mode', fx: { stats: { PHY: 1 }, form: .02 }, out: 'You sleep 9 hours in compression boots. Next day you run 12km. The legend understands.' } },
    { id: 'ballon-campaign', min: 25, max: 33, title: 'The Ballon d\'Or Whisper',
      desc: 'You\'re 4th in the Ballon d\'Or odds. Your PR team suggests a "humble but visible" campaign.',
      a: { label: 'Full PR blitz', sub: 'Politics is part of it', fx: { stats: { MEN: 1 }, hype: 3, form: -.01 }, out: 'Billboards in three capitals. You finish 3rd. The voters "appreciated the visibility".' },
      b: { label: 'Let the numbers talk', sub: 'Football only', fx: { stats: { MEN: 1 }, form: .03 }, out: 'No campaign, just weekly masterclasses. You finish 3rd anyway — and the purists adore you.' } },
    { id: 'banner-insult', min: 23, max: 33, title: 'The Banner',
      desc: 'Rival ultras unveil a giant banner of you as a crying baby. It\'s honestly well drawn.',
      a: { label: 'Frame it. Fuel.', sub: 'Weaponize it', fx: { stats: { MEN: 2 }, form: .03 }, out: 'You request a photo of it for your gym wall. Next match vs them: goal + baby celebration. Cinema.' },
      b: { label: 'Ignore publicly, rage privately', sub: 'Cold revenge', fx: { stats: { MEN: 1 }, form: .01 }, out: 'Zero reaction all week. Then a 25-yard winner against them. Cold. So cold.' } },
    { id: 'badges-early', min: 27, max: 35, title: 'The Coaching Badges',
      desc: 'The federation offers you a fast-track coaching course. Homework. Actual homework.',
      a: { label: 'Start the badges', sub: 'Future gaffer', fx: { stats: { MEN: 2, PAS: 1 } }, out: 'You see the game differently now — spaces before they open. Your passing gains a new gear.' },
      b: { label: 'Playing is the job', sub: 'Badges later', fx: { stats: {}, form: .02 }, out: 'All energy on the pitch. The badges can wait. The legs cannot.' } },
    { id: 'wedding-final', min: 24, max: 33, title: 'The Venue Conflict',
      desc: 'The wedding venue has exactly one date left: cup final week. Your partner is NOT flexible.',
      a: { label: 'Ask the club to move the final', sub: 'Bold strategy', fx: { stats: { MEN: -1 }, form: -.02, hype: 1 }, out: 'The club secretary laughs for a full minute. The story leaks. You become a meme. Love wins, barely.' },
      b: { label: 'Wedding after the parade', sub: 'Priorities... discussed', fx: { stats: { MEN: 2 }, form: .02 }, out: 'You win the cup, then get married holding it in the photos. Iconic. Partner forgives everything.' } },

    // ---- VETERAN (31+) ----
    { id: 'testimonial-petition', min: 31, max: 40, title: '80,000 Signatures',
      desc: 'Fans started a petition for your testimonial match. It has 80,000 signatures and its own hashtag.',
      a: { label: 'Start planning the legends XI', sub: 'One big party', fx: { stats: { MEN: 2 }, hype: 2 }, out: 'You start a group chat called "Legends XI". Three retired greats reply within the hour.' },
      b: { label: '"Not yet. Chapters left."', sub: 'Delay the goodbye', fx: { stats: { MEN: 2 }, form: .02 }, out: 'The quote trends. Season ticket sales spike. The fans sense something special is coming.' } },
    { id: 'shirt-number-kid', min: 31, max: 38, title: '"Can I Have Your Number?"',
      desc: 'The 17-year-old academy wonderkid politely asks for your shirt number. "When you\'re done, legend."',
      a: { label: 'Mentor him instead', sub: 'Pass the torch slowly', fx: { stats: { MEN: 2, PAS: 1 } }, out: 'You take him under your wing. He learns your first touch drill. The future is in good hands.' },
      b: { label: '"Earn it first, kid"', sub: 'Old law', fx: { stats: { MEN: 1, SHO: 1 } }, out: 'He scores 20 that season out of pure spite. You smile. That\'s exactly the point.' } },
    { id: 'player-coach', min: 32, max: 40, title: 'The Hybrid Role',
      desc: 'The board offers a player-coach hybrid role. Clipboards are involved.',
      a: { label: 'Clipboards calling', sub: 'Begin the transition', fx: { stats: { MEN: 3, PAS: 1 } }, out: 'Your half-time tactical tweak wins a match. The manager jokes about job security. Half-jokes.' },
      b: { label: 'Boots only till the end', sub: 'One job left', fx: { stats: { PHY: 1 }, form: .02 }, out: 'No clipboards. Just grass, sweat and the last drops of the tank. Pure.' } },
    { id: 'saudi-rumor', min: 31, max: 38, title: '"The Saudi Project?"',
      desc: 'A journalist asks if you\'re "considering the Saudi project". The press room goes completely silent.',
      a: { label: '"I play where football breathes"', sub: 'Romantic answer', fx: { stats: { MEN: 2 }, hype: 1 }, out: 'The quote is on t-shirts by Friday. The purists weep with joy. Your agent weeps differently.' },
      b: { label: '"Never say never"', sub: 'Keep the door open', fx: { stats: { MEN: 1 }, hype: 2 }, out: 'Two words, forty headlines. Your phone has not stopped buzzing. Everything is leverage.' } },
    { id: 'autobiography', min: 32, max: 40, title: 'Chapter 7',
      desc: 'Your autobiography draft includes Chapter 7: "What the dressing room really said".',
      a: { label: 'Publish unfiltered', sub: 'The people deserve it', fx: { stats: { MEN: 2 }, hype: 3, form: -.02 }, out: 'Bestseller in a week. Two former teammates unfollow you. One sends a lawyer letter. Sales double.' },
      b: { label: 'Chapter 7 disappears', sub: 'Some doors stay closed', fx: { stats: { MEN: 1 }, form: .01 }, out: 'The book is still great. Chapter 7 becomes football\'s greatest urban legend. Mystique: intact.' } },
    { id: 'mini-me', min: 31, max: 40, title: 'The Copycat Kid',
      desc: 'An academy kid copies your celebration, your boots, and — bravely — your haircut.',
      a: { label: 'Take him under your wing', sub: 'Legacy mode', fx: { stats: { MEN: 2, PAS: 1 } }, out: 'You teach him the celebration properly. If you\'re going to steal it, steal it well.' },
      b: { label: 'Send him the haircut bill', sub: 'Establish boundaries', fx: { stats: { MEN: 1 }, hype: 1 }, out: 'The photo of you handing him an invoice trends for days. He frames it. You sign it.' } },
    { id: 'pundit-slot', min: 33, max: 40, title: 'The Pundit Offer',
      desc: 'TV offers you a pundit slot for the big derby. Your manager frowns from across the room.',
      a: { label: 'Hot takes incoming', sub: 'The people need truth', fx: { stats: { MEN: 1 }, hype: 2 }, out: 'Your tactical breakdown is so good the clip is used in coaching courses. The manager stays frowny.' },
      b: { label: 'Decline. Focus.', sub: 'One job', fx: { stats: {}, form: .02 }, out: 'You watch the derby from the physio room with ice on both knees. Professional to the end.' } },
    { id: 'last-dance', min: 33, max: 40, title: 'One More Cycle',
      desc: 'One more World Cup cycle. Your knees have filed a formal complaint with HR.',
      a: { label: 'Push for the squad', sub: 'The last dance', fx: { stats: { MEN: 3, PHY: -1 }, hype: 1 }, out: 'The manager calls: "We need your experience." Your knees sigh. Your heart soars.' },
      b: { label: 'Bow out gracefully', sub: 'Leave them wanting more', fx: { stats: { MEN: 2 } }, out: 'The farewell letter is read on live TV. The presenter cries. You pretend it\'s hay fever.' } },
    { id: 'retirement-tease', min: 34, max: 40, title: '🤔⏳',
      desc: 'You tweet "🤔⏳". It trends worldwide within the hour. Your phone is melting.',
      a: { label: 'Let them cook', sub: 'Chaos agent', fx: { stats: { MEN: 1 }, hype: 2 }, out: 'Three days of global speculation. You were actually just thinking about lunch. Incredible scenes.' },
      b: { label: 'Clarify: not yet', sub: 'Calm the storm', fx: { stats: { MEN: 1 }, form: .02 }, out: '"Not yet." Two words. Season ticket renewals spike 12%. The club sends a thank-you basket.' } },
    { id: 'gold-boots-deal', min: 31, max: 40, title: 'The Lifetime Clause',
      desc: 'A boot brand offers a lifetime deal. One clause: you must wear gold boots. Forever.',
      a: { label: 'Gold it is', sub: 'Shiny legacy', fx: { stats: { MEN: 2 }, hype: 2 }, out: 'You score in the gold boots on debut. They become iconic. Kids fight over them in shops.' },
      b: { label: 'Dignity > gold', sub: 'Respectfully decline', fx: { stats: { MEN: 1 } }, out: 'You stay in classic boots. The brand respects it so much they offer the deal anyway. No clause.' } },
    { id: 'chaos-fc', min: 33, max: 40, title: 'A Club Is For Sale',
      desc: 'A third-division club is for sale, suspiciously cheap. Your accountant is sweating.',
      a: { label: 'Buy it. Chaos FC.', sub: 'Owner-player arc', fx: { stats: { MEN: 2 }, hype: 2 }, out: 'You now own 11% of a club with 400 fans and a dog mascot. You attend a board meeting. It\'s chaos. You love it.' },
      b: { label: 'Buy the steakhouse instead', sub: 'Safer investment', fx: { stats: { MEN: 1 } }, out: 'The steakhouse thrives. Players eat free. Your accountant sleeps again. Everyone wins.' } },
    { id: 'farewell-tour', min: 36, max: 40, title: 'The Applause Problem',
      desc: 'Every away ground applauds you now. It\'s weird. You genuinely miss the boos.',
      a: { label: 'Soak it in', sub: 'Earned respect', fx: { stats: { MEN: 2 } }, out: 'You applaud them back. An entire stadium does your celebration. Goosebumps. Every week.' },
      b: { label: 'Playfully boo them back', sub: 'Keep the edge', fx: { stats: { MEN: 1 }, hype: 1 }, out: 'They love it. You love it. The mutual trolling becomes the league\'s favourite subplot.' } },

    // ---- GK SPECIFIC ----
    { id: 'gk-neon-gloves', min: 14, max: 20, pos: 'gk', title: 'The Traffic Cone Gloves',
      desc: 'Your sponsor sends the new gloves. They are neon green. You look like a traffic cone.',
      a: { label: 'Rock the cone', sub: 'Own it', fx: { stats: { COM: 1 }, hype: 2 }, out: 'You save everything. "The Cone" becomes your nickname. The gloves sell out nationwide.' },
      b: { label: 'Classic black gloves', sub: 'No distractions', fx: { stats: { COM: 2 } }, out: 'Black gloves, cold stare, zero goals conceded. The purists nod slowly.' } },
    { id: 'gk-sweeper', min: 16, max: 24, pos: 'gk', title: 'Sweeper-Keeper Orders',
      desc: 'The coach wants you playing 30 yards off your line. Your centre-backs look physically ill.',
      a: { label: 'Embrace the chaos', sub: '11th outfield player', fx: { stats: { PAS: 2, VIS: 1 } }, out: 'You start a counter-attack with a 60-yard pass. The coach kisses the tactics board.' },
      b: { label: 'My line. My home.', sub: 'Traditionalist', fx: { stats: { REF: 2 } }, out: 'You become a shot-stopping fortress instead. Three point-blank saves in one game. Statement made.' } },
    { id: 'gk-dossier', min: 18, max: 28, pos: 'gk', title: 'The 40-Page Dossier',
      desc: 'The analyst hands you 40 pages on the rival penalty taker. He stares at a wall before shooting.',
      a: { label: 'Memorize all 40 pages', sub: 'Homework hero', fx: { stats: { VIS: 2, COM: 1 } }, out: 'You know his run-up better than he does. Saved. You point at the analyst. He cries happy tears.' },
      b: { label: 'Trust instinct', sub: 'Feel the moment', fx: { stats: { REF: 2 } }, out: 'No notes. Pure reflex. You go the right way anyway. Instinct: undefeated.' } },
    { id: 'gk-long-balls', min: 20, max: 30, pos: 'gk', title: 'The Groan',
      desc: 'The fans audibly groan every time you punt it long. The groan is getting louder.',
      a: { label: 'Work on the diagonals', sub: 'Quarterback mode', fx: { stats: { PAS: 3 } }, out: 'By winter you\'re hitting wingers on the laces from 70 yards. The groan becomes a gasp.' },
      b: { label: 'Keep it simple', sub: 'Risk management', fx: { stats: { COM: 2 } }, out: 'Short, safe, calm. The groan fades. The xG against drops. Boring is beautiful.' } },
    { id: 'gk-shootout', min: 24, max: 34, pos: 'gk', title: 'Cup Final Shootout',
      desc: 'Penalty shootout in the cup final. Time for the mind games.',
      a: { label: 'Full wobbly-legs routine', sub: 'Theatrics', fx: { stats: { COM: 2 }, hype: 2 }, out: 'You dance on the line like a man possessed. He skies it. The clip lives forever.' },
      b: { label: 'Stone-faced statue', sub: 'Silent menace', fx: { stats: { COM: 1, REF: 1 } }, out: 'You don\'t move a muscle. He blinks first. Bottom corner — saved. Ice cold.' } },
    { id: 'gk-voice', min: 16, max: 24, pos: 'gk', title: '"Too Polite"',
      desc: 'The goalkeeping coach says your box command is "too polite". You said "excuse me" to a striker.',
      a: { label: 'Find your voice', sub: 'Command the box', fx: { stats: { LEA: 3 } }, out: 'You develop a roar that rearranges defensive lines. Defenders move before you finish the word.' },
      b: { label: 'Let saves talk', sub: 'Actions over volume', fx: { stats: { REF: 2 } }, out: 'Still polite. Still unbeatable. The striker apologizes for being in your way.' } },

    // ================= YOUTH EXTRA =================
    { id: 'first-boots', min: 14, max: 16, title: 'First Proper Boots',
      desc: 'You saved for months. Two pairs left in your size: timeless black leather, or neon orange with a chrome swoosh.',
      a: { label: 'Timeless black', sub: 'Purist from day one', fx: { stats: { MEN: 1 }, mor: 2 }, out: 'The kit man nods slowly. You have passed an invisible test.' },
      b: { label: 'Neon orange chrome', sub: 'Seen from space', fx: { stats: { DRI: 1 }, mor: 3 }, out: 'You score twice wearing them. They are now "the lucky ones". Forever.' } },
    { id: 'school-tournament', min: 14, max: 16, title: 'Double Booking',
      desc: 'School cup final is two days before your academy trial. Your PE teacher is begging you to play.',
      a: { label: 'Play both, sleep later', sub: 'Legend behavior', fx: { stats: { DRI: 1 }, stam: -8, mor: 3 }, out: 'You win the school cup, then stagger through the trial on fumes. Somehow: enough. Barely.' },
      b: { label: 'Academy only', sub: 'Ruthless priorities', fx: { stats: { MEN: 1 } }, out: 'The school loses 4-1. Your friends forgive you around, oh, never. The academy doesn\'t care. Good.' } },
    { id: 'growth-spurt', min: 14, max: 17, title: 'Eight Centimeters',
      desc: 'You grew 8cm in a year. Your knees click. Your coordination is buffering.',
      a: { label: 'Extra gym work', sub: 'Rebuild the machine', fx: { stats: { PHY: 2, PAC: -1 } }, out: 'Three months of grim work. You come back stronger and slightly less like a baby giraffe.' },
      b: { label: 'Patience and touches', sub: 'Trust the process', fx: { stats: { PAC: 1, MEN: 1 } }, out: 'Slowly the body remembers itself. The touch returns first. The speed follows.' } },
    { id: 'rival-nutmeg', min: 14, max: 18, title: 'The Nutmeg Incident',
      desc: 'A rival academy kid nutmegs you in a youth derby — and celebrates. In your face. With a dance.',
      a: { label: 'Vendetta mode', sub: 'Remember his name', fx: { stats: { MEN: 2 }, form: .02 }, out: 'You write his name on your wall. Next meeting: you win every duel. He stops dancing.' },
      b: { label: 'Shake his hand', sub: 'Kill them with class', fx: { stats: { MEN: 1 }, mor: 2 }, out: 'He looks confused. His coach applauds YOU. Psychological warfare: won without a shot.' } },
    { id: 'rain-session', min: 14, max: 18, title: 'Optional Session',
      desc: 'Horizontal rain. Thunder. The coach texts: "Session optional today."',
      a: { label: 'Go anyway', sub: 'Three others show up', fx: { stats: { PHY: 2, MEN: 1 }, stam: -4 }, out: 'Four idiots in a storm, laughing. The coach watches from his car, quietly impressed.' },
      b: { label: 'Stay dry', sub: 'Recovery is training too', fx: { stam: 4 }, out: 'Hot chocolate, nine hours of sleep. No regrets. Well. One small regret.' } },
    { id: 'idol-shirt', min: 14, max: 17, title: 'The Idol\'s Shirt',
      desc: 'A first-team star you idolize tosses you his training shirt. "Keep it, kid."',
      a: { label: 'Frame it', sub: 'Shrine material', fx: { mor: 5 }, out: 'It hangs above your bed. Some nights you just look at it. Fuel.' },
      b: { label: 'Wear it to bed', sub: 'Obviously', fx: { stats: { MEN: 1 }, mor: 3 }, out: 'It\'s three sizes too big. You have never slept better.' } },
    { id: 'autograph-queue', min: 16, max: 24, title: 'The Queue',
      desc: 'Two hundred kids are waiting at the training ground fence. It\'s freezing. Training starts in 20 minutes.',
      a: { label: 'Sign them all', sub: 'Every single one', fx: { mor: 4, stam: -3 }, out: 'You\'re late to training, but 200 kids will remember this day forever. One cries. You almost do too.' },
      b: { label: 'Club handles it', sub: 'Scheduled signing session', fx: { stats: { MEN: 1 } }, out: 'The club organizes a proper session next week. Efficient. Slightly less magical.' } },
    { id: 'nickname', min: 16, max: 26, title: '"Bambi"',
      desc: 'The locker room has given you a nickname. It\'s "Bambi". Because of the running style. Allegedly.',
      a: { label: 'Embrace the Bambi', sub: 'Own it', fx: { mor: 4 }, out: 'You celebrate your next goal wobbling like a newborn deer. The crowd goes wild. It sticks — affectionately.' },
      b: { label: 'Reject it firmly', sub: 'Absolutely not', fx: { stats: { MEN: 1 }, mor: -2 }, out: 'Your firm rejection guarantees it lasts forever. That\'s how nicknames work. Everyone knows this.' } },
    { id: 'playlist-leak', min: 16, max: 30, title: 'Track 1: Baby Shark',
      desc: 'Your pregame playlist leaked to the squad. Track one is a baby shark remix. There is no context that saves you.',
      a: { label: 'Own it completely', sub: 'Play it in the locker room', fx: { mor: 5, hype: 1 }, out: 'You blast it before the derby. The whole squad ends up chanting it. You win 3-0. It\'s now the anthem.' },
      b: { label: '"It\'s my cousin\'s"', sub: 'Weak defense', fx: { stats: { MEN: 1 } }, out: 'Nobody believes you. The DJ plays it when you score. You\'ve stopped fighting it.' } },
    { id: 'pen-practice', min: 16, max: 24, pos: 'field', title: 'The Crossbar Trials',
      desc: 'The coach picks the new penalty taker via a crossbar challenge. Sudden death.',
      a: { label: 'Enter the trials', sub: 'Hit the crossbar — timing challenge',
        mini: { type: 'timing', results: {
          good: { fx: { stats: { SHO: 2 } }, out: 'CROSSBAR. First try. The squad stops warming up to watch. Penalty duties: secured.' },
          mid: { fx: { stats: { SHO: 1 } }, out: 'Post and in. Not the bar, but top bin. The coach nods. You\'re second in line. For now.' },
          bad: { fx: { mor: -2 }, out: 'You blaze it over. The keeper does a small dance. Duties: not secured.' } } } },
      b: { label: 'Volunteer as keeper', sub: 'Chaos avoidance', fx: { stats: { MEN: 1 } }, out: 'You watch everyone else crack under pressure. Noted for future reference.' } },

    // ================= RISE EXTRA =================
    { id: 'first-red', min: 18, max: 24, title: 'First Red Card',
      desc: 'Straight red. The replay shows you barely touched him. The ref isn\'t reversing it.',
      a: { label: 'Appeal the decision', sub: 'Lawyered up', fx: { stats: { MEN: 1 }, risk: { p: .5, good: { form: .02 }, bad: { form: -.02 } } }, out: '' },
      b: { label: 'Take the hit', sub: 'Learn and move on', fx: { stats: { MEN: 2 } }, out: 'Three-game ban, one lesson: never give the ref a decision to make. The veteran nods approvingly.' } },
    { id: 'boot-bidding-war', min: 18, max: 25, title: 'Bidding War',
      desc: 'Two boot brands are fighting over you. One offers silly money. The other offers their best tech.',
      a: { label: 'Take the silly money', sub: 'Secure the bag', fx: { hype: 2, mor: 3 }, out: 'The announcement video gets 5M views. Your boots are sold out by Friday.' },
      b: { label: 'Take the better boots', sub: 'Performance first', fx: { stats: { PAC: 1, SHO: 1 } }, out: 'The boots are genuinely unreal. You feel half a step sharper. Worth every unsold billboard.' } },
    { id: 'doppelganger', min: 18, max: 28, title: 'The Double',
      desc: 'A fan who looks EXACTLY like you went viral for buying snacks in full kit. Your face. Your number. Not you.',
      a: { label: 'Meet him', sub: 'Content gold', fx: { mor: 5, hype: 2 }, out: 'The side-by-side photo breaks the internet. He\'s invited to a game as your "stunt double".' },
      b: { label: 'Lawyer up', sub: 'This is weird', fx: { stats: { MEN: 1 }, mor: -2 }, out: 'The lawyers send a letter. The internet calls you a killjoy. Both fair, honestly.' } },
    { id: 'broken-promise', min: 19, max: 26, title: 'The Broken Promise',
      desc: 'The manager promised you starts. Three straight benchings later, the promise looks dead.',
      a: { label: 'Knock on his door', sub: 'Respectfully furious', fx: { stats: { MEN: 2 }, risk: { p: .5, good: { form: .04 }, bad: { form: -.03 } } }, out: '' },
      b: { label: 'Prove it Sunday', sub: 'Twenty furious minutes', fx: { form: .03 }, out: 'You come on and play like the pitch insulted your family. The manager avoids eye contact. Then starts you.' } },
    { id: 'fantasy-team', min: 18, max: 32, title: 'Bench Yourself?',
      desc: 'You own yourself in fantasy football. This week you\'re away at the league leaders. Dilemma.',
      a: { label: 'Always start myself', sub: 'Believe', fx: { mor: 3 }, out: 'You captain yourself and score. Screenshot sent to the group chat with zero context needed.' },
      b: { label: 'Bench me, for science', sub: 'Jinx protection', fx: { stats: { MEN: 1 } }, out: 'You score a hat-trick... on the bench of your fantasy team. The group chat is merciless.' } },
    { id: 'winter-camp', min: 18, max: 27, title: 'January Choices',
      desc: 'Optional winter camp in the mountains: brutal hill runs at -5°C. Or... the beach.',
      a: { label: 'Mountain camp', sub: 'Suffer now, fly later', fx: { stats: { PHY: 2, MEN: 1 }, mor: -2 }, out: 'Five days of frozen lungs. In March, everyone else dies in the 80th minute. You sprint.' },
      b: { label: 'Beach', sub: 'Vitamin D is a vitamin', fx: { stam: 6, mor: 4 }, out: 'One week of sun and zero football thoughts. You return as a functional human being.' } },
    { id: 'dna-test', min: 18, max: 30, title: 'The 4% Revelation',
      desc: 'Your DNA test says you\'re 4% from a country famous for producing legends of your position.',
      a: { label: 'Claim it publicly', sub: 'Heritage unlocked', fx: { hype: 2, mor: 2 }, out: 'The interview clip goes viral there. You gain 200K new fans and one extremely proud great-aunt.' },
      b: { label: 'File it away', sub: 'Just a number', fx: { stats: { MEN: 1 } }, out: 'Cool fact. You are who you are. The folder marked "fun facts" grows by one page.' } },
    { id: 'fans-song', min: 19, max: 28, title: 'The Song',
      desc: 'The ultras wrote you a chant. It\'s about your haircut. It\'s not entirely complimentary. It IS catchy.',
      a: { label: 'Sing it with them', sub: 'Self-aware king', fx: { mor: 7, hype: 1 }, out: 'You conduct the away end through three full verses. Instant cult hero status.' },
      b: { label: 'Get a new haircut', sub: 'Problem solved', fx: { mor: 2 }, out: 'New cut, new chant — this one\'s actually flattering. Upgrade complete.' } },
    { id: 'late-callup', min: 18, max: 26, title: 'The 9PM Call',
      desc: '9PM. Coach: "Someone\'s ill. You start tomorrow." Against the league leaders.',
      a: { label: 'I\'m ready', sub: 'Born for this', fx: { stats: { MEN: 2 }, form: .04 }, out: 'You sleep like a baby and play like a veteran. The coach pretends he always believed.' },
      b: { label: 'Panic all night', sub: 'Human response', fx: { stam: -6, form: .01 }, out: 'You watch film until 3AM. Exhausted, wired, and somehow you survive the 90 minutes.' } },
    { id: 'bungee', min: 18, max: 32, title: 'Team Bonding: Bungee',
      desc: 'Team bonding day: bungee jumping off a bridge. Your physio is literally crying.',
      a: { label: 'Jump', sub: 'No fear', fx: { risk: { p: .85, good: { stats: { MEN: 2 }, mor: 6 }, bad: { stam: -15, injury: .4 } } }, out: '' },
      b: { label: 'Photography duty', sub: 'I\'ll hold the camera', fx: { mor: 1 }, out: 'Great photos. The keeper screams like a teakettle. You have evidence forever.' } },
    { id: 'karting-gp', min: 16, max: 28, title: 'The Karting Curse',
      desc: 'Annual team karting GP. You\'re winless in three years. The physio staff has a trophy.',
      a: { label: 'Send it this year', sub: 'Nail the braking zone — timing challenge',
        mini: { type: 'timing', results: {
          good: { fx: { mor: 7 }, out: 'Perfect braking into the hairpin! P1! The curse is broken! The physio staff demands a VAR review.' },
          mid: { fx: { mor: 3 }, out: 'P2. Beaten by a mechanic. Improvement, technically. The group chat shows mercy. Brief mercy.' },
          bad: { fx: { mor: -2 }, out: 'You spin on the main straight. P7. The drought enters year four. The group chat is merciless.' } } } },
      b: { label: 'Become race marshall', sub: 'Strategic retreat', fx: { stats: { MEN: 1 } }, out: 'You wave flags with authority. Undefeated in flag-waving. Legacy secured.' } },

    // ================= PRIME EXTRA =================
    { id: 'statue-poll', min: 26, max: 35, title: 'The Statue Poll',
      desc: 'A fan poll asks if the club should build your statue. It\'s at 78% yes. The sculptor is already rumored.',
      a: { label: '"Not yet, not while I play"', sub: 'Humble route', fx: { stats: { MEN: 2 }, hype: 1 }, out: 'The quote wins over even the rival fans. The poll climbs to 91%.' },
      b: { label: '"Obviously yes"', sub: 'Main character energy', fx: { stats: { MEN: 1 }, hype: 2, mor: 3 }, out: 'The clip becomes a meme. Your teammates chip in for a 30cm garden gnome of you. It\'s glorious.' } },
    { id: 'record-pen', min: 24, max: 32, pos: 'field', title: 'One Goal From History',
      desc: 'You\'re one goal from the club\'s single-season record. Penalty awarded. The regular taker grabs the ball.',
      a: { label: 'Negotiate for it', sub: 'Stop the pointer in the sweet spot',
        mini: { type: 'timing', results: {
          good: { fx: { stats: { SHO: 2, MEN: 2 }, hype: 1 }, out: 'Dead center. You smash it top corner — the record is YOURS. The announcer loses his voice.' },
          mid: { fx: { stats: { SHO: 1 } }, out: 'It squirms under the keeper... POST and in! Ugly. Counts. The record is yours. Barely.' },
          bad: { fx: { stats: { MEN: -2 }, mor: -4 }, out: 'Saved. The keeper stands over you. The record waits. Your negotiation goes viral for the wrong reasons.' } } } },
      b: { label: 'Let him take it', sub: 'Team first', fx: { stats: { MEN: 1 }, mor: 2 }, out: 'He scores, then assists you for the record two weeks later. Football karma is real.' } },
    { id: 'pro-license', min: 28, max: 38, title: 'The Pro License',
      desc: 'The UEFA Pro License course starts soon. Every weekend for a year. Actual homework, again.',
      a: { label: 'Commit fully', sub: 'Future elite coach', fx: { stats: { MEN: 3 }, stam: -5 }, out: 'You graduate top of the class. Your tactical brain now plays chess while others play checkers.' },
      b: { label: 'Later', sub: 'The legs decide', fx: { stam: 3 }, out: 'The badges can wait. Every drop of energy goes to the pitch now.' } },
    { id: 'yacht-dinner', min: 26, max: 34, title: 'The Owner\'s Yacht',
      desc: 'The club owner invites you to dinner on his yacht. Teammates say the last guy who went got a new contract. And a weird painting.',
      a: { label: 'Go to dinner', sub: 'Networking at sea', fx: { hype: 1, mor: 3 }, out: 'Great steak, vague promises, one truly bizarre painting of a horse. You smile through all of it.' },
      b: { label: 'Politely decline', sub: 'Football only', fx: { stats: { MEN: 2 } }, out: 'He respects it. Owners are strange — refusal makes you more interesting.' } },
    { id: 'press-boycott', min: 25, max: 34, title: 'The Fabrication',
      desc: 'A tabloid completely fabricated a story about you. Full invention. Your lawyer says sue; your heart says war.',
      a: { label: 'Boycott the press', sub: 'Silence as protest', fx: { stats: { MEN: 2 }, hype: -1, mor: 2 }, out: 'One month of silence. The tabloid prints a correction on page 19. You frame it anyway.' },
      b: { label: 'Kill them with kindness', sub: 'Jedi move', fx: { stats: { MEN: 1 }, hype: 1 }, out: 'You invite the journalist to training. He writes a redemption piece so glowing it\'s embarrassing.' } },
    { id: 'podcast-launch', min: 24, max: 38, title: 'Your Own Podcast',
      desc: 'A producer pitches: your own weekly podcast. Hot takes, guests, your unfiltered voice.',
      a: { label: 'Launch it', sub: 'The people need truth', fx: { hype: 2, stats: { MEN: 1 }, stam: -3 }, out: 'Episode 4 — the story about the team bus — becomes legendary. Downloads go seven figures.' },
      b: { label: 'No time for that', sub: 'Priorities', fx: { stats: { MEN: 1 } }, out: 'You stay mysterious. In 2026, mystery is the rarest commodity of all.' } },
    { id: 'chess-club', min: 18, max: 34, title: 'Club Chess Tournament',
      desc: 'The club chess tournament final. You vs the backup left-back. He hums when he\'s winning.',
      a: { label: 'Destroy him', sub: 'No mercy', fx: { risk: { p: .55, good: { stats: { MEN: 2 }, mor: 3 }, bad: { mor: -2 } } }, out: '' },
      b: { label: 'Withdraw gracefully', sub: 'Save the friendship', fx: { stam: 2 }, out: 'He wins by default and tells everyone you were scared. You\'ll live with it. Probably.' } },
    { id: 'contract-three-way', min: 22, max: 31, title: 'The Three-Way Deal',
      desc: 'Contract renewal time. Your agent lays out three structures. The club is waiting.',
      a: { label: 'Long deal, max security', sub: 'Settle in', fx: { stats: { MEN: 1 }, mor: 4 }, out: 'Five years, guaranteed. The fans celebrate. You buy furniture. Real furniture.' },
      b: { label: 'Short deal, bet on yourself', sub: 'High risk, high ceiling', fx: { risk: { p: .6, good: { hype: 2, form: .03 }, bad: { form: -.02 } } }, out: '' },
      c: { label: 'Release clause special', sub: 'Keep the door open', fx: { stats: { MEN: 2 } }, out: 'A €120M release clause. Specific enough to scare the club, low enough to dream. Chess.' } },
    { id: 'sponsor-three', min: 18, max: 28, title: 'Sponsor Activation Day',
      desc: 'Sponsor day. Three activations on the table. You can only pick one.',
      a: { label: 'Gaming tournament', sub: 'vs fans, live', fx: { mor: 5, hype: 1 }, out: 'You lose to a 14-year-old in front of 40K viewers. The clip is beloved. Your ego recovers by Thursday.' },
      b: { label: 'Kids\' clinic', sub: 'Give back', fx: { stats: { MEN: 2 }, mor: 3 }, out: 'One kid asks if you\'re famous. Another nutmegs you cold. Best afternoon all season.' },
      c: { label: 'Fashion shoot', sub: 'High fashion chaos', fx: { hype: 2, stam: -3 }, out: 'You wear something called "deconstructed tailoring". The internet can\'t decide. Engagement: record.' } },

    // ================= VETERAN EXTRA =================
    { id: 'academy-director', min: 33, max: 40, title: 'The Next Chapter Offer',
      desc: 'The club offers you the academy director role — starting the day you retire.',
      a: { label: 'Accept', sub: 'Build the next you', fx: { stats: { MEN: 2 }, mor: 4 }, out: 'You already have a notebook of ideas. The kids will eat differently, train smarter, dream bigger.' },
      b: { label: 'TV first, chaos first', sub: 'Punditry arc', fx: { hype: 1 }, out: 'You can already hear your first hot take. The academy job will wait. Probably.' } },
    { id: 'last-derby', min: 33, max: 40, title: 'The Last Derby',
      desc: 'Probably your last derby at this stadium. The fans are preparing a tifo with your face on it.',
      a: { label: 'Cry later, score first', sub: 'Business', fx: { stats: { MEN: 2 }, form: .04 }, out: 'You score. The stadium shakes. You allow yourself exactly three seconds of tears. On camera. Iconic.' },
      b: { label: 'Soak in every second', sub: 'Memory mode', fx: { mor: 6 }, out: 'You arrive two hours early just to sit in the empty stands. Some things are bigger than the result.' } },
    { id: 'record-watch', min: 32, max: 40, title: '12 From Immortality',
      desc: 'You\'re 12 appearances from the club\'s all-time record. Your body votes no. History votes yes.',
      a: { label: 'Chase the record', sub: 'Immortality', fx: { stats: { MEN: 2 }, form: .03 }, out: 'Every appearance is a war. The record falls in April. The stadium announcer\'s voice cracks announcing it.' },
      b: { label: 'Listen to the body', sub: 'Longevity over glory', fx: { stam: 5 }, out: 'You rest strategically. The record survives. So do you. Trade accepted.' } },
    { id: 'rival-bench-offer', min: 34, max: 40, title: 'The Unthinkable Offer',
      desc: 'Your club\'s biggest rival offers you a coaching role for after you retire.',
      a: { label: 'Accept the heresy', sub: 'Football is football', fx: { stats: { MEN: 2 }, hype: 1 }, out: 'The statement is one sentence: "Football is football." Half the fanbase forgives you. Eventually.' },
      b: { label: 'Never the rival', sub: 'Loyalty forever', fx: { mor: 4, stats: { MEN: 1 } }, out: 'The fans find out and sing your name for ten straight minutes. Some doors stay shut. Beautifully.' } },
    { id: 'farewell-speech', min: 28, max: 40, title: 'The Farewell Speech',
      desc: 'A teammate of 11 years is leaving. He asked YOU to give the speech. You cry at commercials.',
      a: { label: 'Give the speech', sub: 'Hold it together', fx: { risk: { p: .6, good: { mor: 5, stats: { MEN: 1 } }, bad: { mor: -3 } } }, out: '' },
      b: { label: 'Delegate to the captain', sub: 'Self-preservation', fx: { stats: { MEN: 1 } }, out: 'The captain delivers a solid B+. You hug him after anyway. No mic required.' } },
    { id: 'boot-room-secret', min: 16, max: 23, title: 'The Veteran\'s Ritual',
      desc: 'The 36-year-old veteran shows you his pre-match shinpad ritual. It involves tape, prayer, and a specific order.',
      a: { label: 'Adopt the ritual', sub: 'Respect the craft', fx: { mor: 3 }, out: 'You do it before the next match. Clean performance. Coincidence? You\'ll never skip it again.' },
      b: { label: 'No superstitions', sub: 'Science only', fx: { stats: { MEN: 2 } }, out: 'He nods. "You\'ll develop your own," he says. He\'s right. It\'s weirder than his.' } },
    { id: 'five-a-side', min: 16, max: 24, title: 'The Sunday Invite',
      desc: 'Your old friends\' Sunday 5-a-side team wants you back for the grudge match. The club definitely won\'t approve.',
      a: { label: 'Play anyway', sub: 'For the boys', fx: { mor: 5, risk: { p: .8, good: { }, bad: { stam: -8, injury: .3 } } }, out: '' },
      b: { label: 'Watch from the fence', sub: 'Sensible pro', fx: { mor: 2 }, out: 'You watch, eat a hot dog, and shout tactical advice nobody follows. Perfect Sunday.' } },

    // ================= LIFE OFF THE PITCH =================
    { id: 'tattoo', min: 16, max: 40, kicker: 'LIFE OFF THE PITCH', title: 'The Tattoo Decision',
      desc: 'Tattoo artist booked. The design: your debut date in roman numerals. On your neck. Your mom doesn\'t know yet.',
      a: { label: 'Get the ink', sub: '70% fire / 30% regret', fx: { risk: { p: .7, good: { stats: { MEN: 1 }, mor: 5, hype: 1 }, bad: { stats: { MEN: -1 }, mor: -4 } } }, out: '' },
      b: { label: 'Fake one first', sub: 'Trial run', fx: { stats: { MEN: 1 } }, out: 'The temporary one looks good. You book the real thing for the international break. Mom never finds out. Perfect.' } },
    { id: 'startup-pitch', min: 20, max: 35, kicker: 'LIFE OFF THE PITCH', title: '"Uber for Dog Walkers"',
      desc: 'A teammate pitches his app. He needs €200K. He has a PowerPoint. The PowerPoint has clip art.',
      a: { label: 'Invest', sub: 'Believe in the vision', fx: { risk: { p: .5, good: { hype: 2, mor: 3 }, bad: { mor: -3 } } }, out: '' },
      b: { label: 'Politely pass', sub: 'Clip art was the tell', fx: { stats: { MEN: 1 } }, out: 'Six months later the app folds. You buy him a coffee. He pivots to NFTs. You buy him another coffee.' } },
    { id: 'cooking-disaster', min: 18, max: 40, kicker: 'LIFE OFF THE PITCH', title: 'The Smoke Alarm Symphony',
      desc: 'You burned pasta. The smoke alarm disagreed. The neighbors now know your cooking level personally.',
      a: { label: 'Take cooking classes', sub: 'Self-improvement', fx: { mor: 4, stats: { PHY: 1 } }, out: 'Eight weeks later you make a risotto that makes the chef tear up. Life skills unlocked.' },
      b: { label: 'Meal prep service', sub: 'Delegate', fx: { stam: 3, mor: 2 }, out: 'A chef now preps your week. Your macros have never been cleaner. The neighbors mourn nothing.' } },
    { id: 'language-barrier', min: 16, max: 24, kicker: 'LIFE OFF THE PITCH', title: 'Three Languages',
      desc: 'The locker room speaks three languages. Yours isn\'t one of them. The jokes are definitely about you sometimes.',
      a: { label: 'Take lessons', sub: 'Unlock the banter', fx: { stats: { MEN: 2 }, mor: 2 }, out: 'Six months later you crack a joke in the local slang. The room erupts. You\'re in.' },
      b: { label: 'Football is universal', sub: 'Let feet talk', fx: { mor: 1 }, out: 'You smile, nod, and score. Everyone understands a top-corner finish.' } },
    { id: 'driving-test', min: 16, max: 19, kicker: 'LIFE OFF THE PITCH', title: 'Parallel Parking',
      desc: 'Driving test tomorrow. You can dismantle a press, but parallel parking haunts your dreams.',
      a: { label: 'Take the test', sub: '60% pass energy', fx: { risk: { p: .6, good: { mor: 6 }, bad: { mor: -3 } } }, out: '' },
      b: { label: 'Team bus for now', sub: 'Delay the nightmare', fx: { stats: { MEN: 1 } }, out: 'The kit man drives you and gives life advice. Honestly? Better than a license.' } },
    { id: 'stray-dog', min: 18, max: 35, kicker: 'LIFE OFF THE PITCH', title: 'The Stray',
      desc: 'A stray dog followed you home from training. He\'s sitting at your door. He looks like he pays rent.',
      a: { label: 'Adopt him', sub: 'He chose you', fx: { mor: 7, stats: { MEN: 1 } }, out: 'You name him after your first coach. He becomes the club\'s unofficial mascot. The fans make scarves.' },
      b: { label: 'Find him a home', sub: 'Responsible route', fx: { mor: 2 }, out: 'The physio adopts him. You get visiting rights. Everyone wins, especially the dog.' } },
    { id: 'ranked-grind', min: 16, max: 26, kicker: 'LIFE OFF THE PITCH', title: 'The 4AM Grind',
      desc: 'Ranked grind until 4AM again. Training is at 9. The season pass won\'t complete itself.',
      a: { label: 'One more season pass', sub: 'It\'s basically rest', fx: { stats: { PAC: -1 }, stam: -8, mor: 4 }, out: 'You hit the rank. Training is a horizontal blur. The coach asks if you\'re "feeling okay".' },
      b: { label: 'Uninstall', sub: 'Cold turkey', fx: { stats: { MEN: 2 }, stam: 4 }, out: 'You sleep nine hours and wake up seeing the Matrix. The account stays dormant. Mostly.' } },
    { id: 'dad-agent', min: 16, max: 22, kicker: 'LIFE OFF THE PITCH', title: 'Agent Dad',
      desc: 'Dad wants to be your agent. His qualification: "I watched every game you ever played." His commission plan: pocket money rates.',
      a: { label: 'Family first', sub: 'Agent Dad activated', fx: { mor: 3, risk: { p: .6, good: { }, bad: { hype: -1, mor: -4 } } }, out: '' },
      b: { label: 'Professional agent', sub: 'Business is business', fx: { stats: { MEN: 1 } }, out: 'Dad takes it well. He still negotiates your birthday cake distribution with extreme prejudice.' } },
    { id: 'foundation', min: 22, max: 40, kicker: 'LIFE OFF THE PITCH', title: 'The Foundation',
      desc: 'Your hometown needs a pitch. The kids play on concrete. You know exactly what that concrete tastes like.',
      a: { label: 'Build the pitch', sub: 'Full circle', fx: { mor: 8, hype: 2, stats: { MEN: 1 } }, out: 'Opening day: 500 kids, one ribbon, and your old coach cutting it. The pitch has your name. Obviously.' },
      b: { label: 'Later this year', sub: 'Season first', fx: { stats: { MEN: 1 } }, out: 'You write the check in the summer anyway. The concrete can wait three more months.' } },
    { id: 'penthouse-vs-pitch', min: 18, max: 30, kicker: 'LIFE OFF THE PITCH', title: 'The Apartment Question',
      desc: 'Two options: minimalist penthouse with skyline views, or a modest place seven minutes from training.',
      a: { label: 'Penthouse', sub: 'You earned the view', fx: { mor: 5, stam: -3 }, out: 'Sunrise over the city, every morning. The commute is 40 minutes. Worth it? Ask again in February.' },
      b: { label: 'Near training', sub: 'Seven-minute commute', fx: { stam: 5 }, out: 'You sleep 40 extra minutes daily. Over a season, that\'s 240 hours of recovery. Boring genius.' } },
    { id: 'mural-face', min: 20, max: 32, kicker: 'LIFE OFF THE PITCH', title: 'The Mural',
      desc: 'Your hometown painted a mural of you. It looks... let\'s say "impressionistic". The chin is doing a lot of work.',
      a: { label: 'Unveil it laughing', sub: 'Lean in', fx: { mor: 6, hype: 1 }, out: 'Your speech: "Finally, art that captures my essence." The town loves you even more.' },
      b: { label: 'Quietly commission a fix', sub: 'Subtle corrections', fx: { stats: { MEN: 1 } }, out: 'A real artist "restores" it overnight. The town never mentions the chin again.' } },
    { id: 'stadium-proposal', min: 24, max: 36, kicker: 'LIFE OFF THE PITCH', title: 'The Halftime Question',
      desc: 'You\'re planning THE proposal. Option A: midfield at halftime, 60,000 witnesses. Option B: private beach at sunset.',
      a: { label: 'Midfield, halftime', sub: '70% she says yes', fx: { risk: { p: .7, good: { mor: 10, hype: 2 }, bad: { mor: -8, stats: { MEN: -1 }, hype: 1 } } }, out: '' },
      b: { label: 'Private beach', sub: 'The safe yes', fx: { mor: 6 }, out: 'Sunset, waves, one knee, zero camera phones. She says yes before you finish the question.' } },
    { id: 'tax-letter', min: 22, max: 40, kicker: 'LIFE OFF THE PITCH', title: 'The Letter',
      desc: 'A letter from the tax office. Your accountant read it twice and went pale.',
      a: { label: 'Full cooperation', sub: 'Clean hands', fx: { mor: -3, stats: { MEN: 1 } }, out: 'Six weeks of paperwork. Verdict: an honest error, small fine. Your accountant ages five years.' },
      b: { label: 'Lawyers, assemble', sub: 'Legal defense', fx: { mor: -2, hype: 1 }, out: 'The lawyers find the error was in YOUR favor. The tax office owes YOU money. Glorious.' } },
    { id: 'sleep-tracker', min: 18, max: 32, kicker: 'LIFE OFF THE PITCH', title: '"Concerning" Deep Sleep',
      desc: 'Your new sleep tracker rated your deep sleep "concerning". It vibrates in disappointment.',
      a: { label: 'Full sleep protocol', sub: 'Become a sleep athlete', fx: { stam: 8, stats: { PHY: 1 } }, out: 'Blackout curtains, no screens, magnesium. Three weeks later the tracker says "elite".' },
      b: { label: 'Delete the app', sub: 'Ignorance is recovery', fx: { mor: 1 }, out: 'You sleep fine knowing nothing is judging you. Some data is better unread.' } },
    { id: 'reunion', min: 20, max: 33, kicker: 'LIFE OFF THE PITCH', title: 'The Reunion',
      desc: 'School reunion. The kid who said you\'d "never make it" is asking for a selfie. With you. For his son.',
      a: { label: 'Gracious selfie', sub: 'Class act', fx: { stats: { MEN: 2 }, mor: 4 }, out: 'You sign the ball for his kid too. Kindness is the best revenge — it\'s also the most confusing for him.' },
      b: { label: 'Petty zoom on the watch', sub: 'Subtle flex', fx: { mor: 5, hype: 1 }, out: 'You take the selfie ensuring your watch is perfectly framed. Petty? Yes. Satisfying? Also yes.' } },
    { id: 'soundcloud', min: 18, max: 30, kicker: 'LIFE OFF THE PITCH', title: 'The SoundCloud Leak',
      desc: 'Your teammates found your SoundCloud. You have four tracks. One is... experimental.',
      a: { label: 'Drop the fifth single', sub: 'Artist mode', fx: { hype: 2, risk: { p: .5, good: { mor: 4 }, bad: { mor: -4 } } }, out: '' },
      b: { label: 'Delete the evidence', sub: 'Nothing happened', fx: { stats: { MEN: 1 } }, out: 'Too late. The keeper already made it his warm-up song. It slaps, apparently. Reluctantly.' } },
    { id: 'altitude-tent', min: 24, max: 36, kicker: 'LIFE OFF THE PITCH', title: 'The Spaceship',
      desc: 'Sleeping in an altitude tent adds 4% red blood cells. Your partner says it looks like a spaceship landed on the bed.',
      a: { label: 'Spaceship it is', sub: 'Marginal gains', fx: { stats: { PHY: 2 }, stam: 5, mor: -2 }, out: 'You sleep in low orbit. The stamina boost is real. The relationship diplomacy costs are also real.' },
      b: { label: 'Normal bed, normal life', sub: 'Harmony', fx: { mor: 3 }, out: 'Some gains aren\'t worth the domestic negotiations. The tent goes back in its box.' } },
    { id: 'fan-letter', min: 16, max: 24, kicker: 'LIFE OFF THE PITCH', title: 'The Letter',
      desc: 'A handwritten letter from a 9-year-old in the hospital. She says your goal against the leaders made her forget the needles for 90 minutes.',
      a: { label: 'Visit her', sub: 'Immediately', fx: { mor: 8, stats: { MEN: 2 } }, out: 'You spend an afternoon playing cards. Her nurses take photos. You leave a different person.' },
      b: { label: 'Signed match shirt', sub: 'Match-worn, still grass-stained', fx: { mor: 3 }, out: 'The shirt arrives with a video message. Her mom sends back a photo of the biggest smile ever recorded.' } },
    { id: 'baller-coin', min: 20, max: 34, kicker: 'LIFE OFF THE PITCH', title: '$BALLER Coin',
      desc: 'A teammate is deep into a crypto called $BALLER. "It\'s the future, bro. Get in now." The logo is a moon with cleats.',
      a: { label: 'APE IN', sub: '35% moon / 65% crater', fx: { risk: { p: .35, good: { mor: 5, hype: 1 }, bad: { mor: -5, stats: { MEN: -1 } } } }, out: '' },
      b: { label: 'Block and report', sub: 'Financial literacy', fx: { stats: { MEN: 1 } }, out: 'Three weeks later the coin is down 97%. You never mention it. He knows that you know.' } },
    { id: 'grandpa-vhs', min: 16, max: 40, kicker: 'LIFE OFF THE PITCH', title: 'The VHS Archive',
      desc: 'Grandpa recorded every game of yours on VHS. He wants a full tactical debrief. He has notes. Color-coded notes.',
      a: { label: 'Sunday debrief', sub: 'Best analyst alive', fx: { mor: 6, stats: { MEN: 1 } }, out: 'His analysis of your positioning is... genuinely correct? You implement two of his suggestions.' },
      b: { label: 'Send him the PDF', sub: 'Remote debrief', fx: { mor: 2 }, out: 'He replies with a 4-page critique. In handwriting. Scanned. He\'s not wrong about the third point.' } },

    // ================= HIGH STAKES (luck/gamble) =================
    { id: 'shootout-hero', min: 18, max: 34, pos: 'field', kicker: 'MOMENT OF TRUTH', title: 'Fifth Taker',
      desc: 'Cup quarterfinal. Penalty shootout. 4-4. You\'re the fifth taker. The whole season walks with you to the spot.',
      a: { label: 'Take the kick', sub: 'Pick your spot — 2 of 5 zones win it',
        mini: { type: 'penalty', zones: 5, goodZones: 2, results: {
          good: { fx: { stats: { MEN: 3 }, form: .05, hype: 2 }, out: 'Bottom corner, keeper rooted. The squad mobs you at the halfway line. HERO OF THE NIGHT.' },
          bad: { fx: { stats: { MEN: -2 }, mor: -6, form: -.03 }, out: 'Saved. The keeper points to the sky. The walk back is the longest 40 meters in football.' } } } },
      b: { label: 'Someone else steps up', sub: 'Not tonight', fx: { stats: { MEN: -1 } }, out: 'The kid takes it and scores. You\'re relieved and quietly furious at yourself. Complex emotions.' } },
    { id: 'casino-night', min: 21, max: 40, kicker: 'HIGH STAKES', title: 'Team Casino Night',
      desc: 'Charity casino night. You\'re up big at the blackjack table. The dealer looks worried. Your captain looks worried too.',
      a: { label: 'Let it ride', sub: '45% double / 55% bust', fx: { risk: { p: .45, good: { mor: 8 }, bad: { mor: -6, hype: 1 } } }, out: '' },
      b: { label: 'Cash out', sub: 'Walk away a winner', fx: { stats: { MEN: 1 }, mor: 2 }, out: 'You donate the winnings to the charity. The dealer exhales. The captain nods with deep respect.' } },
    { id: 'coin-flip-captain', min: 18, max: 28, kicker: 'HIGH STAKES', title: 'The Coin Flip',
      desc: 'The coach can\'t pick between you and the veteran for the armband. His solution: an actual coin flip. In front of everyone.',
      a: { label: 'Call heads', sub: '50/50 destiny', fx: { risk: { p: .5, good: { stats: { MEN: 3 }, mor: 4 }, bad: { mor: -2 } } }, out: '' },
      b: { label: 'Withdraw your name', sub: 'The veteran deserves it', fx: { stats: { MEN: 1 } }, out: 'The veteran wins by default — and names YOU his vice-captain. Respect compounds.' } },
    { id: 'transfer-roulette', min: 20, max: 30, kicker: 'HIGH STAKES', title: 'The Blind Pick',
      desc: 'Your agent, grinning: "Two offers. Identical money. One glamour, one ambition. You have 24 hours."',
      a: { label: 'Red: the glamour club', sub: 'Big name, weak league', fx: { hype: 2, stats: { MEN: 1 } }, out: 'The billboard money is real. The Tuesday night atmosphere is not. Choices were made.' },
      b: { label: 'Black: the ambitious project', sub: 'Small club, big dreams', fx: { form: .03, stats: { MEN: 1 } }, out: 'No glamour, all project. The coach\'s five-year plan has your name on page one.' },
      c: { label: 'Walk away from both', sub: 'I decide my future', fx: { stats: { MEN: 2 } }, out: 'Your agent nearly faints. Two weeks later a better offer arrives. Patience: vindicated.' } },
    { id: 'mystery-boots', min: 16, max: 24, kicker: 'HIGH STAKES', title: 'The Unmarked Box',
      desc: 'An unmarked box arrives at training: prototype boots, your exact size, no note. The kit man knows nothing.',
      a: { label: 'Wear them', sub: '60% rocket ship / 40% blister city', fx: { risk: { p: .6, good: { stats: { PAC: 1, DRI: 1 } }, bad: { stam: -5, mor: -2 } } }, out: '' },
      b: { label: 'Donate them', sub: 'Not today, mystery box', fx: { stats: { MEN: 1 } }, out: 'The academy kid who gets them scores a hat-trick. You feel... fine. Mostly fine. Fine-ish.' } },
    { id: 'allstar-conflict', min: 20, max: 32, kicker: 'HIGH STAKES', title: 'The Scheduling War',
      desc: 'The All-Star charity game invite lands the same weekend as the family vacation you promised. Both sides are watching.',
      a: { label: 'Play the All-Star game', sub: 'Duty calls', fx: { hype: 2, mor: -3 }, out: 'You shine on the gala night. The family vacation is "postponed". The group chat is icy.' },
      b: { label: 'Family first', sub: 'Promise kept', fx: { mor: 6 }, out: 'Beach, board games, zero football for four days. Your sister still beats you at cards. Perfect.' } },
    { id: 'international-fumes', min: 20, max: 33, kicker: 'HIGH STAKES', title: 'Running On Fumes',
      desc: 'The national team calls you up for a friendly. You\'ve played 50 games this year. Your body is sending formal complaints.',
      a: { label: 'Go anyway', sub: 'Country over everything', fx: { stats: { MEN: 1 }, stam: -10, risk: { p: .75, good: { }, bad: { injury: .5, stam: -10 } } }, out: '' },
      b: { label: 'Withdraw', sub: 'The long game', fx: { stam: 8, hype: -1 }, out: 'The coach understands. The talk shows do not. Your hamstrings send a thank-you card.' } },
    { id: 'snow-game', min: 16, max: 40, kicker: 'HIGH STAKES', title: 'The Gloves Debate',
      desc: 'Match day in heavy snow. The locker room is split: gloves and snood, or short sleeves like a warrior poet.',
      a: { label: 'Gloves and snood', sub: 'Warm and sensible', fx: { form: .01, stats: { MEN: 1 } }, out: 'You\'re warm, you\'re comfortable, you play well. The hardmen judge you silently.' },
      b: { label: 'Short sleeves', sub: 'Intimidation tactic', fx: { stats: { MEN: 2 }, risk: { p: .7, good: { }, bad: { stam: -6 } } }, out: '' } },
    { id: 'play-through-pain', min: 18, max: 32, kicker: 'HIGH STAKES', title: 'Seventy Percent Fit',
      desc: 'A knock in training leaves you at 70%. The derby is Saturday. The physio shrugs: "Your call, champ."',
      a: { label: 'Play the derby', sub: '65% glory / 35% disaster', fx: { risk: { p: .65, good: { stats: { MEN: 2 }, form: .03 }, bad: { injury: .6, stam: -20, form: -.04 } } }, out: '' },
      b: { label: 'Rest and recover', sub: 'The season is long', fx: { stam: 8, form: -.01 }, out: 'You watch from the stands eating sunflower seeds. The replacement scores. You\'re happy. You\'re devastated. You\'re happy.' } },

    // ================= GK EXTRA =================
    { id: 'gk-goal-kicks', min: 16, max: 24, pos: 'gk', title: 'The Cannon Stat',
      desc: 'A stat account posts: your goal kicks travel further than any keeper in the league. The fans have opinions about style.',
      a: { label: 'Keep launching it', sub: 'The cannon stays', fx: { stats: { PAS: 2 }, hype: 1 }, out: 'One goal kick assists a goal. The stat account crowns you king. The purists still grumble.' },
      b: { label: 'Play it short', sub: 'Modern keeper', fx: { stats: { COM: 2 } }, out: 'You become the 11th outfield player. One heart-stopping moment per game, but the coach loves it.' } },
    { id: 'gk-pizza-ritual', min: 14, max: 19, pos: 'gk', title: 'The Pizza Streak',
      desc: 'Three straight clean sheets. Your ritual: same pizza place, same order, every Friday. The nutritionist is suspicious.',
      a: { label: 'Keep the ritual', sub: 'Never change a streak', fx: { mor: 8, stats: { COM: 1 } }, out: 'The streak reaches six games. The pizza place names the order after you. Sacred.' },
      b: { label: 'Nutritionist wins', sub: 'Broccoli mode', fx: { stats: { REF: 1 }, mor: -3 }, out: 'You concede in the next game. Correlation isn\'t causation, but you glare at the broccoli anyway.' } },
    { id: 'gk-crossbar-bet', min: 18, max: 26, pos: 'gk', title: 'Keeper vs Keeper',
      desc: 'Crossbar challenge vs the backup keeper. Loser buys dinner for the whole goalkeeping union.',
      a: { label: 'It\'s on', sub: '50/50 dinner bill', fx: { risk: { p: .5, good: { stats: { COM: 1 }, mor: 5 }, bad: { mor: -4 } } }, out: '' },
      b: { label: 'Professional decline', sub: 'Union harmony', fx: { stats: { COM: 1 } }, out: 'You split the bill instead. The goalkeeping union remains the tightest group in the club.' } },
    { id: 'gk-number-one-race', min: 20, max: 30, pos: 'gk', title: 'The #1 Race',
      desc: 'The media frames it as war: you vs the other keeper for the national team #1 shirt. He gave an interview yesterday. It was spicy.',
      a: { label: 'Public respect', sub: '"He pushes me higher"', fx: { stats: { LEA: 2 } }, out: 'Your classy answer makes the rounds. The national coach calls it "exactly the mentality we want".' },
      b: { label: '"I\'m simply better"', sub: 'Spice received, spice returned', fx: { stats: { COM: 2 }, hype: 1 }, out: 'The quote trends for days. The debate show dedicates a full hour. You save everything that week.' } },
    { id: 'gk-finger-scare', min: 18, max: 30, pos: 'gk', title: 'The Finger',
      desc: 'Your pinky finger hurts since Tuesday. Scans say "manageable". Keepers know what "manageable" means.',
      a: { label: 'Play through it', sub: '70% fine / 30% oh no', fx: { risk: { p: .7, good: { stats: { REF: 1 } }, bad: { injury: .4, stats: { REF: -1 } } } }, out: '' },
      b: { label: 'Rest it properly', sub: 'Hands are the job', fx: { stam: 4, form: -.01 }, out: 'Two weeks of catching tennis balls in rehab. The pinky heals into a weapon.' } },
    { id: 'gk-outfield-cameo', min: 22, max: 32, pos: 'gk', title: '"Fancy 10 Up Front?"',
      desc: 'Cup game, 4-0 up, 80th minute. The coach grins: "Fancy 10 minutes up front?" The bench is already laughing.',
      a: { label: 'DO IT', sub: '90% fun / 10% viral fail', fx: { risk: { p: .9, good: { mor: 8, hype: 2 }, bad: { mor: -3, hype: 1 } } }, out: '' },
      b: { label: 'Gloves stay on', sub: 'Dignity preserved', fx: { stats: { COM: 1 } }, out: 'You stay between the posts. The fans chant your name anyway. The coach respects the professionalism.' } },
    { id: 'gk-pen-taker', min: 20, max: 32, pos: 'gk', title: 'The Keeper Takes It',
      desc: 'Nobody wants the penalties anymore. You\'ve never missed in training. The captain looks at you. Everyone looks at you.',
      a: { label: 'Step up', sub: 'Pick your spot — 2 of 5 zones make you a legend',
        mini: { type: 'penalty', zones: 5, goodZones: 2, results: {
          good: { fx: { stats: { COM: 3 }, hype: 2 }, out: 'TOP BIN. Keeper vs keeper and you WON. The bench empties. You are a striker now. Officially.' },
          bad: { fx: { stats: { COM: -2 }, mor: -5 }, out: 'You sky it into the stands. The other keeper doesn\'t celebrate, which makes it worse. Meme\'d for weeks.' } } } },
      b: { label: 'Stay in goal', sub: 'Know your lane', fx: { stats: { LEA: 1 } }, out: 'The winger takes it and scores. You celebrate like you scored it yourself. Correct decision. Probably.' } },
    { id: 'gk-zonal-theory', min: 24, max: 34, pos: 'gk', title: '47 Pages of Zonal',
      desc: 'The new set-piece coach arrives with 47 pages of zonal marking theory. Your defenders look like students who didn\'t read the book.',
      a: { label: 'Embrace the system', sub: 'Student of the game', fx: { stats: { VIS: 2, LEA: 1 } }, out: 'By month two you\'re organizing the box like an air traffic controller. Set-piece goals conceded: halved.' },
      b: { label: 'Old school man-marking', sub: 'If it works...', fx: { stats: { REF: 1 } }, out: 'You defend set pieces the way your grandfather intended. The coach adapts. Compromise reached.' } },
    { id: 'gk-testimonial', min: 30, max: 40, pos: 'gk', title: 'The Legend\'s Testimonial',
      desc: 'A retiring legend asks you to play in goal for his testimonial. The strikers are all his friends. They will NOT go easy on you.',
      a: { label: 'Honor him', sub: 'Save everything anyway', fx: { mor: 6, stats: { LEA: 1 } }, out: 'You save three sitters and the legend laughs until he cries. The crowd gives YOU the ovation. Perfect.' },
      b: { label: 'Rest that weekend', sub: 'Body first', fx: { stam: 6 }, out: 'You watch from the stands. The backup keeper concedes four. The legend is happy. Everyone is happy.' } },
    { id: 'gk-bonus-clause', min: 18, max: 28, pos: 'gk', title: 'The Clean Sheet Clause',
      desc: 'Contract detail: the club offers a fat bonus per clean sheet. Your defenders suddenly have opinions about your positioning.',
      a: { label: 'Take the clause', sub: 'Incentivize greatness', fx: { stats: { COM: 1 }, hype: 1 }, out: 'The defenders now block shots like their own money is on the line. Collective bargaining, keeper style.' },
      b: { label: 'Team bonus instead', sub: 'All for one', fx: { stats: { LEA: 2 } }, out: 'The clause becomes a team dinner fund per clean sheet. The dressing room has never been so united.' } },
    { id: 'gk-liked-post', min: 16, max: 26, pos: 'gk', title: 'The Accidental Like',
      desc: 'You liked a post mocking your own defense. At 2AM. Screenshots are forever.',
      a: { label: 'Own it publicly', sub: '"Fat fingers, my bad"', fx: { mor: -3, hype: 1 }, out: 'Your honesty defuses it. The center-back still gives you the silent treatment for two days.' },
      b: { label: 'Dinner for the back four', sub: 'Apology steakhouse', fx: { stats: { LEA: 2 } }, out: 'Steaks fix everything. By dessert, the incident is a running joke. By coffee, it\'s legend.' } },
    { id: 'gk-storm-game', min: 14, max: 20, pos: 'gk', title: 'The Storm Game',
      desc: 'Away game. Horizontal rain. 60km/h wind. Warmups are pure chaos. The other keeper looks terrified.',
      a: { label: 'Love the chaos', sub: 'Storm keeper activated', fx: { stats: { COM: 2 } }, out: 'You catch everything in the hurricane. The other keeper concedes a wind-assisted howler. Elements: mastered.' },
      b: { label: 'Survival mode', sub: 'Just get through it', fx: { stats: { REF: 1 } }, out: 'You punch everything instead of catching. Zero risks, zero goals conceded. Boring brilliance.' } },

    // ================= LEGEND ICON DECISIONS =================
    { id: 'legend-mentor-session', min: 16, max: 36, title: 'The Mentor\'s Visit',
      desc: 'A legendary icon of your nation visits training. After practice, he walks over to give you personalized guidance.',
      a: { label: 'Absorb the advice', sub: 'Study his movements', fx: { stats: { MEN: 2, VIS: 1 }, mor: 5 }, out: 'He spends 30 minutes correcting your body shape before receiving. Your vision unlocks.' },
      b: { label: 'Gift your match jersey', sub: 'Show deep respect', fx: { mor: 8, hype: 2 }, out: 'The legend smiles, puts his arm around you, and posts a picture with your shirt. Social media explodes.' } },
    { id: 'national-legend-call', min: 18, max: 35, title: 'Call from a Legend',
      desc: 'A legendary icon of your national team calls you personally on the phone before the international break.',
      a: { label: 'Accept his mentorship', sub: 'Listen intently', fx: { stats: { LEA: 2, MEN: 1 }, mor: 6 }, out: 'He shares his secrets on handling pressure in high-stakes games. Your confidence skyrockets.' },
      b: { label: 'Keep it brief', sub: 'Stay focused', fx: { mor: 4 }, out: 'You thank him politely. He wishes you luck and promises to watch your next match.' } },
    { id: 'legend-masterclass', min: 17, max: 34, title: 'Private Masterclass',
      desc: 'An iconic club legend conducts an exclusive 1-on-1 masterclass on positioning just for you.',
      a: { label: 'Study film with him', sub: 'Deep tactical breakdown', fx: { stats: { VIS: 2, COM: 1 }, mor: 4 }, out: 'He breaks down 10 clips of your recent matches. You spot three subtle adjustments that change your game.' },
      b: { label: 'Crossbar challenge', sub: 'Fun bonding session', fx: { mor: 8, hype: 1 }, out: 'You hit the bar three times in a row. The legend laughs and buys you coffee after.' } },
    { id: 'legend-boot-gift', min: 16, max: 30, title: 'Gift from Greatness',
      desc: 'An unmarked package arrives at your locker: custom boots sent personally by a legendary icon with a note of encouragement.',
      a: { label: 'Lace them up', sub: 'Wear them in the derby', fx: { stats: { PAC: 1, DRI: 1 }, mor: 5, hype: 2 }, out: 'You glide across the pitch. The commentators mention the boots three times during the broadcast.' },
      b: { label: 'Frame the boots', sub: 'Keep as a trophy', fx: { mor: 7 }, out: 'The boots take pride of place in your living room. A constant reminder of where you\'re heading.' } },
    { id: 'legend-derby-pep-talk', min: 17, max: 36, title: 'The Locker Room Visit',
      desc: 'Before the derby, a legendary icon enters the dressing room, locks eyes with you, and delivers a fiery speech.',
      a: { label: 'Lead the team out', sub: 'Embrace the fire', fx: { stats: { LEA: 2, MEN: 1 }, mor: 6 }, out: 'You roar out of the tunnel. The squad follows your lead into battle. Pure derby energy.' },
      b: { label: 'Channel it calmly', sub: 'Ice in your veins', fx: { stats: { COM: 2 }, mor: 4 }, out: 'You nod silently, put your headphones on, and deliver a clinical 9/10 performance.' } },
    { id: 'legend-media-praise', min: 18, max: 32, title: 'Praise on TV',
      desc: 'A legendary icon is asked about you on a major football show: "That kid has world-class potential."',
      a: { label: 'Thank him publicly', sub: 'Repost the clip', fx: { hype: 3, mor: 5 }, out: 'Your response trends #1. The world now knows the legend believes in you.' },
      b: { label: 'Stay humble in media', sub: 'Let your boots talk', fx: { stats: { COM: 1, LEA: 1 }, mor: 3 }, out: 'You answer: "I have accomplished nothing yet." The pundits applaud your elite mindset.' } },

    { id: 'naturalization-switch', min: 19, max: 34, title: 'Naturalization Offer',
      desc: 'After 5+ seasons in your host country, the national team coach and federation officially offer you citizenship and a spot in their national team squad.',
      a: { label: 'Accept & Switch National Team', sub: 'Represent your adopted home', fx: { mor: 10, hype: 3 }, out: 'You officially receive citizenship and wear the new national team crest. A historic career milestone.' },
      b: { label: 'Remain Loyal to Birth Nation', sub: 'Hold out for your homeland', fx: { mor: 5, stats: { LEA: 2 } }, out: 'You decline the switch. The fans of your homeland applaud your unwavering loyalty.' } },

    // ================= FINAL BATCH =================
    { id: 'ball-boy-debut', min: 14, max: 16, title: 'Ball Boy Duty',
      desc: 'The first team needs ball boys for the cup game. Front row seats, technically.',
      a: { label: 'Front-row education', sub: 'Study the pros', fx: { stats: { MEN: 1 }, mor: 3 }, out: 'You watch the veteran\'s positioning for 90 straight minutes. Free masterclass, plus a muddy shirt.' },
      b: { label: '"I play, I don\'t fetch"', sub: 'Too proud', fx: { stats: { MEN: 1 } }, out: 'The coach hears about it and laughs. He likes the arrogance. He also assigns you ball boy duty next week.' } },
    { id: 'homework-trading', min: 14, max: 17, title: 'The Homework Market',
      desc: 'A classmate offers to do all your homework for a fiver a week. Training schedule just got lighter.',
      a: { label: 'Deal', sub: '60% genius / 40% busted', fx: { risk: { p: .6, good: { stats: { DRI: 1 } }, bad: { stats: { MEN: -1 }, mor: -3 } } }, out: '' },
      b: { label: 'Do it yourself', sub: 'Honest grind', fx: { stats: { MEN: 2 } }, out: 'Math at 10PM after training. Brutal. Character-building. Mom is proud. The classmate fails economics.' } },
    { id: 'youth-world-cup', min: 16, max: 19, title: 'U17 World Cup Call',
      desc: 'The youth national team wants you for the World Cup. Six weeks away from club football.',
      a: { label: 'Go shine', sub: 'The world watches', fx: { hype: 2, stats: { MEN: 1 }, form: .03, stam: -5 }, out: 'You score in the quarterfinals. Scouts from three continents add you to spreadsheets.' },
      b: { label: 'Stay with the club', sub: 'Club first', fx: { stats: { MEN: 1 }, stam: 4 }, out: 'The club notices the loyalty. Your replacement at the tournament scores two. You pretend not to check.' } },
    { id: 'first-interview', min: 16, max: 20, title: 'First TV Interview',
      desc: 'A journalist asks about your idol, live on TV. The producer is making "stretch it out" gestures.',
      a: { label: 'Humble answer', sub: 'The classic greats', fx: { stats: { MEN: 1 }, mor: 2 }, out: 'You name the legends respectfully. The clip is used in "how to interview" tutorials. Boring. Safe. Perfect.' },
      b: { label: 'Bold answer', sub: '"Myself in five years"', fx: { hype: 2, stats: { MEN: 1 } }, out: 'The clip goes viral. Half call you arrogant, half call you iconic. Your mom calls to ask who raised you.' } },
    { id: 'boots-for-kid', min: 17, max: 23, title: 'The Kid In The Store',
      desc: 'A kid in the sports store stares at your boots. His mom is apologizing for bothering you. He has your poster.',
      a: { label: 'Buy him the boots', sub: 'Pay it forward', fx: { mor: 6, hype: 1 }, out: 'The store manager films it. The clip melts the internet. The kid promises to score for you someday.' },
      b: { label: 'Wave and smile', sub: 'Nice moment, moving on', fx: { mor: 1 }, out: 'A wave, a smile, a photo. His mom posts it. Wholesome engagement numbers.' } },
    { id: 'free-kick-data', min: 18, max: 26, pos: 'field', title: 'The Spreadsheet Coach',
      desc: 'The new set-piece coach has a spreadsheet for every keeper in the league. Left shoulder, low, 61% success rate.',
      a: { label: 'Trust the data', sub: 'Analytics football', fx: { stats: { SHO: 2 } }, out: 'You score two free-kicks in a month, both to the statistically correct corner. The spreadsheet smirks.' },
      b: { label: 'Trust the vibe', sub: 'Feel over formulas', fx: { stats: { SHO: 1, MEN: 1 } }, out: 'You keep shooting where instinct says. It works often enough that the coach adds a "vibe" column.' } },
    { id: 'captain-scream', min: 20, max: 28, title: 'The Captain\'s Scream',
      desc: 'The captain screams at you for not passing. In front of everyone. Replays show you were half-right.',
      a: { label: 'Scream back', sub: '50/50 power move', fx: { risk: { p: .5, good: { stats: { MEN: 2 } }, bad: { mor: -4, form: -.02 } } }, out: '' },
      b: { label: 'Apologize, move on', sub: 'Dressing room peace', fx: { stats: { MEN: 1 }, mor: 2 }, out: 'He claps your shoulder after. Hierarchy respected. The team plays calmer. You note the half-right part privately.' } },
    { id: 'old-highlights', min: 24, max: 32, title: 'The Resurfaced Highlights',
      desc: 'Your teenage highlights resurfaced online. The touches are good. The haircut is a crime scene.',
      a: { label: 'Share it yourself', sub: 'Get ahead of it', fx: { mor: 4, hype: 1 }, out: '"Rate the trim 1-10" — fans vote 2.4. You pin it. Self-deprecation wins the timeline.' },
      b: { label: 'Ignore it', sub: 'New hair, new era', fx: { stats: { MEN: 1 } }, out: 'You say nothing. The internet moves on in 36 hours. The haircut haunts you privately forever.' } },
    { id: 'u15-session', min: 26, max: 36, title: 'The U15 Finishing Session',
      desc: 'The coach asks you to run the U15 finishing session. Thirty kids, zero attention spans.',
      a: { label: 'Run the session', sub: 'Coach mode', fx: { stats: { MEN: 2, PAS: 1 } }, out: 'One kid scores and does YOUR celebration. You almost cry. Teaching is weirdly addictive.' },
      b: { label: 'Rest instead', sub: 'Recovery day', fx: { stam: 3 }, out: 'You watch from the window with a protein shake. The kids are chaos. Good call. Mostly.' } },
    { id: 'charity-match-host', min: 30, max: 40, title: 'Host Your Own Charity Match',
      desc: 'The foundation proposes: your own charity match. Legends, celebrities, one musician who thinks he can play.',
      a: { label: 'Full event mode', sub: 'Make it a show', fx: { mor: 6, hype: 1, stats: { MEN: 1 } }, out: 'Sold out. The musician misses a penalty. The legend chips the keeper. Millions raised. Perfect chaos.' },
      b: { label: 'Quiet donation', sub: 'Skip the circus', fx: { stats: { MEN: 1 } }, out: 'You write the check quietly. The foundation names the new gym after you anyway.' } },
    { id: 'gk-trophy-lift', min: 24, max: 34, pos: 'gk', title: 'The First Lift',
      desc: 'Cup final won. The captain offers YOU the first lift of the trophy. The keeper. First.',
      a: { label: 'Lift it high', sub: 'Keeper supremacy', fx: { mor: 7, stats: { LEA: 2 } }, out: 'You lift it under the lights. The photo becomes the club\'s wallpaper. Keepers everywhere feel seen.' },
      b: { label: 'Together, always', sub: 'One team, one lift', fx: { stats: { LEA: 1 }, mor: 3 }, out: 'You pull the whole back four in. The photo is less iconic but the group chat frame is better.' } },
    { id: 'gk-first-coach', min: 18, max: 26, pos: 'gk', title: '"I Always Knew"',
      desc: 'Your first goalkeeping coach calls out of nowhere: "I always knew, kid." He sounds emotional.',
      a: { label: 'Invite him to a game', sub: 'Front row, on you', fx: { mor: 5, stats: { LEA: 1 } }, out: 'He cries when you\'re announced. Post-match hug goes viral in keeper communities. Beautiful.' },
      b: { label: 'Long text back', sub: 'Heartfelt reply', fx: { mor: 2 }, out: 'You send three paragraphs. He replies with a photo of 9-year-old you in oversized gloves. You keep it.' } },
    { id: 'lego-stadium', min: 16, max: 40, kicker: 'LIFE OFF THE PITCH', title: 'The 7,000-Piece Stadium',
      desc: 'You bought the giant Lego stadium set. The instruction book is 400 pages. It judges you from the box.',
      a: { label: 'Build it all tonight', sub: 'No sleep, only bricks', fx: { mor: 5, stam: -4 }, out: '4AM. Finished. Your thumb is destroyed. The stadium is magnificent. Training is a blur.' },
      b: { label: 'One bag per day', sub: 'Monk-like patience', fx: { stats: { MEN: 1 }, mor: 2 }, out: 'Two weeks of disciplined building. The teammates start visiting to check progress. It becomes a thing.' } },
    { id: 'debut-boots-auction', min: 26, max: 40, kicker: 'LIFE OFF THE PITCH', title: 'The Debut Boots',
      desc: 'An auction house values your debut boots at five figures. For charity. They want them next month.',
      a: { label: 'Auction them', sub: 'For the kids', fx: { mor: 4, hype: 1 }, out: 'They sell for triple the estimate. A museum displays them. Your mom cries. You pretend not to.' },
      b: { label: 'Keep them', sub: 'Some things are priceless', fx: { mor: 3, stats: { MEN: 1 } }, out: 'They stay in the glass case at home. Some memories aren\'t for sale. The charity gets a bigger check instead.' } },
    { id: 'rain-delay-prank', min: 18, max: 30, title: 'The Rain Delay Prank',
      desc: 'Two-hour rain delay. The veterans are planning an elaborate prank on the rookies. Your involvement is requested.',
      a: { label: 'Join the prank', sub: 'Tradition', fx: { mor: 5 }, out: 'The rookies believe the game is "played in swimming gear if it rains again". One packs goggles. Immortal.' },
      b: { label: 'Protect the rookies', sub: 'Break the cycle', fx: { stats: { MEN: 2 } }, out: 'You tip them off. The veterans call you soft. The rookies call you boss. Both are right.' } },

    // ================= POSITION-BASED =================
    { id: 'st-poacher', min: 16, max: 26, pos: ['ST'], title: 'The Poacher Debate',
      desc: 'The coach: "Be in the box more." The analyst: "Your xG per touch is already elite." Your instinct: just score.',
      a: { label: 'Become a pure poacher', sub: 'Live in the six-yard box', fx: { stats: { SHO: 2 } }, out: 'You stop touching grass outside the box. Goals follow immediately. The analyst frames your touch map.' },
      b: { label: 'All-round striker', sub: 'Complete forward arc', fx: { stats: { MEN: 1, DRI: 1 } }, out: 'You drop, you link, you create. The coach stops asking questions. You\'re unplayable in a different way.' } },
    { id: 'st-pen-claim', min: 18, max: 30, pos: ['ST'], title: 'Penalty Turf War',
      desc: 'The winger won\'t give up penalties. You\'re the striker. It\'s literally your job description.',
      a: { label: 'Showdown in training', sub: '50/50 shootout for the job', fx: { risk: { p: .5, good: { stats: { SHO: 2 } }, bad: { mor: -3 } } }, out: '' },
      b: { label: 'Share the duties', sub: 'Diplomatic striker', fx: { stats: { MEN: 1 } }, out: 'Alternating takers. You score yours, he scores his. The keepers suffer either way. Peace.' } },
    { id: 'w-cut-inside', min: 16, max: 26, pos: ['RW', 'LW'], title: 'The Touchline Complaint',
      desc: 'The fullback complains you never stay wide. Your heatmap says he\'s right. Your goal tally says who cares.',
      a: { label: 'Keep cutting inside', sub: 'Robben mode', fx: { stats: { SHO: 1, DRI: 1 } }, out: 'Left foot, top corner, every single week. They know it\'s coming. It still comes.' },
      b: { label: 'Hug the touchline', sub: 'Old-school winger', fx: { stats: { PAC: 1, PAS: 1 } }, out: 'You become a crossing machine. The striker starts every interview by thanking you.' } },
    { id: 'w-track-back', min: 16, max: 24, pos: ['RW', 'LW', 'RM', 'LM'], title: 'The Dirty Work Demand',
      desc: 'The coach demands more defensive contribution. "Modern wingers run 12k a game."',
      a: { label: 'Embrace the dirty work', sub: 'Two-way monster', fx: { stats: { MEN: 2, PHY: 1 } }, out: 'You make a goal-line clearance in the 89th. The coach cries. The ultras have a new favorite.' },
      b: { label: '"I\'m a winger, not a wing-back"', sub: 'Attacking purity', fx: { stats: { DRI: 1 }, mor: -2 }, out: 'The coach benches you for two weeks "to think". You come back angrier and better.' } },
    { id: 'cam-burden', min: 18, max: 28, pos: ['CAM'], title: 'Triple-Teamed',
      desc: 'Every attack goes through you. Defenses have noticed — you now get triple-teamed weekly.',
      a: { label: 'Thrive in the chaos', sub: 'Find the impossible pass', fx: { stats: { PAS: 2, MEN: 1 } }, out: 'You start threading passes through gaps that don\'t exist. Triple team? You needed the space they left.' },
      b: { label: 'Demand runners', sub: 'Share the burden', fx: { stats: { MEN: 2 } }, out: 'You tell the coach exactly what you need. Two runners later, you\'re picking passes in acres of space.' } },
    { id: 'cm-metronome', min: 18, max: 28, pos: ['CM'], title: 'The Spiderwebs',
      desc: 'The analyst shows you your pass maps. They look like spiderwebs. 94% completion.',
      a: { label: 'Become the tempo king', sub: 'Pirlo mode', fx: { stats: { PAS: 2 } }, out: 'Games start moving at your speed. Commentators run out of ways to say "dictates play".' },
      b: { label: 'Add Hollywood passes', sub: '60% flair / 40% hospital ball', fx: { risk: { p: .6, good: { stats: { PAS: 2 }, hype: 1 }, bad: { mor: -2 } } }, out: '' } },
    { id: 'cdm-destroyer', min: 16, max: 28, pos: ['CM'], title: 'The Tackle Chant',
      desc: 'The fans have a chant dedicated entirely to your tackles. It involves a lot of stamping.',
      a: { label: 'Lean into the destroyer role', sub: 'The wall', fx: { stats: { PHY: 2, MEN: 1 } }, out: 'Strikers check the teamsheet for your name before sleeping. The chant gets a second verse.' },
      b: { label: 'Silk over steel', sub: 'Deep-lying playmaker arc', fx: { stats: { PAS: 2 } }, out: 'You start every attack from deep. The destroyer becomes a quarterback. The chant adapts.' } },
    { id: 'cb-build-up', min: 16, max: 26, pos: ['CB'], title: 'Step Into Midfield',
      desc: 'The coach wants you stepping into midfield with the ball. Your center-back partner looks terrified.',
      a: { label: 'Ball-playing mode', sub: 'Beckenbauer arc', fx: { stats: { PAS: 2, DRI: 1 } }, out: 'You split a press with one pass. The coach kisses the tactics board. The partner adapts.' },
      b: { label: 'No-nonsense defending', sub: 'Row Z has no complaints', fx: { stats: { PHY: 2, MEN: 1 } }, out: 'You defend like it\'s personal. Forwards finish games with bruises and no shots. Both valid.' } },
    { id: 'cb-aerial', min: 18, max: 32, pos: ['CB'], title: 'The New Target',
      desc: 'Set pieces: you\'re now the primary target. 190cm of you, crashing the six-yard box.',
      a: { label: 'Attack every ball', sub: 'Ramos mode', fx: { stats: { SHO: 2, PHY: 1 } }, out: 'Three headed goals in two months. Corners become penalties for you. Keepers hate you.' },
      b: { label: 'Hold the line instead', sub: 'Defense first', fx: { stats: { MEN: 2 } }, out: 'You organize instead of attacking. Zero goals conceded from set pieces. Different kind of valuable.' } },
    { id: 'fb-overlap', min: 16, max: 26, pos: ['RB', 'LB'], title: 'The Overlap Engine',
      desc: 'The winger wants you overlapping on every attack. Your lungs have entered negotiations.',
      a: { label: 'Engine mode', sub: 'Run forever', fx: { stats: { PAC: 2, PHY: 1 } }, out: 'You make 40 overlaps a game. Assists follow. The winger owes you dinner for life.' },
      b: { label: 'Stay disciplined', sub: 'Inverted fullback arc', fx: { stats: { MEN: 2, PAS: 1 } }, out: 'You tuck inside and control the middle. The coach builds a whole system around it. Trendsetter.' } },
    { id: 'fb-conversion', min: 16, max: 22, pos: ['RB', 'LB'], title: '"Ever Tried Winger?"',
      desc: 'The academy coach asks the question. Your crossing stats say maybe. Your heart says fullback.',
      a: { label: 'Try it for a month', sub: 'Chaos experiment', fx: { stats: { DRI: 2 } }, out: 'You terrorize fullbacks with insider knowledge. The experiment becomes permanent. It works.' },
      b: { label: 'Fullback for life', sub: 'Loyalty to the craft', fx: { stats: { MEN: 2, PAC: 1 } }, out: 'You become the fullback other fullbacks study. The coach respects the conviction.' } },
    { id: 'st-big-game-bottler', min: 20, max: 32, pos: ['ST', 'RW', 'LW'], title: 'The Bottler Narrative',
      desc: 'A pundit calls you a "big-game bottler" on live TV. The derby is Saturday. The clip is everywhere.',
      a: { label: 'Screenshot it', sub: 'Fuel', fx: { stats: { MEN: 2 }, form: .04 }, out: 'You score twice in the derby and shush the camera. The pundit "deletes his account for unrelated reasons".' },
      b: { label: 'Respond in the presser', sub: '"Watch Saturday"', fx: { hype: 1, risk: { p: .6, good: { stats: { MEN: 2 }, form: .03 }, bad: { mor: -4, form: -.03 } } }, out: '' } },
    { id: 'cm-captain-clash', min: 20, max: 30, pos: ['CM', 'CAM'], title: 'Tactical Shouting Match',
      desc: 'You and the manager have opposing views on your role. He wants safety. You want freedom.',
      a: { label: 'Demand the free role', sub: 'Back yourself', fx: { risk: { p: .55, good: { stats: { PAS: 2 }, form: .03 }, bad: { form: -.02, mor: -3 } } }, out: '' },
      b: { label: 'Play his way', sub: 'System player', fx: { stats: { MEN: 2 }, form: .02 }, out: 'You become the system\'s heartbeat. The manager calls you "a coach on the pitch". Trust: earned.' } },
    { id: 'def-yellow-record', min: 18, max: 32, pos: ['CB', 'RB', 'LB', 'CM'], title: 'The Yellow Card Streak',
      desc: 'You\'re one yellow from a suspension record. The ref today loves his pocket. The striker you\'re marking loves diving.',
      a: { label: 'Go in hard anyway', sub: 'No fear football', fx: { risk: { p: .55, good: { stats: { MEN: 2, PHY: 1 } }, bad: { stats: { MEN: -1 }, form: -.03 } } }, out: '' },
      b: { label: 'Defend on eggshells', sub: 'Brain over brawn', fx: { stats: { MEN: 2 } }, out: 'You play the smartest game of your life. The diver gets booked instead. Karma, live on TV.' } },
  ];

  /* ----------------------------------------------------------
     TRAINING BOOSTERS — pick 1 of 3 each season.
     bronze +1 / silver +2 (or 1+1) / gold +3 (or 2+1)
     diamond +5 single or +2/+2 bundle (extremely rare)
     ---------------------------------------------------------- */
  const BOOSTERS = [
    // Field - bronze
    { id: 'sprints', rarity: 'bronze', pos: 'field', title: 'Sunrise Sprints', desc: 'The pitch is wet, the sun isn\'t up, and your lungs hate you. It works.', fx: { PAC: 1 } },
    { id: 'wall-touch', rarity: 'bronze', pos: 'field', title: 'Wall & First Touch', desc: '500 touches against the wall. The wall wins 12.', fx: { DRI: 1 } },
    { id: 'shooting-hours', rarity: 'bronze', pos: 'field', title: 'Shooting After Hours', desc: 'The groundskeeper kicks you out at 9. You come back at 9:15.', fx: { SHO: 1 } },
    { id: 'leg-day', rarity: 'bronze', pos: 'field', title: 'Leg Day, Every Day', desc: 'Stairs become your natural predator.', fx: { PHY: 1 } },
    { id: 'film-room', rarity: 'bronze', pos: 'field', title: 'Film Room Grind', desc: 'You now dream in tactical cam angles.', fx: { PAS: 1 } },
    { id: 'journaling', rarity: 'bronze', pos: 'field', title: 'Stoic Journaling', desc: 'Dear diary: today I pressed like a beast.', fx: { MEN: 1 } },
    // Field - silver
    { id: 'plyo', rarity: 'silver', pos: 'field', title: 'Plyometrics Program', desc: 'Box jumps until the box fears you.', fx: { PAC: 1, PHY: 1 } },
    { id: 'futsal-fridays', rarity: 'silver', pos: 'field', title: 'Futsal Fridays', desc: 'Tight courts, tighter control. No hiding.', fx: { DRI: 1, PAS: 1 } },
    { id: 'finishing-clinic', rarity: 'silver', pos: 'field', title: 'Finishing Clinic', desc: 'A club legend runs it. He scored 300 goals. He has OPINIONS.', fx: { SHO: 2 } },
    { id: 'vision-training', rarity: 'silver', pos: 'field', title: 'Vision Training', desc: 'Peripheral awareness drills. You can now see the past.', fx: { PAS: 2 } },
    { id: 'ice-bath', rarity: 'silver', pos: 'field', title: 'Ice Bath Protocol', desc: '3 minutes at 4°C. Character development.', fx: { PHY: 1, MEN: 1 } },
    { id: 'big-game-breath', rarity: 'silver', pos: 'field', title: 'Big-Game Breathing', desc: 'In through the nose, out through the doubters.', fx: { MEN: 2 } },
    // Field - gold
    { id: 'brazil-bootcamp', rarity: 'gold', pos: 'field', title: 'Brazilian Futsal Bootcamp', desc: 'Two weeks in São Paulo. Your ankles return upgraded.', fx: { DRI: 2, PAS: 1 } },
    { id: 'special-forces', rarity: 'gold', pos: 'field', title: 'Special Forces Preseason', desc: 'They made you carry a log. The log is your friend now.', fx: { PHY: 2, MEN: 1 } },
    { id: 'tactics-lab', rarity: 'gold', pos: 'field', title: 'The Tactics Lab', desc: 'A master tactician draws passing lanes in his sleep. Now you do too.', fx: { PAS: 2, MEN: 1 } },
    { id: 'strikers-dojo', rarity: 'gold', pos: 'field', title: 'Striker\'s Dojo', desc: '1,000 finishes. Both feet. No excuses. The net files for divorce.', fx: { SHO: 3 } },
    { id: 'sprint-lab', rarity: 'gold', pos: 'field', title: 'Olympic Sprint Lab', desc: 'New gait, new you. 0.3s faster over 30 metres.', fx: { PAC: 3 } },
    // Field - diamond
    { id: 'galactico-retreat', rarity: 'diamond', pos: 'field', title: 'Galáctico Finishing Retreat', desc: 'One month with the best finisher alive. He only teaches killers.', fx: { SHO: 5 } },
    { id: 'total-football', rarity: 'diamond', pos: 'field', title: 'Total Football Immersion', desc: 'A summer in Amsterdam rewiring how you see space itself.', fx: { PAS: 2, DRI: 2 } },
    { id: 'sprinter-rebuild', rarity: 'diamond', pos: 'field', title: 'Sprinter\'s Rebuild', desc: 'An Olympic relay team takes you apart and puts you back faster.', fx: { PAC: 5 } },
    // GK - bronze
    { id: 'tennis-wall', rarity: 'bronze', pos: 'gk', title: 'Tennis Ball Wall', desc: '500 tennis balls fired at close range. You see in slow motion now.', fx: { REF: 1 } },
    { id: 'box-command', rarity: 'bronze', pos: 'gk', title: 'Box Command 101', desc: 'Shouting at defenders until it becomes music.', fx: { LEA: 1 } },
    { id: 'dist-ladders', rarity: 'bronze', pos: 'gk', title: 'Distribution Ladders', desc: 'Hit the target bin from 40 yards. The bin is smug.', fx: { PAS: 1 } },
    { id: 'drone-dives', rarity: 'bronze', pos: 'gk', title: 'Drone Dives', desc: 'A drone fires balls at you. The future is weird.', fx: { REF: 1 } },
    { id: 'breath-work', rarity: 'bronze', pos: 'gk', title: 'Breathing Techniques', desc: 'Box breathing for box defending.', fx: { COM: 1 } },
    // GK - silver
    { id: 'pen-whisperer', rarity: 'silver', pos: 'gk', title: 'Penalty Whisperer', desc: 'You now read run-ups like bedtime stories.', fx: { COM: 1, VIS: 1 } },
    { id: 'high-balls', rarity: 'silver', pos: 'gk', title: 'High Balls Under Fire', desc: 'Crosses with a crowd. Own the sky.', fx: { LEA: 1, COM: 1 } },
    { id: 'one-on-one', rarity: 'silver', pos: 'gk', title: 'One-on-One School', desc: 'Narrows angles like a nightclub bouncer.', fx: { REF: 2 } },
    { id: 'gk-scanning', rarity: 'silver', pos: 'gk', title: 'Scanning Drills', desc: 'Check shoulders. Both. Always. The pitch is a chessboard.', fx: { VIS: 2 } },
    // GK - gold
    { id: 'legend-camp', rarity: 'gold', pos: 'gk', title: 'Legend\'s Goalkeeper Camp', desc: 'A World Cup-winning legend mentors you for a month. You leave speaking in calm.', fx: { REF: 2, COM: 1 } },
    { id: 'sweeper-master', rarity: 'gold', pos: 'gk', title: 'Sweeper-Keeper Masterclass', desc: 'You are now the 11th outfield player. With gloves.', fx: { PAS: 2, VIS: 1 } },
    { id: 'captain-keeper', rarity: 'gold', pos: 'gk', title: 'The General\'s Course', desc: 'Leadership school for keepers. Your roar reorganizes midfields.', fx: { LEA: 3 } },
    // GK - diamond
    { id: 'yashin-legacy', rarity: 'diamond', pos: 'gk', title: 'The Yashin Legacy Camp', desc: 'Train in the Black Spider\'s methods. Fear becomes a stranger.', fx: { REF: 5 } },
    { id: 'sweeper-phd', rarity: 'diamond', pos: 'gk', title: 'Sweeper-Keeper PhD', desc: 'A doctorate in controlled chaos, taught by the position\'s inventor.', fx: { PAS: 2, VIS: 2 } },
    // Universal (mapped per player type)
    { id: 'yoga', rarity: 'bronze', pos: 'any', title: 'Yoga With The Keeper Coach', desc: 'Downward dog meets clean sheet. Spiritual stretching.', fx: { MEN: 1 }, fxGk: { COM: 1 } },
    { id: 'nutrition', rarity: 'bronze', pos: 'any', title: 'The Nutrition Overhaul', desc: 'Kale. Quinoa. Sadness. Results.', fx: { PHY: 1 }, fxGk: { REF: 1 } },
    { id: 'sleep-coach', rarity: 'silver', pos: 'any', title: 'Sleep Coach Program', desc: 'Your bedroom becomes a recovery laboratory. 9.5 hours nightly.', fx: { PAC: 1, MEN: 1 }, fxGk: { REF: 1, COM: 1 } },
    { id: 'altitude', rarity: 'silver', pos: 'any', title: 'Altitude Training Camp', desc: 'Three weeks breathing soup at 2,500m. Sea level feels illegal after.', fx: { PHY: 2 }, fxGk: { REF: 2 } },
    { id: 'vr-chamber', rarity: 'gold', pos: 'any', title: 'VR Decision Chamber', desc: '1,000 match scenarios in virtual reality. Your brain overclocks.', fx: { MEN: 2, PAS: 1 }, fxGk: { VIS: 2, COM: 1 } },
    { id: 'sports-science', rarity: 'diamond', pos: 'any', title: 'Sports Science Overhaul', desc: 'A full biomechanical rebuild. Every metric on your body: optimized.', fx: { MEN: 2, PHY: 2 }, fxGk: { COM: 2, REF: 2 } },
  ];

  // Weights out of 94 (bronze 80, silver 10, gold 3, diamond 1)
  const RARITY_ROLL = [
    { rarity: 'bronze', p: 80 },
    { rarity: 'silver', p: 10 },
    { rarity: 'gold', p: 3 },
    { rarity: 'diamond', p: 1 },
  ];

  /* ----------------------------------------------------------
     CONSUMABLES — club shop. One purchase per season.
     price in EUR; fx applied immediately. 'special' handled by engine.
     ---------------------------------------------------------- */
  const CONSUMABLES = [
    // Entry / Early Career ($50K - $250K)
    { id: 'hydration', name: 'Custom Hydration Protocol', price: 50000, desc: 'Electrolytes mixed by a team nutritionist. Zero mid-game fatigue.', fx: { stam: 15, mor: 5 } },
    { id: 'boots-pro', name: 'Custom Leather Boots', price: 80000, desc: 'Hand-stitched kangaroo leather. Classic touch, instant comfort.', fx: { stats: { PAS: 1 } }, fxGk: { stats: { COM: 1 } } },
    { id: 'ice-baths', name: 'Portable Cryo Ice Bath', price: 120000, desc: 'Sub-zero therapy after every training session. Muscles recover twice as fast.', fx: { stam: 20 } },
    { id: 'chef', name: 'Private Chef', price: 150000, desc: 'Macros on point, every plate. Your body notices by week two.', fx: { stats: { PHY: 1 }, stam: 5 }, fxGk: { stats: { REF: 1 }, stam: 5 } },
    { id: 'massage-therapist', name: 'Dedicated Physio Therapist', price: 200000, desc: 'Deep tissue work twice a week. Tight hamstrings are a thing of the past.', fx: { stam: 15, mor: 5 } },
    { id: 'physio-shield', name: 'Physio Insurance Package', price: 250000, desc: 'World-class physical conditioning and injury resilience.', fx: { stats: { PHY: 2 }, stam: 10 } },

    // Mid Career ($300K - $800K)
    { id: 'mental-coach', name: 'Elite Mental Coach', price: 300000, desc: 'She coached three Ballon d\'Or winners. You are her easiest project.', fx: { stats: { MEN: 2 } }, fxGk: { stats: { COM: 2 } } },
    { id: 'analyst', name: 'Personal Video Analyst', price: 350000, desc: 'Every touch clipped, tagged and reviewed. Your weak spots get evicted.', fx: { stats: { PAS: 1, MEN: 1 } }, fxGk: { stats: { VIS: 2 } } },
    { id: 'hyperbaric', name: 'Hyperbaric Chamber Suite', price: 400000, desc: 'Pure oxygen, pure recovery. You bounce out of bed like a glitch.', fx: { stats: { PAC: 1 }, stam: 15 }, fxGk: { stats: { REF: 1 }, stam: 15 } },
    { id: 'retreat', name: 'Mindfulness Retreat', price: 450000, desc: 'One week. No phone. Just breath, silence and a suspiciously wise monk.', fx: { mor: 20, stam: 5 } },
    { id: 'trainer', name: 'Personal Fitness Trainer', price: 500000, desc: 'Ex-footballer, current sadist. Your core becomes a fortress.', fx: { stats: { PHY: 2 } }, fxGk: { stats: { REF: 2 } } },
    { id: 'sleep-pod', name: 'Circadian Sleep Pod System', price: 550000, desc: 'NASA-grade sleep tracking & light therapy. Deep REM every single night.', fx: { stam: 18, mor: 10 } },
    { id: 'pr-team', name: 'PR & Brand Agency', price: 600000, desc: 'Billboards, features, a documentary teaser. Your name starts trending.', fx: { hype: 3 } },
    { id: 'pilates-expert', name: 'Biomechanics & Flexibility Specialist', price: 700000, desc: 'Sprint mechanics re-engineered. You gain an extra yard of acceleration.', fx: { stats: { PAC: 2 } }, fxGk: { stats: { REF: 2 } } },
    { id: 'super-boots', name: 'Custom Lab 3D Boots', price: 800000, desc: '3D-scanned, wind-tunnel tested, 40 grams lighter. Weapons-grade footwear.', fx: { stats: { SHO: 2 } }, fxGk: { stats: { LEA: 2 } } },

    // High Level ($1.0M - $3.5M)
    { id: 'jet-concierge', name: 'Private Jet Travel Pass', price: 1000000, desc: 'Bypass commercial airports during international breaks. Zero jetlag.', fx: { stam: 15, hype: 2 } },
    { id: 'agent-push', name: 'Super-Agent Package', price: 1200000, desc: 'Your agent becomes a super-agent for a season. Better offers, +35% contract wage.', fx: { special: 'superAgent', hype: 2 } },
    { id: 'speed-lab', name: 'Sprint & Agility Lab', price: 1500000, desc: 'High-speed camera tracking & stride mechanics. Pure explosiveness.', fx: { stats: { PAC: 2, DRI: 1 } }, fxGk: { stats: { REF: 2, VIS: 1 } } },
    { id: 'strike-coach', name: 'Legendary Striker Coaching Session', price: 2000000, desc: 'Three weeks with a retired legend. Finishing becomes second nature.', fx: { stats: { SHO: 3 } }, fxGk: { stats: { COM: 3 } } },
    { id: 'midfield-maestro', name: 'Playmaker Masterclass', price: 2200000, desc: 'Vision and passing angles unlocked by one of the game\'s mid-court gods.', fx: { stats: { PAS: 3 } }, fxGk: { stats: { VIS: 3 } } },
    { id: 'mentor-session', name: 'Ballon d\'Or Winner Mentorship', price: 2500000, desc: 'One-on-one sessions with a footballing icon. Tactical mind elevated.', fx: { stats: { MEN: 3, PAS: 1 } }, fxGk: { stats: { LEA: 3, COM: 1 } } },
    { id: 'fashion-brand-drop', name: 'Global Apparel & Sneaker Drop', price: 3000000, desc: 'Your signature sneaker sells out worldwide in 12 minutes.', fx: { hype: 4, mor: 10 } },
    { id: 'sports-villa', name: 'Private Mountain Recovery Villa', price: 3500000, desc: 'Altitude training, private turf, full medical staff in the Swiss Alps.', fx: { stats: { PHY: 2 }, stam: 18, mor: 15 } },

    // Elite / Wealth Tier ($5.0M - $15.0M)
    { id: 'biomed-institute', name: 'Private Sports Science Lab', price: 5000000, desc: 'Genome-tailored nutrition and recovery. Peak athletic perfection.', fx: { stats: { PAC: 1, PHY: 2, MEN: 1 }, stam: 20 }, fxGk: { stats: { REF: 2, COM: 2 }, stam: 20 } },
    { id: 'supercar-garage', name: 'Hypercar Collection Reveal', price: 6500000, desc: 'A neon hypercar and a YouTube studio. You are the main character.', fx: { hype: 5, mor: 20 } },
    { id: 'luxury-yacht', name: 'Mediterranean Megayacht Break', price: 8000000, desc: 'Two weeks in Ibiza & Monaco with your inner circle. Morale at absolute 100.', fx: { mor: 40, stam: 15, hype: 3 } },
    { id: 'esports-empire', name: 'Esports & Media Empire Ownership', price: 10000000, desc: 'You buy 30% of a global gaming franchise. Millions of new fans overnight.', fx: { hype: 6, mor: 15 } },
    { id: 'academy-foundation', name: 'Grassroots Youth Academy Foundation', price: 12000000, desc: 'You build a state-of-the-art academy in your hometown. Pure legacy.', fx: { stats: { MEN: 3, LEA: 2 }, hype: 4 }, fxGk: { stats: { LEA: 4, COM: 2 }, hype: 4 } },
    { id: 'super-agent-vip', name: 'Super-Agent VIP Lifetime Retainer', price: 15000000, desc: 'The biggest agent in world football takes you as their flagship client.', fx: { special: 'superAgent', hype: 5, mor: 25 } },
  ];

  const SIM_LINES = [
    'Warming up...', 'Arguing with VAR...', 'Scoring absolute bangers...',
    'Dodging tackles & taxes...', 'Signing autographs...', 'Hitting the woodwork (on purpose)...',
    'Doing the knee-slide math...', 'Surviving international duty...', 'Refreshing the transfer rumours...',
    '"Here we go!"...', 'Taking corner kicks...', 'Kissing the badge...', 'Tracking back (eventually)...',
  ];

  // Season headline generators by performance tier
  const HEADLINES = {
    bad: ['A SEASON TO FORGET', 'TOUGH CAMPAIGN FOR THE YOUNGSTER', 'LEARNING YEAR, SAY THE OPTIMISTS'],
    quiet: ['QUIET BUT SOLID SEASON', 'SLOW BURN: THE PROJECT CONTINUES', 'GLIMPSES OF SOMETHING SPECIAL'],
    good: ['BREAKTHROUGH SEASON!', 'THE LEAGUE IS ON NOTICE', 'A STAR IS RISING'],
    great: ['SEASON OF HIS LIFE', 'GOLDEN BOOT TERRITORY', 'EUROPE\'S GIANTS ARE CIRCLING'],
    legend: ['BALLON D\'OR FORM', 'A SEASON FOR THE HISTORY BOOKS', 'ABSOLUTELY UNPLAYABLE'],
  };

  const RETIREMENT_QUOTES = [
    'The boots are hung. The legend remains.',
    'Every end is a stat line. Yours is poetry.',
    'From wonderkid to immortal. Career: complete.',
    'The stadium lights dim. The highlight reels never will.',
    'They\'ll tell stories about this one.',
  ];

  const CLUB_LEGENDS = {
  "River Plate": [
    {
      "name": "Ubaldo Fillol",
      "pos": "gk",
      "title": "El Pato",
      "title_es": "El Pato"
    },
    {
      "name": "Daniel Passarella",
      "pos": "def",
      "title": "El Gran Capitán",
      "title_es": "El Gran Capitán"
    },
    {
      "name": "Enzo Francescoli",
      "pos": "mid",
      "title": "The Prince",
      "title_es": "El Príncipe"
    },
    {
      "name": "Ángel Labruna",
      "pos": "st",
      "title": "El Feo",
      "title_es": "El Feo"
    }
  ],
  "Boca Juniors": [
    {
      "name": "Roberto Abbondanzieri",
      "pos": "gk",
      "title": "El Pato",
      "title_es": "El Pato"
    },
    {
      "name": "Rolando Schiavi",
      "pos": "def",
      "title": "El Flaco",
      "title_es": "El Flaco"
    },
    {
      "name": "Juan Román Riquelme",
      "pos": "mid",
      "title": "The Last Number Ten",
      "title_es": "El Último Diez"
    },
    {
      "name": "Martín Palermo",
      "pos": "st",
      "title": "The Titan",
      "title_es": "El Titán"
    }
  ],
  "Racing Club": [
    {
      "name": "Sebastián Saja",
      "pos": "gk",
      "title": "El Chino",
      "title_es": "El Chino"
    },
    {
      "name": "Roberto Perfumo",
      "pos": "def",
      "title": "El Mariscal",
      "title_es": "El Mariscal"
    },
    {
      "name": "Rubén Paz",
      "pos": "mid",
      "title": "The Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "Diego Milito",
      "pos": "st",
      "title": "The Prince",
      "title_es": "El Príncipe"
    }
  ],
  "Independiente": [
    {
      "name": "Faryd Mondragón",
      "pos": "gk",
      "title": "El Turco",
      "title_es": "El Turco"
    },
    {
      "name": "Gabriel Milito",
      "pos": "def",
      "title": "The Marshal",
      "title_es": "El Mariscal"
    },
    {
      "name": "Ricardo Bochini",
      "pos": "mid",
      "title": "El Bocha",
      "title_es": "El Bocha"
    },
    {
      "name": "Arsenio Erico",
      "pos": "st",
      "title": "The Jumper",
      "title_es": "El Saltarín"
    }
  ],
  "San Lorenzo": [
    {
      "name": "Sebastián Torrico",
      "pos": "gk",
      "title": "Saint Torrico",
      "title_es": "San Torrico"
    },
    {
      "name": "Fabricio Coloccini",
      "pos": "def",
      "title": "Colo",
      "title_es": "Colo"
    },
    {
      "name": "Leandro Romagnoli",
      "pos": "mid",
      "title": "Pipi",
      "title_es": "Pipi"
    },
    {
      "name": "José Sanfilippo",
      "pos": "st",
      "title": "El Nene",
      "title_es": "El Nene"
    }
  ],
  "Estudiantes": [
    {
      "name": "Mariano Andújar",
      "pos": "gk",
      "title": "The Wall",
      "title_es": "El Muro"
    },
    {
      "name": "José Luis Brown",
      "pos": "def",
      "title": "Tata",
      "title_es": "Tata"
    },
    {
      "name": "Juan Sebastián Verón",
      "pos": "mid",
      "title": "La Brujita",
      "title_es": "La Brujita"
    },
    {
      "name": "Mauro Boselli",
      "pos": "st",
      "title": "Mauro",
      "title_es": "Mauro"
    }
  ],
  "Vélez Sarsfield": [
    {
      "name": "José Luis Chilavert",
      "pos": "gk",
      "title": "Chila",
      "title_es": "Chila"
    },
    {
      "name": "Fabián Cubero",
      "pos": "def",
      "title": "Poroto",
      "title_es": "Poroto"
    },
    {
      "name": "Christian Bassedas",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Carlos Bianchi",
      "pos": "st",
      "title": "The Viceroy",
      "title_es": "El Virrey"
    }
  ],
  "Talleres": [
    {
      "name": "Guido Herrera",
      "pos": "gk",
      "title": "Guido",
      "title_es": "Guido"
    },
    {
      "name": "Luis Galván",
      "pos": "def",
      "title": "El Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "Pablo Guiñazú",
      "pos": "mid",
      "title": "Cholo",
      "title_es": "Cholo"
    },
    {
      "name": "Gonzalo Klusener",
      "pos": "st",
      "title": "Kluse",
      "title_es": "Kluse"
    }
  ],
  "Lanús": [
    {
      "name": "Agustín Marchesín",
      "pos": "gk",
      "title": "Marche",
      "title_es": "Marche"
    },
    {
      "name": "Maximiliano Velázquez",
      "pos": "def",
      "title": "Maxi",
      "title_es": "Maxi"
    },
    {
      "name": "Diego Valeri",
      "pos": "mid",
      "title": "El Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "José Sand",
      "pos": "st",
      "title": "Pepe",
      "title_es": "Pepe"
    }
  ],
  "Newell's": [
    {
      "name": "Nahuel Guzmán",
      "pos": "gk",
      "title": "Patón",
      "title_es": "Patón"
    },
    {
      "name": "Walter Samuel",
      "pos": "def",
      "title": "The Wall",
      "title_es": "El Muro"
    },
    {
      "name": "Maxi Rodríguez",
      "pos": "mid",
      "title": "La Fiera",
      "title_es": "La Fiera"
    },
    {
      "name": "Ignacio Scocco",
      "pos": "st",
      "title": "Nacho",
      "title_es": "Nacho"
    }
  ],
  "Rosario Central": [
    {
      "name": "Jeremías Ledesma",
      "pos": "gk",
      "title": "Conan",
      "title_es": "Conan"
    },
    {
      "name": "Edgardo Bauza",
      "pos": "def",
      "title": "El Patón",
      "title_es": "El Patón"
    },
    {
      "name": "Omar Palma",
      "pos": "mid",
      "title": "El Negro",
      "title_es": "El Negro"
    },
    {
      "name": "Marco Ruben",
      "pos": "st",
      "title": "Marco",
      "title_es": "Marco"
    }
  ],
  "Defensa y Justicia": [
    {
      "name": "Ezequiel Unsain",
      "pos": "gk",
      "title": "Eze",
      "title_es": "Eze"
    },
    {
      "name": "Alexander Barboza",
      "pos": "def",
      "title": "Barboza",
      "title_es": "Barboza"
    },
    {
      "name": "Lisandro Martínez",
      "pos": "mid",
      "title": "The Butcher",
      "title_es": "El Carnicero"
    },
    {
      "name": "Braian Romero",
      "pos": "st",
      "title": "Braian",
      "title_es": "Braian"
    }
  ],
  "Huracán": [
    {
      "name": "Marcos Díaz",
      "pos": "gk",
      "title": "Marcos",
      "title_es": "Marcos"
    },
    {
      "name": "Paolo Goltz",
      "pos": "def",
      "title": "Paolo",
      "title_es": "Paolo"
    },
    {
      "name": "Miguel Brindisi",
      "pos": "mid",
      "title": "Miguelito",
      "title_es": "Miguelito"
    },
    {
      "name": "Herminio Masantonio",
      "pos": "st",
      "title": "Masantonio",
      "title_es": "Masantonio"
    }
  ],
  "Argentinos Juniors": [
    {
      "name": "Adrián Domenech",
      "pos": "gk",
      "title": "Domi",
      "title_es": "Domi"
    },
    {
      "name": "Sergio Batista",
      "pos": "def",
      "title": "Checho",
      "title_es": "Checho"
    },
    {
      "name": "Diego Maradona",
      "pos": "mid",
      "title": "El Pelusa",
      "title_es": "El Pelusa"
    },
    {
      "name": "Claudio Borghi",
      "pos": "st",
      "title": "Bichi",
      "title_es": "Bichi"
    }
  ],
  "Godoy Cruz": [
    {
      "name": "Sebastián Torrico",
      "pos": "gk",
      "title": "San Torrico",
      "title_es": "San Torrico"
    },
    {
      "name": "Leonardo Sigali",
      "pos": "def",
      "title": "Oso",
      "title_es": "Oso"
    },
    {
      "name": "David Ramírez",
      "pos": "mid",
      "title": "El Mago",
      "title_es": "El Mago"
    },
    {
      "name": "Santiago García",
      "pos": "st",
      "title": "El Morro",
      "title_es": "El Morro"
    }
  ],
  "Belgrano": [
    {
      "name": "Juan Carlos Olave",
      "pos": "gk",
      "title": "Juanca",
      "title_es": "Juanca"
    },
    {
      "name": "Claudio Pérez",
      "pos": "def",
      "title": "Chiqui",
      "title_es": "Chiqui"
    },
    {
      "name": "Franco Vázquez",
      "pos": "mid",
      "title": "El Mudo",
      "title_es": "El Mudo"
    },
    {
      "name": "Luis Artime",
      "pos": "st",
      "title": "El Luifa",
      "title_es": "El Luifa"
    }
  ],
  "Paris Saint-Germain": [
    {
      "name": "Bernard Lama",
      "pos": "gk",
      "title": "The Cat",
      "title_es": "El Gato"
    },
    {
      "name": "Thiago Silva",
      "pos": "def",
      "title": "O Monstro",
      "title_es": "El Monstruo"
    },
    {
      "name": "Raí",
      "pos": "mid",
      "title": "Raí",
      "title_es": "Raí"
    },
    {
      "name": "Zlatan Ibrahimović",
      "pos": "st",
      "title": "Ibra",
      "title_es": "Ibra"
    }
  ],
  "Marseille": [
    {
      "name": "Steve Mandanda",
      "pos": "gk",
      "title": "Il Fenomeno",
      "title_es": "El Fenómeno"
    },
    {
      "name": "Basile Boli",
      "pos": "def",
      "title": "Basile",
      "title_es": "Basile"
    },
    {
      "name": "Abedi Pelé",
      "pos": "mid",
      "title": "The Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "Jean-Pierre Papin",
      "pos": "st",
      "title": "JPP",
      "title_es": "JPP"
    }
  ],
  "Monaco": [
    {
      "name": "Jean-Luc Ettori",
      "pos": "gk",
      "title": "Ettori",
      "title_es": "Ettori"
    },
    {
      "name": "Manuel Amoros",
      "pos": "def",
      "title": "Manu",
      "title_es": "Manu"
    },
    {
      "name": "Ludovic Giuly",
      "pos": "mid",
      "title": "Ludo",
      "title_es": "Ludo"
    },
    {
      "name": "Thierry Henry",
      "pos": "st",
      "title": "Titi",
      "title_es": "Titi"
    }
  ],
  "Lyon": [
    {
      "name": "Grégory Coupet",
      "pos": "gk",
      "title": "Greg",
      "title_es": "Greg"
    },
    {
      "name": "Cris",
      "pos": "def",
      "title": "The Policeman",
      "title_es": "El Policía"
    },
    {
      "name": "Juninho Pernambucano",
      "pos": "mid",
      "title": "The Free-Kick King",
      "title_es": "El Rey del Tiro Libre"
    },
    {
      "name": "Alexandre Lacazette",
      "pos": "st",
      "title": "The General",
      "title_es": "El General"
    }
  ],
  "Lille": [
    {
      "name": "Vincent Enyeama",
      "pos": "gk",
      "title": "The Cat",
      "title_es": "El Gato"
    },
    {
      "name": "Mathieu Debuchy",
      "pos": "def",
      "title": "Debuchy",
      "title_es": "Debuchy"
    },
    {
      "name": "Eden Hazard",
      "pos": "mid",
      "title": "Eden",
      "title_es": "Eden"
    },
    {
      "name": "Moussa Sow",
      "pos": "st",
      "title": "Moussa",
      "title_es": "Moussa"
    }
  ],
  "Nice": [
    {
      "name": "Hugo Lloris",
      "pos": "gk",
      "title": "Hugo",
      "title_es": "Hugo"
    },
    {
      "name": "Dante",
      "pos": "def",
      "title": "Comandante",
      "title_es": "Comandante"
    },
    {
      "name": "Jean-Marc Guillou",
      "pos": "mid",
      "title": "JMG",
      "title_es": "JMG"
    },
    {
      "name": "Mario Balotelli",
      "pos": "st",
      "title": "Super Mario",
      "title_es": "Súper Mario"
    }
  ],
  "Lens": [
    {
      "name": "Guillaume Warmuz",
      "pos": "gk",
      "title": "Warmuz",
      "title_es": "Warmuz"
    },
    {
      "name": "Éric Sikora",
      "pos": "def",
      "title": "Captain Siko",
      "title_es": "Capitán Siko"
    },
    {
      "name": "Seko Fofana",
      "pos": "mid",
      "title": "Captain Seko",
      "title_es": "Capitán Seko"
    },
    {
      "name": "Tony Vairelles",
      "pos": "st",
      "title": "Tony",
      "title_es": "Tony"
    }
  ],
  "Rennes": [
    {
      "name": "Benoît Costil",
      "pos": "gk",
      "title": "Costil",
      "title_es": "Costil"
    },
    {
      "name": "Romain Danzé",
      "pos": "def",
      "title": "La Danze",
      "title_es": "La Danze"
    },
    {
      "name": "Eduardo Camavinga",
      "pos": "mid",
      "title": "Cama",
      "title_es": "Cama"
    },
    {
      "name": "Alexander Frei",
      "pos": "st",
      "title": "Alex",
      "title_es": "Alex"
    }
  ],
  "Strasbourg": [
    {
      "name": "Alexander Vencel",
      "pos": "gk",
      "title": "Alex",
      "title_es": "Alex"
    },
    {
      "name": "Léonard Specht",
      "pos": "def",
      "title": "Leo",
      "title_es": "Leo"
    },
    {
      "name": "Youri Djorkaeff",
      "pos": "mid",
      "title": "The Snake",
      "title_es": "La Serpiente"
    },
    {
      "name": "Albert Gemmrich",
      "pos": "st",
      "title": "Albert",
      "title_es": "Albert"
    }
  ],
  "Toulouse": [
    {
      "name": "Alban Lafont",
      "pos": "gk",
      "title": "Alban",
      "title_es": "Alban"
    },
    {
      "name": "Issa Diop",
      "pos": "def",
      "title": "Issa",
      "title_es": "Issa"
    },
    {
      "name": "Étienne Capoue",
      "pos": "mid",
      "title": "Capoue",
      "title_es": "Capoue"
    },
    {
      "name": "André-Pierre Gignac",
      "pos": "st",
      "title": "Dédé",
      "title_es": "Dédé"
    }
  ],
  "Nantes": [
    {
      "name": "Mickaël Landreau",
      "pos": "gk",
      "title": "Micka",
      "title_es": "Micka"
    },
    {
      "name": "Maxime Bossis",
      "pos": "def",
      "title": "Max",
      "title_es": "Max"
    },
    {
      "name": "Henri Michel",
      "pos": "mid",
      "title": "Henri",
      "title_es": "Henri"
    },
    {
      "name": "Emiliano Sala",
      "pos": "st",
      "title": "Emi",
      "title_es": "Emi"
    }
  ],
  "Brest": [
    {
      "name": "Gautier Larsonneur",
      "pos": "gk",
      "title": "Gautier",
      "title_es": "Gautier"
    },
    {
      "name": "Paul Baysse",
      "pos": "def",
      "title": "Paul",
      "title_es": "Paul"
    },
    {
      "name": "Corentin Martins",
      "pos": "mid",
      "title": "Coco",
      "title_es": "Coco"
    },
    {
      "name": "Nolan Roux",
      "pos": "st",
      "title": "Nolan",
      "title_es": "Nolan"
    }
  ],
  "Montpellier": [
    {
      "name": "Geoffrey Jourdren",
      "pos": "gk",
      "title": "Jourdren",
      "title_es": "Jourdren"
    },
    {
      "name": "Vitorino Hilton",
      "pos": "def",
      "title": "Captain Hilton",
      "title_es": "Capitán Hilton"
    },
    {
      "name": "Téji Savanier",
      "pos": "mid",
      "title": "Téji",
      "title_es": "Téji"
    },
    {
      "name": "Olivier Giroud",
      "pos": "st",
      "title": "Oli",
      "title_es": "Oli"
    }
  ],
  "Auxerre": [
    {
      "name": "Fabien Cool",
      "pos": "gk",
      "title": "Fabien",
      "title_es": "Fabien"
    },
    {
      "name": "Philippe Mexès",
      "pos": "def",
      "title": "Phil",
      "title_es": "Phil"
    },
    {
      "name": "Yann Lachuer",
      "pos": "mid",
      "title": "Yann",
      "title_es": "Yann"
    },
    {
      "name": "Djibril Cissé",
      "pos": "st",
      "title": "Djibril",
      "title_es": "Djibril"
    }
  ],
  "Lorient": [
    {
      "name": "Fabien Audard",
      "pos": "gk",
      "title": "Fabien",
      "title_es": "Fabien"
    },
    {
      "name": "Michaël Ciani",
      "pos": "def",
      "title": "Ciani",
      "title_es": "Ciani"
    },
    {
      "name": "Christian Gourcuff",
      "pos": "mid",
      "title": "The Architect",
      "title_es": "El Arquitecto"
    },
    {
      "name": "Kévin Gameiro",
      "pos": "st",
      "title": "Kévin",
      "title_es": "Kévin"
    }
  ],
  "Le Havre": [
    {
      "name": "Christophe Revault",
      "pos": "gk",
      "title": "Revault",
      "title_es": "Revault"
    },
    {
      "name": "Jean-Alain Boumsong",
      "pos": "def",
      "title": "Boumsong",
      "title_es": "Boumsong"
    },
    {
      "name": "Vikash Dhorasoo",
      "pos": "mid",
      "title": "Vikash",
      "title_es": "Vikash"
    },
    {
      "name": "Guillaume Hoarau",
      "pos": "st",
      "title": "Guillaume",
      "title_es": "Guillaume"
    }
  ],
  "Angers": [
    {
      "name": "Ludovic Butelle",
      "pos": "gk",
      "title": "Ludo",
      "title_es": "Ludo"
    },
    {
      "name": "Romain Thomas",
      "pos": "def",
      "title": "Romain",
      "title_es": "Romain"
    },
    {
      "name": "Thomas Mangani",
      "pos": "mid",
      "title": "Mangani",
      "title_es": "Mangani"
    },
    {
      "name": "Famara Diédhiou",
      "pos": "st",
      "title": "Famara",
      "title_es": "Famara"
    }
  ],
  "Metz": [
    {
      "name": "Thomas Didillon",
      "pos": "gk",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Sylvain Kastendeuch",
      "pos": "def",
      "title": "Sylvain",
      "title_es": "Sylvain"
    },
    {
      "name": "Robert Pires",
      "pos": "mid",
      "title": "Robert",
      "title_es": "Robert"
    },
    {
      "name": "Papiss Cissé",
      "pos": "st",
      "title": "Papiss",
      "title_es": "Papiss"
    }
  ],
  "Real Madrid": [
    {
      "name": "Iker Casillas",
      "pos": "gk",
      "title": "San Iker",
      "title_es": "San Iker"
    },
    {
      "name": "Sergio Ramos",
      "pos": "def",
      "title": "El Capitán",
      "title_es": "El Capitán"
    },
    {
      "name": "Zinedine Zidane",
      "pos": "mid",
      "title": "Zizou",
      "title_es": "Zizou"
    },
    {
      "name": "Cristiano Ronaldo",
      "pos": "st",
      "title": "CR7",
      "title_es": "CR7"
    }
  ],
  "Barcelona": [
    {
      "name": "Víctor Valdés",
      "pos": "gk",
      "title": "Víctor",
      "title_es": "Víctor"
    },
    {
      "name": "Carles Puyol",
      "pos": "def",
      "title": "El Tiburón",
      "title_es": "El Tiburón"
    },
    {
      "name": "Xavi",
      "pos": "mid",
      "title": "The Puppet Master",
      "title_es": "El Titiritero"
    },
    {
      "name": "Lionel Messi",
      "pos": "st",
      "title": "La Pulga",
      "title_es": "La Pulga"
    }
  ],
  "Atlético Madrid": [
    {
      "name": "Jan Oblak",
      "pos": "gk",
      "title": "The Wall",
      "title_es": "El Muro"
    },
    {
      "name": "Diego Godín",
      "pos": "def",
      "title": "The Pharaoh",
      "title_es": "El Faraón"
    },
    {
      "name": "Diego Simeone",
      "pos": "mid",
      "title": "Cholo",
      "title_es": "Cholo"
    },
    {
      "name": "Fernando Torres",
      "pos": "st",
      "title": "El Niño",
      "title_es": "El Niño"
    }
  ],
  "Athletic Club": [
    {
      "name": "José Ángel Iribar",
      "pos": "gk",
      "title": "El Txopo",
      "title_es": "El Txopo"
    },
    {
      "name": "Andoni Iraola",
      "pos": "def",
      "title": "Iraola",
      "title_es": "Iraola"
    },
    {
      "name": "Julen Guerrero",
      "pos": "mid",
      "title": "The Pearl",
      "title_es": "La Perla"
    },
    {
      "name": "Telmo Zarra",
      "pos": "st",
      "title": "Zarra",
      "title_es": "Zarra"
    }
  ],
  "Villarreal": [
    {
      "name": "Sergio Asenjo",
      "pos": "gk",
      "title": "Sergio",
      "title_es": "Sergio"
    },
    {
      "name": "Gonzalo Rodríguez",
      "pos": "def",
      "title": "Gonzalo",
      "title_es": "Gonzalo"
    },
    {
      "name": "Marcos Senna",
      "pos": "mid",
      "title": "El Capitán",
      "title_es": "El Capitán"
    },
    {
      "name": "Gerard Moreno",
      "pos": "st",
      "title": "Gerard",
      "title_es": "Gerard"
    }
  ],
  "Real Sociedad": [
    {
      "name": "Luis Arconada",
      "pos": "gk",
      "title": "The Octopus",
      "title_es": "El Pulpo"
    },
    {
      "name": "Inaxio Kortabarria",
      "pos": "def",
      "title": "Inaxio",
      "title_es": "Inaxio"
    },
    {
      "name": "Xabi Prieto",
      "pos": "mid",
      "title": "Xabi",
      "title_es": "Xabi"
    },
    {
      "name": "Darko Kovačević",
      "pos": "st",
      "title": "Darko",
      "title_es": "Darko"
    }
  ],
  "Real Betis": [
    {
      "name": "José Ramón Esnaola",
      "pos": "gk",
      "title": "Esnaola",
      "title_es": "Esnaola"
    },
    {
      "name": "Juanito",
      "pos": "def",
      "title": "Juanito",
      "title_es": "Juanito"
    },
    {
      "name": "Joaquín",
      "pos": "mid",
      "title": "The Artist",
      "title_es": "El Arte"
    },
    {
      "name": "Rubén Castro",
      "pos": "st",
      "title": "Rubén",
      "title_es": "Rubén"
    }
  ],
  "Sevilla": [
    {
      "name": "Andrés Palop",
      "pos": "gk",
      "title": "Palop",
      "title_es": "Palop"
    },
    {
      "name": "Javi Navarro",
      "pos": "def",
      "title": "Navarro",
      "title_es": "Navarro"
    },
    {
      "name": "Jesús Navas",
      "pos": "mid",
      "title": "El Duende",
      "title_es": "El Duende"
    },
    {
      "name": "Frédéric Kanouté",
      "pos": "st",
      "title": "Kanouté",
      "title_es": "Kanouté"
    }
  ],
  "Valencia": [
    {
      "name": "Santiago Cañizares",
      "pos": "gk",
      "title": "The Dragon",
      "title_es": "El Dragón"
    },
    {
      "name": "Roberto Ayala",
      "pos": "def",
      "title": "El Ratón",
      "title_es": "El Ratón"
    },
    {
      "name": "Gaizka Mendieta",
      "pos": "mid",
      "title": "Mendieta",
      "title_es": "Mendieta"
    },
    {
      "name": "Mario Kempes",
      "pos": "st",
      "title": "El Matador",
      "title_es": "El Matador"
    }
  ],
  "Girona": [
    {
      "name": "Bono",
      "pos": "gk",
      "title": "Bono",
      "title_es": "Bono"
    },
    {
      "name": "Bernardo Espinosa",
      "pos": "def",
      "title": "Bernardo",
      "title_es": "Bernardo"
    },
    {
      "name": "Borja García",
      "pos": "mid",
      "title": "Borja",
      "title_es": "Borja"
    },
    {
      "name": "Cristhian Stuani",
      "pos": "st",
      "title": "El Matador",
      "title_es": "El Matador"
    }
  ],
  "Celta Vigo": [
    {
      "name": "Sergio Álvarez",
      "pos": "gk",
      "title": "O Gato",
      "title_es": "O Gato"
    },
    {
      "name": "Hugo Mallo",
      "pos": "def",
      "title": "Hugo",
      "title_es": "Hugo"
    },
    {
      "name": "Aleksandr Mostovoi",
      "pos": "mid",
      "title": "The Tsar",
      "title_es": "El Zar"
    },
    {
      "name": "Iago Aspas",
      "pos": "st",
      "title": "The Prince",
      "title_es": "El Príncipe"
    }
  ],
  "Osasuna": [
    {
      "name": "Ricardo",
      "pos": "gk",
      "title": "Ricardo",
      "title_es": "Ricardo"
    },
    {
      "name": "César Cruchaga",
      "pos": "def",
      "title": "Captain",
      "title_es": "Capitán"
    },
    {
      "name": "Patxi Puñal",
      "pos": "mid",
      "title": "Patxi",
      "title_es": "Patxi"
    },
    {
      "name": "Jan Urban",
      "pos": "st",
      "title": "Jan",
      "title_es": "Jan"
    }
  ],
  "Getafe": [
    {
      "name": "David Soria",
      "pos": "gk",
      "title": "Soria",
      "title_es": "Soria"
    },
    {
      "name": "Djené",
      "pos": "def",
      "title": "Djené",
      "title_es": "Djené"
    },
    {
      "name": "Javier Casquero",
      "pos": "mid",
      "title": "Casquero",
      "title_es": "Casquero"
    },
    {
      "name": "Manu del Moral",
      "pos": "st",
      "title": "Manu",
      "title_es": "Manu"
    }
  ],
  "Espanyol": [
    {
      "name": "Thomas N'Kono",
      "pos": "gk",
      "title": "The Panther",
      "title_es": "La Pantera"
    },
    {
      "name": "Mauricio Pochettino",
      "pos": "def",
      "title": "Poche",
      "title_es": "Poche"
    },
    {
      "name": "Iván de la Peña",
      "pos": "mid",
      "title": "Little Buddha",
      "title_es": "El Pequeño Buda"
    },
    {
      "name": "Raúl Tamudo",
      "pos": "st",
      "title": "Tamudo",
      "title_es": "Tamudo"
    }
  ],
  "Mallorca": [
    {
      "name": "Leo Franco",
      "pos": "gk",
      "title": "Leo",
      "title_es": "Leo"
    },
    {
      "name": "Miguel Ángel Nadal",
      "pos": "def",
      "title": "The Beast",
      "title_es": "La Bestia"
    },
    {
      "name": "Ariel Ibagaza",
      "pos": "mid",
      "title": "El Caño",
      "title_es": "El Caño"
    },
    {
      "name": "Samuel Eto'o",
      "pos": "st",
      "title": "The Lion",
      "title_es": "El León"
    }
  ],
  "Rayo Vallecano": [
    {
      "name": "Wilfred Agbonavbare",
      "pos": "gk",
      "title": "Willy",
      "title_es": "Willy"
    },
    {
      "name": "Paco Jémez",
      "pos": "def",
      "title": "Paco",
      "title_es": "Paco"
    },
    {
      "name": "Roberto Trashorras",
      "pos": "mid",
      "title": "Trashorras",
      "title_es": "Trashorras"
    },
    {
      "name": "Jon Pérez Bolo",
      "pos": "st",
      "title": "Bolo",
      "title_es": "Bolo"
    }
  ],
  "Alavés": [
    {
      "name": "Fernando Pacheco",
      "pos": "gk",
      "title": "Pacheco",
      "title_es": "Pacheco"
    },
    {
      "name": "Víctor Laguardia",
      "pos": "def",
      "title": "Víctor",
      "title_es": "Víctor"
    },
    {
      "name": "Manu García",
      "pos": "mid",
      "title": "Manu",
      "title_es": "Manu"
    },
    {
      "name": "Javi Moreno",
      "pos": "st",
      "title": "Javi",
      "title_es": "Javi"
    }
  ],
  "Las Palmas": [
    {
      "name": "Daniel Carnevali",
      "pos": "gk",
      "title": "Daniel",
      "title_es": "Daniel"
    },
    {
      "name": "David García",
      "pos": "def",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Juan Carlos Valerón",
      "pos": "mid",
      "title": "The Magician",
      "title_es": "El Mago"
    },
    {
      "name": "Sergio Araujo",
      "pos": "st",
      "title": "Chino",
      "title_es": "Chino"
    }
  ],
  "Levante": [
    {
      "name": "Keylor Navas",
      "pos": "gk",
      "title": "Keylor",
      "title_es": "Keylor"
    },
    {
      "name": "Sergio Ballesteros",
      "pos": "def",
      "title": "Ballesteros",
      "title_es": "Ballesteros"
    },
    {
      "name": "José Luis Morales",
      "pos": "mid",
      "title": "El Comandante",
      "title_es": "El Comandante"
    },
    {
      "name": "Roger Martí",
      "pos": "st",
      "title": "Pistolero",
      "title_es": "Pistolero"
    }
  ],
  "Elche": [
    {
      "name": "Manu Herrera",
      "pos": "gk",
      "title": "Manu",
      "title_es": "Manu"
    },
    {
      "name": "Edu Albácar",
      "pos": "def",
      "title": "Edu",
      "title_es": "Edu"
    },
    {
      "name": "Fidel",
      "pos": "mid",
      "title": "Fidel",
      "title_es": "Fidel"
    },
    {
      "name": "Nino",
      "pos": "st",
      "title": "Nino",
      "title_es": "Nino"
    }
  ],
  "Manchester City": [
    {
      "name": "Bert Trautmann",
      "pos": "gk",
      "title": "Bert",
      "title_es": "Bert"
    },
    {
      "name": "Vincent Kompany",
      "pos": "def",
      "title": "Captain",
      "title_es": "Capitán"
    },
    {
      "name": "Kevin De Bruyne",
      "pos": "mid",
      "title": "KDB",
      "title_es": "KDB"
    },
    {
      "name": "Sergio Agüero",
      "pos": "st",
      "title": "Kun",
      "title_es": "Kun"
    }
  ],
  "Arsenal": [
    {
      "name": "David Seaman",
      "pos": "gk",
      "title": "Safe Hands",
      "title_es": "Manos Seguras"
    },
    {
      "name": "Tony Adams",
      "pos": "def",
      "title": "Mr. Arsenal",
      "title_es": "Mr. Arsenal"
    },
    {
      "name": "Patrick Vieira",
      "pos": "mid",
      "title": "Paddy",
      "title_es": "Paddy"
    },
    {
      "name": "Thierry Henry",
      "pos": "st",
      "title": "The King",
      "title_es": "El Rey"
    }
  ],
  "Liverpool": [
    {
      "name": "Ray Clemence",
      "pos": "gk",
      "title": "Ray",
      "title_es": "Ray"
    },
    {
      "name": "Alan Hansen",
      "pos": "def",
      "title": "Jocky",
      "title_es": "Jocky"
    },
    {
      "name": "Steven Gerrard",
      "pos": "mid",
      "title": "Captain Fantastic",
      "title_es": "Capitán Fantástico"
    },
    {
      "name": "Ian Rush",
      "pos": "st",
      "title": "Rushie",
      "title_es": "Rushie"
    }
  ],
  "Chelsea": [
    {
      "name": "Petr Čech",
      "pos": "gk",
      "title": "Big Pete",
      "title_es": "Big Pete"
    },
    {
      "name": "John Terry",
      "pos": "def",
      "title": "Captain, Leader, Legend",
      "title_es": "Capitán, Líder, Leyenda"
    },
    {
      "name": "Frank Lampard",
      "pos": "mid",
      "title": "Super Frank",
      "title_es": "Súper Frank"
    },
    {
      "name": "Didier Drogba",
      "pos": "st",
      "title": "The King",
      "title_es": "El Rey"
    }
  ],
  "Tottenham": [
    {
      "name": "Pat Jennings",
      "pos": "gk",
      "title": "Pat",
      "title_es": "Pat"
    },
    {
      "name": "Ledley King",
      "pos": "def",
      "title": "The King",
      "title_es": "El Rey"
    },
    {
      "name": "Paul Gascoigne",
      "pos": "mid",
      "title": "Gazza",
      "title_es": "Gazza"
    },
    {
      "name": "Harry Kane",
      "pos": "st",
      "title": "Hurricane",
      "title_es": "Huracán"
    }
  ],
  "Newcastle": [
    {
      "name": "Shay Given",
      "pos": "gk",
      "title": "Shay",
      "title_es": "Shay"
    },
    {
      "name": "Fabricio Coloccini",
      "pos": "def",
      "title": "Colo",
      "title_es": "Colo"
    },
    {
      "name": "Gary Speed",
      "pos": "mid",
      "title": "Speedo",
      "title_es": "Speedo"
    },
    {
      "name": "Alan Shearer",
      "pos": "st",
      "title": "Big Al",
      "title_es": "Big Al"
    }
  ],
  "Manchester United": [
    {
      "name": "Peter Schmeichel",
      "pos": "gk",
      "title": "The Great Dane",
      "title_es": "El Gran Danés"
    },
    {
      "name": "Rio Ferdinand",
      "pos": "def",
      "title": "Rio",
      "title_es": "Rio"
    },
    {
      "name": "Paul Scholes",
      "pos": "mid",
      "title": "The Prince",
      "title_es": "El Príncipe"
    },
    {
      "name": "Wayne Rooney",
      "pos": "st",
      "title": "Wazza",
      "title_es": "Wazza"
    }
  ],
  "Aston Villa": [
    {
      "name": "Nigel Spink",
      "pos": "gk",
      "title": "Spinky",
      "title_es": "Spinky"
    },
    {
      "name": "Paul McGrath",
      "pos": "def",
      "title": "God",
      "title_es": "Dios"
    },
    {
      "name": "Gordon Cowans",
      "pos": "mid",
      "title": "Sid",
      "title_es": "Sid"
    },
    {
      "name": "Peter Withe",
      "pos": "st",
      "title": "Peter",
      "title_es": "Peter"
    }
  ],
  "Brighton": [
    {
      "name": "Mat Ryan",
      "pos": "gk",
      "title": "Mat",
      "title_es": "Mat"
    },
    {
      "name": "Lewis Dunk",
      "pos": "def",
      "title": "Dunky",
      "title_es": "Dunky"
    },
    {
      "name": "Pascal Groß",
      "pos": "mid",
      "title": "Pascal",
      "title_es": "Pascal"
    },
    {
      "name": "Glenn Murray",
      "pos": "st",
      "title": "Glenn",
      "title_es": "Glenn"
    }
  ],
  "West Ham": [
    {
      "name": "Phil Parkes",
      "pos": "gk",
      "title": "Phil",
      "title_es": "Phil"
    },
    {
      "name": "Bobby Moore",
      "pos": "def",
      "title": "Mooro",
      "title_es": "Mooro"
    },
    {
      "name": "Trevor Brooking",
      "pos": "mid",
      "title": "Sir Trevor",
      "title_es": "Sir Trevor"
    },
    {
      "name": "Paolo Di Canio",
      "pos": "st",
      "title": "Paolo",
      "title_es": "Paolo"
    }
  ],
  "Crystal Palace": [
    {
      "name": "Julian Speroni",
      "pos": "gk",
      "title": "Jules",
      "title_es": "Jules"
    },
    {
      "name": "Jim Cannon",
      "pos": "def",
      "title": "Jim",
      "title_es": "Jim"
    },
    {
      "name": "Attilio Lombardo",
      "pos": "mid",
      "title": "The Bald Eagle",
      "title_es": "El Águila Calva"
    },
    {
      "name": "Wilfried Zaha",
      "pos": "st",
      "title": "Wilf",
      "title_es": "Wilf"
    }
  ],
  "Fulham": [
    {
      "name": "Mark Schwarzer",
      "pos": "gk",
      "title": "Mark",
      "title_es": "Mark"
    },
    {
      "name": "Brede Hangeland",
      "pos": "def",
      "title": "Brede",
      "title_es": "Brede"
    },
    {
      "name": "Danny Murphy",
      "pos": "mid",
      "title": "Danny",
      "title_es": "Danny"
    },
    {
      "name": "Clint Dempsey",
      "pos": "st",
      "title": "Deuce",
      "title_es": "Deuce"
    }
  ],
  "Bournemouth": [
    {
      "name": "Artur Boruc",
      "pos": "gk",
      "title": "Holy Goalie",
      "title_es": "Holy Goalie"
    },
    {
      "name": "Steve Cook",
      "pos": "def",
      "title": "Cookie",
      "title_es": "Cookie"
    },
    {
      "name": "Marc Pugh",
      "pos": "mid",
      "title": "Pughie",
      "title_es": "Pughie"
    },
    {
      "name": "Callum Wilson",
      "pos": "st",
      "title": "Callum",
      "title_es": "Callum"
    }
  ],
  "Brentford": [
    {
      "name": "David Raya",
      "pos": "gk",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Pontus Jansson",
      "pos": "def",
      "title": "Pontus",
      "title_es": "Pontus"
    },
    {
      "name": "Christian Nørgaard",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Ivan Toney",
      "pos": "st",
      "title": "Ivan",
      "title_es": "Ivan"
    }
  ],
  "Everton": [
    {
      "name": "Neville Southall",
      "pos": "gk",
      "title": "Big Nev",
      "title_es": "Big Nev"
    },
    {
      "name": "Leighton Baines",
      "pos": "def",
      "title": "Bainesy",
      "title_es": "Bainesy"
    },
    {
      "name": "Tim Cahill",
      "pos": "mid",
      "title": "Timmy",
      "title_es": "Timmy"
    },
    {
      "name": "Dixie Dean",
      "pos": "st",
      "title": "Dixie",
      "title_es": "Dixie"
    }
  ],
  "Nottingham Forest": [
    {
      "name": "Peter Shilton",
      "pos": "gk",
      "title": "Shilts",
      "title_es": "Shilts"
    },
    {
      "name": "Stuart Pearce",
      "pos": "def",
      "title": "Psycho",
      "title_es": "Psycho"
    },
    {
      "name": "Roy Keane",
      "pos": "mid",
      "title": "Keano",
      "title_es": "Keano"
    },
    {
      "name": "Stan Collymore",
      "pos": "st",
      "title": "Stan",
      "title_es": "Stan"
    }
  ],
  "Wolves": [
    {
      "name": "Rui Patrício",
      "pos": "gk",
      "title": "Rui",
      "title_es": "Rui"
    },
    {
      "name": "Billy Wright",
      "pos": "def",
      "title": "Billy",
      "title_es": "Billy"
    },
    {
      "name": "Rúben Neves",
      "pos": "mid",
      "title": "Rúben",
      "title_es": "Rúben"
    },
    {
      "name": "Steve Bull",
      "pos": "st",
      "title": "Bully",
      "title_es": "Bully"
    }
  ],
  "Leicester": [
    {
      "name": "Kasper Schmeichel",
      "pos": "gk",
      "title": "Kasper",
      "title_es": "Kasper"
    },
    {
      "name": "Wes Morgan",
      "pos": "def",
      "title": "Captain Morgan",
      "title_es": "Capitán Morgan"
    },
    {
      "name": "N'Golo Kanté",
      "pos": "mid",
      "title": "N'Golo",
      "title_es": "N'Golo"
    },
    {
      "name": "Jamie Vardy",
      "pos": "st",
      "title": "Vards",
      "title_es": "Vards"
    }
  ],
  "Leeds": [
    {
      "name": "Nigel Martyn",
      "pos": "gk",
      "title": "Nigel",
      "title_es": "Nigel"
    },
    {
      "name": "Norman Hunter",
      "pos": "def",
      "title": "Bites Yer Legs",
      "title_es": "Bites Yer Legs"
    },
    {
      "name": "Billy Bremner",
      "pos": "mid",
      "title": "King Billy",
      "title_es": "Rey Billy"
    },
    {
      "name": "Peter Lorimer",
      "pos": "st",
      "title": "Lash",
      "title_es": "Lash"
    }
  ],
  "Sunderland": [
    {
      "name": "Jimmy Montgomery",
      "pos": "gk",
      "title": "Monty",
      "title_es": "Monty"
    },
    {
      "name": "Charlie Hurley",
      "pos": "def",
      "title": "The King",
      "title_es": "El Rey"
    },
    {
      "name": "Julio Arca",
      "pos": "mid",
      "title": "Julio",
      "title_es": "Julio"
    },
    {
      "name": "Kevin Phillips",
      "pos": "st",
      "title": "Super Kev",
      "title_es": "Súper Kev"
    }
  ],
  "Flamengo": [
    {
      "name": "Júlio César",
      "pos": "gk",
      "title": "The Emperor",
      "title_es": "El Emperador"
    },
    {
      "name": "Júnior",
      "pos": "def",
      "title": "Capacete",
      "title_es": "Capacete"
    },
    {
      "name": "Zico",
      "pos": "mid",
      "title": "The White Pelé",
      "title_es": "El Pelé Blanco"
    },
    {
      "name": "Gabigol",
      "pos": "st",
      "title": "Gabi",
      "title_es": "Gabi"
    }
  ],
  "Palmeiras": [
    {
      "name": "Marcos",
      "pos": "gk",
      "title": "Saint Marcos",
      "title_es": "San Marcos"
    },
    {
      "name": "Gustavo Gómez",
      "pos": "def",
      "title": "El Capitán",
      "title_es": "El Capitán"
    },
    {
      "name": "Ademir da Guia",
      "pos": "mid",
      "title": "The Divine",
      "title_es": "El Divino"
    },
    {
      "name": "Evair",
      "pos": "st",
      "title": "El Matador",
      "title_es": "El Matador"
    }
  ],
  "Botafogo": [
    {
      "name": "Jefferson",
      "pos": "gk",
      "title": "Jeff",
      "title_es": "Jeff"
    },
    {
      "name": "Nilton Santos",
      "pos": "def",
      "title": "The Encyclopedia",
      "title_es": "La Enciclopedia"
    },
    {
      "name": "Didi",
      "pos": "mid",
      "title": "Mr. Football",
      "title_es": "Señor Fútbol"
    },
    {
      "name": "Garrincha",
      "pos": "st",
      "title": "Joy of the People",
      "title_es": "Alegría del Pueblo"
    }
  ],
  "Corinthians": [
    {
      "name": "Cássio",
      "pos": "gk",
      "title": "Gigante",
      "title_es": "Gigante"
    },
    {
      "name": "Wladimir",
      "pos": "def",
      "title": "Wlad",
      "title_es": "Wlad"
    },
    {
      "name": "Sócrates",
      "pos": "mid",
      "title": "Doctor",
      "title_es": "El Doctor"
    },
    {
      "name": "Ronaldo",
      "pos": "st",
      "title": "O Fenômeno",
      "title_es": "El Fenómeno"
    }
  ],
  "São Paulo": [
    {
      "name": "Rogério Ceni",
      "pos": "gk",
      "title": "El Mito",
      "title_es": "El Mito"
    },
    {
      "name": "Diego Lugano",
      "pos": "def",
      "title": "El Dios",
      "title_es": "El Dios"
    },
    {
      "name": "Raí",
      "pos": "mid",
      "title": "Raí",
      "title_es": "Raí"
    },
    {
      "name": "Careca",
      "pos": "st",
      "title": "Careca",
      "title_es": "Careca"
    }
  ],
  "Atlético Mineiro": [
    {
      "name": "Victor",
      "pos": "gk",
      "title": "Saint Victor",
      "title_es": "San Victor"
    },
    {
      "name": "Réver",
      "pos": "def",
      "title": "Captain",
      "title_es": "Capitán"
    },
    {
      "name": "Ronaldinho",
      "pos": "mid",
      "title": "Bruxo",
      "title_es": "El Brujo"
    },
    {
      "name": "Reinaldo",
      "pos": "st",
      "title": "The King",
      "title_es": "El Rey"
    }
  ],
  "Fluminense": [
    {
      "name": "Castilho",
      "pos": "gk",
      "title": "Castilho",
      "title_es": "Castilho"
    },
    {
      "name": "Thiago Silva",
      "pos": "def",
      "title": "O Monstro",
      "title_es": "El Monstruo"
    },
    {
      "name": "Romerito",
      "pos": "mid",
      "title": "Romerito",
      "title_es": "Romerito"
    },
    {
      "name": "Fred",
      "pos": "st",
      "title": "Don Fredon",
      "title_es": "Don Fredon"
    }
  ],
  "Grêmio": [
    {
      "name": "Danrlei",
      "pos": "gk",
      "title": "Danrlei",
      "title_es": "Danrlei"
    },
    {
      "name": "Pedro Geromel",
      "pos": "def",
      "title": "Geromito",
      "title_es": "Geromito"
    },
    {
      "name": "Luan",
      "pos": "mid",
      "title": "Rei da América",
      "title_es": "Rey de América"
    },
    {
      "name": "Renato Gaúcho",
      "pos": "st",
      "title": "Renato",
      "title_es": "Renato"
    }
  ],
  "Santos": [
    {
      "name": "Gilmar",
      "pos": "gk",
      "title": "Gilmar",
      "title_es": "Gilmar"
    },
    {
      "name": "Carlos Alberto Torres",
      "pos": "def",
      "title": "The Captain",
      "title_es": "El Capitán"
    },
    {
      "name": "Zito",
      "pos": "mid",
      "title": "Zito",
      "title_es": "Zito"
    },
    {
      "name": "Pelé",
      "pos": "st",
      "title": "The King",
      "title_es": "O Rei"
    }
  ],
  "Internacional": [
    {
      "name": "Taffarel",
      "pos": "gk",
      "title": "Taffa",
      "title_es": "Taffa"
    },
    {
      "name": "Elías Figueroa",
      "pos": "def",
      "title": "Don Elías",
      "title_es": "Don Elías"
    },
    {
      "name": "Falcão",
      "pos": "mid",
      "title": "The King of Rome",
      "title_es": "El Rey de Roma"
    },
    {
      "name": "Fernandão",
      "pos": "st",
      "title": "Captain Fernandão",
      "title_es": "Capitán Fernandão"
    }
  ],
  "Cruzeiro": [
    {
      "name": "Dida",
      "pos": "gk",
      "title": "Dida",
      "title_es": "Dida"
    },
    {
      "name": "Juan Pablo Sorín",
      "pos": "def",
      "title": "Sorín",
      "title_es": "Sorín"
    },
    {
      "name": "Alex",
      "pos": "mid",
      "title": "Talento",
      "title_es": "Talento"
    },
    {
      "name": "Tostão",
      "pos": "st",
      "title": "Tostão",
      "title_es": "Tostão"
    }
  ],
  "Athletico-PR": [
    {
      "name": "Weverton",
      "pos": "gk",
      "title": "Weverton",
      "title_es": "Weverton"
    },
    {
      "name": "Thiago Heleno",
      "pos": "def",
      "title": "General",
      "title_es": "El General"
    },
    {
      "name": "Kléberson",
      "pos": "mid",
      "title": "Kléberson",
      "title_es": "Kléberson"
    },
    {
      "name": "Sicupira",
      "pos": "st",
      "title": "Sicupira",
      "title_es": "Sicupira"
    }
  ],
  "Bahia": [
    {
      "name": "Ronaldo",
      "pos": "gk",
      "title": "Ronaldo",
      "title_es": "Ronaldo"
    },
    {
      "name": "Roberto Rebouças",
      "pos": "def",
      "title": "Roberto",
      "title_es": "Roberto"
    },
    {
      "name": "Bobô",
      "pos": "mid",
      "title": "Bobô",
      "title_es": "Bobô"
    },
    {
      "name": "Nonato",
      "pos": "st",
      "title": "Nonato",
      "title_es": "Nonato"
    }
  ],
  "Vasco": [
    {
      "name": "Carlos Germano",
      "pos": "gk",
      "title": "Germano",
      "title_es": "Germano"
    },
    {
      "name": "Mauro Galvão",
      "pos": "def",
      "title": "Galvão",
      "title_es": "Galvão"
    },
    {
      "name": "Juninho Pernambucano",
      "pos": "mid",
      "title": "The Monumental",
      "title_es": "El Monumental"
    },
    {
      "name": "Roberto Dinamite",
      "pos": "st",
      "title": "Dinamite",
      "title_es": "Dinamita"
    }
  ],
  "Fortaleza": [
    {
      "name": "Marcelo Boeck",
      "pos": "gk",
      "title": "Boeck",
      "title_es": "Boeck"
    },
    {
      "name": "Tinga",
      "pos": "def",
      "title": "Tinga",
      "title_es": "Tinga"
    },
    {
      "name": "Yago Pikachu",
      "pos": "mid",
      "title": "Pikachu",
      "title_es": "Pikachu"
    },
    {
      "name": "Clodoaldo",
      "pos": "st",
      "title": "Clodô",
      "title_es": "Clodô"
    }
  ],
  "Bragantino": [
    {
      "name": "Cleiton",
      "pos": "gk",
      "title": "Cleiton",
      "title_es": "Cleiton"
    },
    {
      "name": "Léo Ortiz",
      "pos": "def",
      "title": "Ortiz",
      "title_es": "Ortiz"
    },
    {
      "name": "Claudinho",
      "pos": "mid",
      "title": "Claudinho",
      "title_es": "Claudinho"
    },
    {
      "name": "Ytalo",
      "pos": "st",
      "title": "Ytalo",
      "title_es": "Ytalo"
    }
  ],
  "Ceará": [
    {
      "name": "João Marcos",
      "pos": "gk",
      "title": "João Marcos",
      "title_es": "João Marcos"
    },
    {
      "name": "Luiz Otávio",
      "pos": "def",
      "title": "Xerife",
      "title_es": "Xerife"
    },
    {
      "name": "Ricardinho",
      "pos": "mid",
      "title": "Ricardinho",
      "title_es": "Ricardinho"
    },
    {
      "name": "Magno Alves",
      "pos": "st",
      "title": "Magnata",
      "title_es": "Magnata"
    }
  ],
  "Juventude": [
    {
      "name": "Michel Alves",
      "pos": "gk",
      "title": "Michel",
      "title_es": "Michel"
    },
    {
      "name": "Antônio Carlos Zago",
      "pos": "def",
      "title": "Zago",
      "title_es": "Zago"
    },
    {
      "name": "Nenê",
      "pos": "mid",
      "title": "Nenê",
      "title_es": "Nenê"
    },
    {
      "name": "Hugo",
      "pos": "st",
      "title": "Hugo",
      "title_es": "Hugo"
    }
  ],
  "Vitória": [
    {
      "name": "Dida",
      "pos": "gk",
      "title": "Dida",
      "title_es": "Dida"
    },
    {
      "name": "David Luiz",
      "pos": "def",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Ramon Menezes",
      "pos": "mid",
      "title": "Ramon",
      "title_es": "Ramon"
    },
    {
      "name": "Bebeto",
      "pos": "st",
      "title": "Bebeto",
      "title_es": "Bebeto"
    }
  ],
  "Sport Recife": [
    {
      "name": "Magrão",
      "pos": "gk",
      "title": "Magrão",
      "title_es": "Magrão"
    },
    {
      "name": "Durval",
      "pos": "def",
      "title": "Durval",
      "title_es": "Durval"
    },
    {
      "name": "Diego Souza",
      "pos": "mid",
      "title": "DS87",
      "title_es": "DS87"
    },
    {
      "name": "Leonardo",
      "pos": "st",
      "title": "Leonardo",
      "title_es": "Leonardo"
    }
  ],
  "Sporting CP": [
    {
      "name": "Rui Patrício",
      "pos": "gk",
      "title": "São Patrício",
      "title_es": "San Patrício"
    },
    {
      "name": "Sebastián Coates",
      "pos": "def",
      "title": "El Capitán",
      "title_es": "El Capitán"
    },
    {
      "name": "Luís Figo",
      "pos": "mid",
      "title": "Figo",
      "title_es": "Figo"
    },
    {
      "name": "Fernando Peyroteo",
      "pos": "st",
      "title": "Peyroteo",
      "title_es": "Peyroteo"
    }
  ],
  "Benfica": [
    {
      "name": "Michel Preud'homme",
      "pos": "gk",
      "title": "Saint Michel",
      "title_es": "San Michel"
    },
    {
      "name": "Luisão",
      "pos": "def",
      "title": "Giraffe",
      "title_es": "Jirafa"
    },
    {
      "name": "Rui Costa",
      "pos": "mid",
      "title": "The Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "Eusébio",
      "pos": "st",
      "title": "The Black Panther",
      "title_es": "La Pantera Negra"
    }
  ],
  "Porto": [
    {
      "name": "Vítor Baía",
      "pos": "gk",
      "title": "Baía",
      "title_es": "Baía"
    },
    {
      "name": "Pepe",
      "pos": "def",
      "title": "Pepe",
      "title_es": "Pepe"
    },
    {
      "name": "Deco",
      "pos": "mid",
      "title": "The Magician",
      "title_es": "El Mago"
    },
    {
      "name": "Radamel Falcao",
      "pos": "st",
      "title": "El Tigre",
      "title_es": "El Tigre"
    }
  ],
  "Braga": [
    {
      "name": "Matheus",
      "pos": "gk",
      "title": "Matheus",
      "title_es": "Matheus"
    },
    {
      "name": "Moisés",
      "pos": "def",
      "title": "Moisés",
      "title_es": "Moisés"
    },
    {
      "name": "Alan",
      "pos": "mid",
      "title": "Alan",
      "title_es": "Alan"
    },
    {
      "name": "Ricardo Horta",
      "pos": "st",
      "title": "Horta",
      "title_es": "Horta"
    }
  ],
  "Vitória Guimarães": [
    {
      "name": "Neno",
      "pos": "gk",
      "title": "Neno",
      "title_es": "Neno"
    },
    {
      "name": "Edmond Tapsoba",
      "pos": "def",
      "title": "Tapsoba",
      "title_es": "Tapsoba"
    },
    {
      "name": "Nuno Assis",
      "pos": "mid",
      "title": "Nuno",
      "title_es": "Nuno"
    },
    {
      "name": "Paulinho Cascavel",
      "pos": "st",
      "title": "Cascavel",
      "title_es": "Cascavel"
    }
  ],
  "Famalicão": [
    {
      "name": "Luiz Júnior",
      "pos": "gk",
      "title": "Luiz",
      "title_es": "Luiz"
    },
    {
      "name": "Riccieli",
      "pos": "def",
      "title": "Riccieli",
      "title_es": "Riccieli"
    },
    {
      "name": "Pedro Gonçalves",
      "pos": "mid",
      "title": "Pote",
      "title_es": "Pote"
    },
    {
      "name": "Toni Martínez",
      "pos": "st",
      "title": "Toni",
      "title_es": "Toni"
    }
  ],
  "Estoril": [
    {
      "name": "Vagner",
      "pos": "gk",
      "title": "Vagner",
      "title_es": "Vagner"
    },
    {
      "name": "Joãozinho",
      "pos": "def",
      "title": "Joãozinho",
      "title_es": "Joãozinho"
    },
    {
      "name": "Lica",
      "pos": "mid",
      "title": "Lica",
      "title_es": "Lica"
    },
    {
      "name": "Kléber",
      "pos": "st",
      "title": "Kléber",
      "title_es": "Kléber"
    }
  ],
  "Casa Pia": [
    {
      "name": "Ricardo Batista",
      "pos": "gk",
      "title": "Ricardo",
      "title_es": "Ricardo"
    },
    {
      "name": "Vasco Fernandes",
      "pos": "def",
      "title": "Vasco",
      "title_es": "Vasco"
    },
    {
      "name": "Neto",
      "pos": "mid",
      "title": "Neto",
      "title_es": "Neto"
    },
    {
      "name": "Saviour Godwin",
      "pos": "st",
      "title": "Godwin",
      "title_es": "Godwin"
    }
  ],
  "Santa Clara": [
    {
      "name": "Marco Pereira",
      "pos": "gk",
      "title": "Marco",
      "title_es": "Marco"
    },
    {
      "name": "Fábio Cardoso",
      "pos": "def",
      "title": "Fábio",
      "title_es": "Fábio"
    },
    {
      "name": "Osama Rashid",
      "pos": "mid",
      "title": "Rashid",
      "title_es": "Rashid"
    },
    {
      "name": "Thiago Santana",
      "pos": "st",
      "title": "Santana",
      "title_es": "Santana"
    }
  ],
  "Gil Vicente": [
    {
      "name": "Adriano Facchini",
      "pos": "gk",
      "title": "Adriano",
      "title_es": "Adriano"
    },
    {
      "name": "Rúben Fernandes",
      "pos": "def",
      "title": "Rúben",
      "title_es": "Rúben"
    },
    {
      "name": "Vítor Gonçalves",
      "pos": "mid",
      "title": "Vítor",
      "title_es": "Vítor"
    },
    {
      "name": "Fran Navarro",
      "pos": "st",
      "title": "El Toro",
      "title_es": "El Toro"
    }
  ],
  "Rio Ave": [
    {
      "name": "Cássio",
      "pos": "gk",
      "title": "Cássio",
      "title_es": "Cássio"
    },
    {
      "name": "Marcelo",
      "pos": "def",
      "title": "Marcelo",
      "title_es": "Marcelo"
    },
    {
      "name": "Tarantini",
      "pos": "mid",
      "title": "Tarantini",
      "title_es": "Tarantini"
    },
    {
      "name": "Mehdi Taremi",
      "pos": "st",
      "title": "Taremi",
      "title_es": "Taremi"
    }
  ],
  "Moreirense": [
    {
      "name": "Jhonatan",
      "pos": "gk",
      "title": "Jhonatan",
      "title_es": "Jhonatan"
    },
    {
      "name": "João Aurélio",
      "pos": "def",
      "title": "João",
      "title_es": "João"
    },
    {
      "name": "Filipe Soares",
      "pos": "mid",
      "title": "Filipe",
      "title_es": "Filipe"
    },
    {
      "name": "Nenê",
      "pos": "st",
      "title": "Nenê",
      "title_es": "Nenê"
    }
  ],
  "Arouca": [
    {
      "name": "Bracali",
      "pos": "gk",
      "title": "Bracali",
      "title_es": "Bracali"
    },
    {
      "name": "Sema Velázquez",
      "pos": "def",
      "title": "Sema",
      "title_es": "Sema"
    },
    {
      "name": "David Simão",
      "pos": "mid",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Rafa Mújica",
      "pos": "st",
      "title": "Rafa",
      "title_es": "Rafa"
    }
  ],
  "Nacional Madeira": [
    {
      "name": "Diego Benaglio",
      "pos": "gk",
      "title": "Diego",
      "title_es": "Diego"
    },
    {
      "name": "Zainadine Júnior",
      "pos": "def",
      "title": "Zaina",
      "title_es": "Zaina"
    },
    {
      "name": "Rúben Micael",
      "pos": "mid",
      "title": "Rúben",
      "title_es": "Rúben"
    },
    {
      "name": "Nenê",
      "pos": "st",
      "title": "Nenê",
      "title_es": "Nenê"
    }
  ],
  "Estrela": [
    {
      "name": "Tomislav Ivković",
      "pos": "gk",
      "title": "Tomislav",
      "title_es": "Tomislav"
    },
    {
      "name": "Jorge Andrade",
      "pos": "def",
      "title": "Jorge",
      "title_es": "Jorge"
    },
    {
      "name": "Rebelo",
      "pos": "mid",
      "title": "Rebelo",
      "title_es": "Rebelo"
    },
    {
      "name": "Paulo Alves",
      "pos": "st",
      "title": "Paulo",
      "title_es": "Paulo"
    }
  ],
  "Alverca": [
    {
      "name": "Yannick",
      "pos": "gk",
      "title": "Yannick",
      "title_es": "Yannick"
    },
    {
      "name": "Ricardo Carvalho",
      "pos": "def",
      "title": "Ricardo",
      "title_es": "Ricardo"
    },
    {
      "name": "Deco",
      "pos": "mid",
      "title": "Deco",
      "title_es": "Deco"
    },
    {
      "name": "Mantorras",
      "pos": "st",
      "title": "Mantorras",
      "title_es": "Mantorras"
    }
  ],
  "Farense": [
    {
      "name": "Peter Rufai",
      "pos": "gk",
      "title": "Rufai",
      "title_es": "Rufai"
    },
    {
      "name": "Jorge Soares",
      "pos": "def",
      "title": "Jorge",
      "title_es": "Jorge"
    },
    {
      "name": "Hajry Redouane",
      "pos": "mid",
      "title": "Hajry",
      "title_es": "Hajry"
    },
    {
      "name": "Hassan Nader",
      "pos": "st",
      "title": "Hassan",
      "title_es": "Hassan"
    }
  ],
  "AVS": [
    {
      "name": "Quim",
      "pos": "gk",
      "title": "Quim",
      "title_es": "Quim"
    },
    {
      "name": "Rodrigo Defendi",
      "pos": "def",
      "title": "Rodrigo",
      "title_es": "Rodrigo"
    },
    {
      "name": "Vítor Gomes",
      "pos": "mid",
      "title": "Vítor",
      "title_es": "Vítor"
    },
    {
      "name": "Derley",
      "pos": "st",
      "title": "Derley",
      "title_es": "Derley"
    }
  ],
  "Ajax": [
    {
      "name": "Edwin van der Sar",
      "pos": "gk",
      "title": "The Flying Dutchman",
      "title_es": "El Holandés Volador"
    },
    {
      "name": "Frank de Boer",
      "pos": "def",
      "title": "Frank",
      "title_es": "Frank"
    },
    {
      "name": "Johan Cruyff",
      "pos": "mid",
      "title": "El Flaco",
      "title_es": "El Flaco"
    },
    {
      "name": "Marco van Basten",
      "pos": "st",
      "title": "San Marco",
      "title_es": "San Marco"
    }
  ],
  "PSV": [
    {
      "name": "Hans van Breukelen",
      "pos": "gk",
      "title": "De Breuk",
      "title_es": "De Breuk"
    },
    {
      "name": "Ronald Koeman",
      "pos": "def",
      "title": "Tintin",
      "title_es": "Tintín"
    },
    {
      "name": "Ruud Gullit",
      "pos": "mid",
      "title": "The Black Tulip",
      "title_es": "El Tulipán Negro"
    },
    {
      "name": "Romário",
      "pos": "st",
      "title": "Baixinho",
      "title_es": "Baixinho"
    }
  ],
  "Feyenoord": [
    {
      "name": "Eddy Pieters Graafland",
      "pos": "gk",
      "title": "Eddy PG",
      "title_es": "Eddy PG"
    },
    {
      "name": "Rinus Israël",
      "pos": "def",
      "title": "Iron Rinus",
      "title_es": "Rinus de Hierro"
    },
    {
      "name": "Willem van Hanegem",
      "pos": "mid",
      "title": "De Kromme",
      "title_es": "De Kromme"
    },
    {
      "name": "Dirk Kuyt",
      "pos": "st",
      "title": "Mr. Duracell",
      "title_es": "Mr. Duracell"
    }
  ],
  "AZ Alkmaar": [
    {
      "name": "Joey Didulica",
      "pos": "gk",
      "title": "Joey",
      "title_es": "Joey"
    },
    {
      "name": "Barry Opdam",
      "pos": "def",
      "title": "Barry",
      "title_es": "Barry"
    },
    {
      "name": "Kenneth Perez",
      "pos": "mid",
      "title": "Kenneth",
      "title_es": "Kenneth"
    },
    {
      "name": "Kees Kist",
      "pos": "st",
      "title": "Kees",
      "title_es": "Kees"
    }
  ],
  "Utrecht": [
    {
      "name": "Jan Willem van Ede",
      "pos": "gk",
      "title": "Jan",
      "title_es": "Jan"
    },
    {
      "name": "Ton du Chatinier",
      "pos": "def",
      "title": "Ton",
      "title_es": "Ton"
    },
    {
      "name": "Jean-Paul de Jong",
      "pos": "mid",
      "title": "Jean-Paul",
      "title_es": "Jean-Paul"
    },
    {
      "name": "Dries Mertens",
      "pos": "st",
      "title": "Ciro",
      "title_es": "Ciro"
    }
  ],
  "Twente": [
    {
      "name": "Sander Boschker",
      "pos": "gk",
      "title": "Sander",
      "title_es": "Sander"
    },
    {
      "name": "Douglas",
      "pos": "def",
      "title": "Douglas",
      "title_es": "Douglas"
    },
    {
      "name": "Wout Brama",
      "pos": "mid",
      "title": "Wout",
      "title_es": "Wout"
    },
    {
      "name": "Blaise Nkufo",
      "pos": "st",
      "title": "Blaise",
      "title_es": "Blaise"
    }
  ],
  "NEC": [
    {
      "name": "Gábor Babos",
      "pos": "gk",
      "title": "Gábor",
      "title_es": "Gábor"
    },
    {
      "name": "Patrick Pothuizen",
      "pos": "def",
      "title": "Potje",
      "title_es": "Potje"
    },
    {
      "name": "Lasse Schöne",
      "pos": "mid",
      "title": "Lasse",
      "title_es": "Lasse"
    },
    {
      "name": "Björn Vleminckx",
      "pos": "st",
      "title": "The Blonde Arrow",
      "title_es": "La Flecha Rubia"
    }
  ],
  "Go Ahead Eagles": [
    {
      "name": "Nico van Zoghel",
      "pos": "gk",
      "title": "Nico",
      "title_es": "Nico"
    },
    {
      "name": "Dick Schneider",
      "pos": "def",
      "title": "Dick",
      "title_es": "Dick"
    },
    {
      "name": "Paul Bosvelt",
      "pos": "mid",
      "title": "Paul",
      "title_es": "Paul"
    },
    {
      "name": "Ruud Geels",
      "pos": "st",
      "title": "Ruud",
      "title_es": "Ruud"
    }
  ],
  "Sparta Rotterdam": [
    {
      "name": "Pim Doesburg",
      "pos": "gk",
      "title": "Pim",
      "title_es": "Pim"
    },
    {
      "name": "Danny Blind",
      "pos": "def",
      "title": "Danny",
      "title_es": "Danny"
    },
    {
      "name": "Louis van Gaal",
      "pos": "mid",
      "title": "The Iron Tulip",
      "title_es": "El Tulipán de Hierro"
    },
    {
      "name": "Tonny van Ede",
      "pos": "st",
      "title": "Tonny",
      "title_es": "Tonny"
    }
  ],
  "Heerenveen": [
    {
      "name": "Brian Vandenbussche",
      "pos": "gk",
      "title": "Brian",
      "title_es": "Brian"
    },
    {
      "name": "Petter Hansson",
      "pos": "def",
      "title": "Petter",
      "title_es": "Petter"
    },
    {
      "name": "Mika Väyrynen",
      "pos": "mid",
      "title": "Mika",
      "title_es": "Mika"
    },
    {
      "name": "Afonso Alves",
      "pos": "st",
      "title": "Afonso",
      "title_es": "Afonso"
    }
  ],
  "Groningen": [
    {
      "name": "Sergio Padt",
      "pos": "gk",
      "title": "Sergio",
      "title_es": "Sergio"
    },
    {
      "name": "Virgil van Dijk",
      "pos": "def",
      "title": "Virgil",
      "title_es": "Virgil"
    },
    {
      "name": "Arjen Robben",
      "pos": "mid",
      "title": "The Flying Dutchman",
      "title_es": "El Holandés Volador"
    },
    {
      "name": "Luis Suárez",
      "pos": "st",
      "title": "El Pistolero",
      "title_es": "El Pistolero"
    }
  ],
  "Willem II": [
    {
      "name": "Geert De Vlieger",
      "pos": "gk",
      "title": "Geert",
      "title_es": "Geert"
    },
    {
      "name": "Joris Mathijsen",
      "pos": "def",
      "title": "Joris",
      "title_es": "Joris"
    },
    {
      "name": "Frenkie de Jong",
      "pos": "mid",
      "title": "Frenkie",
      "title_es": "Frenkie"
    },
    {
      "name": "Fran Sol",
      "pos": "st",
      "title": "Fran",
      "title_es": "Fran"
    }
  ],
  "Heracles": [
    {
      "name": "Brian van Loo",
      "pos": "gk",
      "title": "Brian",
      "title_es": "Brian"
    },
    {
      "name": "Antoine van der Linden",
      "pos": "def",
      "title": "Antoine",
      "title_es": "Antoine"
    },
    {
      "name": "Thomas Bruns",
      "pos": "mid",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Everton",
      "pos": "st",
      "title": "Everton",
      "title_es": "Everton"
    }
  ],
  "NAC Breda": [
    {
      "name": "Jelle ten Rouwelaar",
      "pos": "gk",
      "title": "Jelle",
      "title_es": "Jelle"
    },
    {
      "name": "Rob Penders",
      "pos": "def",
      "title": "Rob",
      "title_es": "Rob"
    },
    {
      "name": "Nemanja Gudelj",
      "pos": "mid",
      "title": "Nemanja",
      "title_es": "Nemanja"
    },
    {
      "name": "Pierre van Hooijdonk",
      "pos": "st",
      "title": "Pi-Air",
      "title_es": "Pi-Air"
    }
  ],
  "Fortuna Sittard": [
    {
      "name": "Ruud Hesp",
      "pos": "gk",
      "title": "Ruud",
      "title_es": "Ruud"
    },
    {
      "name": "Kevin Hofland",
      "pos": "def",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "Mark van Bommel",
      "pos": "mid",
      "title": "Mark",
      "title_es": "Mark"
    },
    {
      "name": "Burak Yılmaz",
      "pos": "st",
      "title": "Kral",
      "title_es": "Kral"
    }
  ],
  "Zwolle": [
    {
      "name": "Diederik Boer",
      "pos": "gk",
      "title": "Diederik",
      "title_es": "Diederik"
    },
    {
      "name": "Bram van Polen",
      "pos": "def",
      "title": "Bram",
      "title_es": "Bram"
    },
    {
      "name": "Jesper Drost",
      "pos": "mid",
      "title": "Jesper",
      "title_es": "Jesper"
    },
    {
      "name": "Stefan Nijland",
      "pos": "st",
      "title": "Stefan",
      "title_es": "Stefan"
    }
  ],
  "Volendam": [
    {
      "name": "Edwin Zoetebier",
      "pos": "gk",
      "title": "Edwin",
      "title_es": "Edwin"
    },
    {
      "name": "Keje Molenaar",
      "pos": "def",
      "title": "Keje",
      "title_es": "Keje"
    },
    {
      "name": "Wim Jonk",
      "pos": "mid",
      "title": "Wim",
      "title_es": "Wim"
    },
    {
      "name": "Jack Tuyp",
      "pos": "st",
      "title": "Jack",
      "title_es": "Jack"
    }
  ],
  "Telstar": [
    {
      "name": "Heinz Stuy",
      "pos": "gk",
      "title": "Heinz",
      "title_es": "Heinz"
    },
    {
      "name": "Louis van Gaal",
      "pos": "def",
      "title": "Louis",
      "title_es": "Louis"
    },
    {
      "name": "Jerdy Schouten",
      "pos": "mid",
      "title": "Jerdy",
      "title_es": "Jerdy"
    },
    {
      "name": "Glynor Plet",
      "pos": "st",
      "title": "Glynor",
      "title_es": "Glynor"
    }
  ],
  "Club Brugge": [
    {
      "name": "Dany Verlinden",
      "pos": "gk",
      "title": "The Wall",
      "title_es": "El Muro"
    },
    {
      "name": "Timmy Simons",
      "pos": "def",
      "title": "Timmy",
      "title_es": "Timmy"
    },
    {
      "name": "Ruud Vormer",
      "pos": "mid",
      "title": "Ruud",
      "title_es": "Ruud"
    },
    {
      "name": "Gert Verheyen",
      "pos": "st",
      "title": "Gert",
      "title_es": "Gert"
    }
  ],
  "Union Saint-Gilloise": [
    {
      "name": "Anthony Moris",
      "pos": "gk",
      "title": "Anthony",
      "title_es": "Anthony"
    },
    {
      "name": "Christian Burgess",
      "pos": "def",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Teddy Teuma",
      "pos": "mid",
      "title": "Teddy",
      "title_es": "Teddy"
    },
    {
      "name": "Dante Vanzeir",
      "pos": "st",
      "title": "Dante",
      "title_es": "Dante"
    }
  ],
  "Anderlecht": [
    {
      "name": "Filip De Wilde",
      "pos": "gk",
      "title": "Filip",
      "title_es": "Filip"
    },
    {
      "name": "Vincent Kompany",
      "pos": "def",
      "title": "Vince the Prince",
      "title_es": "Vince el Príncipe"
    },
    {
      "name": "Enzo Scifo",
      "pos": "mid",
      "title": "Enzo",
      "title_es": "Enzo"
    },
    {
      "name": "Romelu Lukaku",
      "pos": "st",
      "title": "Big Rom",
      "title_es": "Big Rom"
    }
  ],
  "Genk": [
    {
      "name": "Thibaut Courtois",
      "pos": "gk",
      "title": "The Wall",
      "title_es": "El Muro"
    },
    {
      "name": "Kalidou Koulibaly",
      "pos": "def",
      "title": "K2",
      "title_es": "K2"
    },
    {
      "name": "Kevin De Bruyne",
      "pos": "mid",
      "title": "KDB",
      "title_es": "KDB"
    },
    {
      "name": "Wesley Sonck",
      "pos": "st",
      "title": "Wesley",
      "title_es": "Wesley"
    }
  ],
  "Gent": [
    {
      "name": "Matz Sels",
      "pos": "gk",
      "title": "Matz",
      "title_es": "Matz"
    },
    {
      "name": "Nana Asare",
      "pos": "def",
      "title": "Nana",
      "title_es": "Nana"
    },
    {
      "name": "Sven Kums",
      "pos": "mid",
      "title": "Sven",
      "title_es": "Sven"
    },
    {
      "name": "Laurent Depoitre",
      "pos": "st",
      "title": "Lolo",
      "title_es": "Lolo"
    }
  ],
  "Antwerp": [
    {
      "name": "Jean-Marie Pfaff",
      "pos": "gk",
      "title": "El Sympatico",
      "title_es": "El Sympatico"
    },
    {
      "name": "Toby Alderweireld",
      "pos": "def",
      "title": "Toby",
      "title_es": "Toby"
    },
    {
      "name": "Radja Nainggolan",
      "pos": "mid",
      "title": "Ninja",
      "title_es": "Ninja"
    },
    {
      "name": "Dieumerci Mbokani",
      "pos": "st",
      "title": "Dieumerci",
      "title_es": "Dieumerci"
    }
  ],
  "Standard Liège": [
    {
      "name": "Michel Preud'homme",
      "pos": "gk",
      "title": "Saint Michel",
      "title_es": "San Michel"
    },
    {
      "name": "Eric Gerets",
      "pos": "def",
      "title": "The Lion of Flanders",
      "title_es": "El León de Flandes"
    },
    {
      "name": "Axel Witsel",
      "pos": "mid",
      "title": "Axel",
      "title_es": "Axel"
    },
    {
      "name": "Milan Jovanović",
      "pos": "st",
      "title": "The Snake",
      "title_es": "La Serpiente"
    }
  ],
  "Charleroi": [
    {
      "name": "Nicolas Penneteau",
      "pos": "gk",
      "title": "Nico",
      "title_es": "Nico"
    },
    {
      "name": "Dorian Dessoleil",
      "pos": "def",
      "title": "Dorian",
      "title_es": "Dorian"
    },
    {
      "name": "Ryota Morioka",
      "pos": "mid",
      "title": "Ryota",
      "title_es": "Ryota"
    },
    {
      "name": "Kaveh Rezaei",
      "pos": "st",
      "title": "Kaveh",
      "title_es": "Kaveh"
    }
  ],
  "Mechelen": [
    {
      "name": "Jean-François Gillet",
      "pos": "gk",
      "title": "Jean-François",
      "title_es": "Jean-François"
    },
    {
      "name": "Seth De Witte",
      "pos": "def",
      "title": "Seth",
      "title_es": "Seth"
    },
    {
      "name": "Steven Defour",
      "pos": "mid",
      "title": "Steven",
      "title_es": "Steven"
    },
    {
      "name": "Marc Wilmots",
      "pos": "st",
      "title": "The Bull of Dongelberg",
      "title_es": "El Toro de Dongelberg"
    }
  ],
  "Cercle Brugge": [
    {
      "name": "Miguel Van Damme",
      "pos": "gk",
      "title": "Miguel",
      "title_es": "Miguel"
    },
    {
      "name": "Denis Viane",
      "pos": "def",
      "title": "Denis",
      "title_es": "Denis"
    },
    {
      "name": "Thomas Buffel",
      "pos": "mid",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Ayase Ueda",
      "pos": "st",
      "title": "Ayase",
      "title_es": "Ayase"
    }
  ],
  "OH Leuven": [
    {
      "name": "Logan Bailly",
      "pos": "gk",
      "title": "Logan",
      "title_es": "Logan"
    },
    {
      "name": "Pierre-Yves Ngawa",
      "pos": "def",
      "title": "Pierre",
      "title_es": "Pierre"
    },
    {
      "name": "Mathieu Maertens",
      "pos": "mid",
      "title": "Mathieu",
      "title_es": "Mathieu"
    },
    {
      "name": "Thomas Henry",
      "pos": "st",
      "title": "Thomas",
      "title_es": "Thomas"
    }
  ],
  "Sint-Truiden": [
    {
      "name": "Simon Mignolet",
      "pos": "gk",
      "title": "Simon",
      "title_es": "Simon"
    },
    {
      "name": "Daiki Hashioka",
      "pos": "def",
      "title": "Daiki",
      "title_es": "Daiki"
    },
    {
      "name": "Rob Schoofs",
      "pos": "mid",
      "title": "Rob",
      "title_es": "Rob"
    },
    {
      "name": "Yuma Suzuki",
      "pos": "st",
      "title": "Yuma",
      "title_es": "Yuma"
    }
  ],
  "Westerlo": [
    {
      "name": "Sinan Bolat",
      "pos": "gk",
      "title": "Sinan",
      "title_es": "Sinan"
    },
    {
      "name": "Jef Delen",
      "pos": "def",
      "title": "Jef",
      "title_es": "Jef"
    },
    {
      "name": "Lukas Van Eenoo",
      "pos": "mid",
      "title": "Lukas",
      "title_es": "Lukas"
    },
    {
      "name": "Nacer Chadli",
      "pos": "st",
      "title": "Nacer",
      "title_es": "Nacer"
    }
  ],
  "Zulte Waregem": [
    {
      "name": "Sammy Bossut",
      "pos": "gk",
      "title": "Sammy",
      "title_es": "Sammy"
    },
    {
      "name": "Olivier Deschacht",
      "pos": "def",
      "title": "Olivier",
      "title_es": "Olivier"
    },
    {
      "name": "Franck Berrier",
      "pos": "mid",
      "title": "Franck",
      "title_es": "Franck"
    },
    {
      "name": "Mbaye Leye",
      "pos": "st",
      "title": "Mbaye",
      "title_es": "Mbaye"
    }
  ],
  "Dender": [
    {
      "name": "Michaël Cordier",
      "pos": "gk",
      "title": "Michaël",
      "title_es": "Michaël"
    },
    {
      "name": "Filip Daems",
      "pos": "def",
      "title": "Filip",
      "title_es": "Filip"
    },
    {
      "name": "Steven De Petter",
      "pos": "mid",
      "title": "Steven",
      "title_es": "Steven"
    },
    {
      "name": "Henri Munyaneza",
      "pos": "st",
      "title": "Henri",
      "title_es": "Henri"
    }
  ],
  "Inter": [
    {
      "name": "Walter Zenga",
      "pos": "gk",
      "title": "Spider",
      "title_es": "El Hombre Araña"
    },
    {
      "name": "Javier Zanetti",
      "pos": "def",
      "title": "Il Capitano",
      "title_es": "Il Capitano"
    },
    {
      "name": "Lothar Matthäus",
      "pos": "mid",
      "title": "Lothar",
      "title_es": "Lothar"
    },
    {
      "name": "Ronaldo",
      "pos": "st",
      "title": "Il Fenomeno",
      "title_es": "El Fenómeno"
    }
  ],
  "Napoli": [
    {
      "name": "Dino Zoff",
      "pos": "gk",
      "title": "Dino",
      "title_es": "Dino"
    },
    {
      "name": "Ciro Ferrara",
      "pos": "def",
      "title": "Ciro",
      "title_es": "Ciro"
    },
    {
      "name": "Diego Maradona",
      "pos": "mid",
      "title": "El Pibe de Oro",
      "title_es": "El Pibe de Oro"
    },
    {
      "name": "Dries Mertens",
      "pos": "st",
      "title": "Ciro",
      "title_es": "Ciro"
    }
  ],
  "Juventus": [
    {
      "name": "Gianluigi Buffon",
      "pos": "gk",
      "title": "Gigi",
      "title_es": "Gigi"
    },
    {
      "name": "Giorgio Chiellini",
      "pos": "def",
      "title": "King Kong",
      "title_es": "King Kong"
    },
    {
      "name": "Michel Platini",
      "pos": "mid",
      "title": "Le Roi",
      "title_es": "Le Roi"
    },
    {
      "name": "Alessandro Del Piero",
      "pos": "st",
      "title": "Pinturicchio",
      "title_es": "Pinturicchio"
    }
  ],
  "Milan": [
    {
      "name": "Dida",
      "pos": "gk",
      "title": "Dida",
      "title_es": "Dida"
    },
    {
      "name": "Paolo Maldini",
      "pos": "def",
      "title": "Il Capitano",
      "title_es": "Il Capitano"
    },
    {
      "name": "Ruud Gullit",
      "pos": "mid",
      "title": "The Black Tulip",
      "title_es": "El Tulipán Negro"
    },
    {
      "name": "Marco van Basten",
      "pos": "st",
      "title": "The Swan of Utrecht",
      "title_es": "El Cisne de Utrecht"
    }
  ],
  "Atalanta": [
    {
      "name": "Pierluigi Gollini",
      "pos": "gk",
      "title": "Gollo",
      "title_es": "Gollo"
    },
    {
      "name": "Rafael Tolói",
      "pos": "def",
      "title": "Tolói",
      "title_es": "Tolói"
    },
    {
      "name": "Alejandro Gómez",
      "pos": "mid",
      "title": "Papu",
      "title_es": "Papu"
    },
    {
      "name": "Duván Zapata",
      "pos": "st",
      "title": "Duván",
      "title_es": "Duván"
    }
  ],
  "Roma": [
    {
      "name": "Alisson",
      "pos": "gk",
      "title": "Alisson",
      "title_es": "Alisson"
    },
    {
      "name": "Aldair",
      "pos": "def",
      "title": "Pluto",
      "title_es": "Pluto"
    },
    {
      "name": "Francesco Totti",
      "pos": "mid",
      "title": "Il Capitano",
      "title_es": "Il Capitano"
    },
    {
      "name": "Gabriel Batistuta",
      "pos": "st",
      "title": "Batigol",
      "title_es": "Batigol"
    }
  ],
  "Lazio": [
    {
      "name": "Angelo Peruzzi",
      "pos": "gk",
      "title": "Tyson",
      "title_es": "Tyson"
    },
    {
      "name": "Alessandro Nesta",
      "pos": "def",
      "title": "Sandro",
      "title_es": "Sandro"
    },
    {
      "name": "Pavel Nedvěd",
      "pos": "mid",
      "title": "The Czech Fury",
      "title_es": "La Furia Checa"
    },
    {
      "name": "Ciro Immobile",
      "pos": "st",
      "title": "Ciro",
      "title_es": "Ciro"
    }
  ],
  "Fiorentina": [
    {
      "name": "Francesco Toldo",
      "pos": "gk",
      "title": "Toldo",
      "title_es": "Toldo"
    },
    {
      "name": "Daniel Passarella",
      "pos": "def",
      "title": "El Gran Capitán",
      "title_es": "El Gran Capitán"
    },
    {
      "name": "Giancarlo Antognoni",
      "pos": "mid",
      "title": "The Boy Looking at the Stars",
      "title_es": "El Chico Que Miraba a las Estrellas"
    },
    {
      "name": "Gabriel Batistuta",
      "pos": "st",
      "title": "Batigol",
      "title_es": "Batigol"
    }
  ],
  "Bologna": [
    {
      "name": "Gianluca Pagliuca",
      "pos": "gk",
      "title": "Pagliuca",
      "title_es": "Pagliuca"
    },
    {
      "name": "Tazio Roversi",
      "pos": "def",
      "title": "Tazio",
      "title_es": "Tazio"
    },
    {
      "name": "Giacomo Bulgarelli",
      "pos": "mid",
      "title": "Bulgarelli",
      "title_es": "Bulgarelli"
    },
    {
      "name": "Giuseppe Signori",
      "pos": "st",
      "title": "Beppe",
      "title_es": "Beppe"
    }
  ],
  "Torino": [
    {
      "name": "Valerio Bacigalupo",
      "pos": "gk",
      "title": "Bacigalupo",
      "title_es": "Bacigalupo"
    },
    {
      "name": "Giorgio Ferrini",
      "pos": "def",
      "title": "Capitano",
      "title_es": "Capitán"
    },
    {
      "name": "Valentino Mazzola",
      "pos": "mid",
      "title": "Valentino",
      "title_es": "Valentino"
    },
    {
      "name": "Paolo Pulici",
      "pos": "st",
      "title": "Puliciclone",
      "title_es": "Puliciclone"
    }
  ],
  "Como": [
    {
      "name": "Silvano Martina",
      "pos": "gk",
      "title": "Martina",
      "title_es": "Martina"
    },
    {
      "name": "Pietro Vierchowod",
      "pos": "def",
      "title": "The Tsar",
      "title_es": "El Zar"
    },
    {
      "name": "Gianfranco Matteoli",
      "pos": "mid",
      "title": "Matteoli",
      "title_es": "Matteoli"
    },
    {
      "name": "Stefano Borgonovo",
      "pos": "st",
      "title": "Borgonovo",
      "title_es": "Borgonovo"
    }
  ],
  "Udinese": [
    {
      "name": "Samir Handanović",
      "pos": "gk",
      "title": "Batman",
      "title_es": "Batman"
    },
    {
      "name": "Valerio Bertotto",
      "pos": "def",
      "title": "Bertotto",
      "title_es": "Bertotto"
    },
    {
      "name": "Zico",
      "pos": "mid",
      "title": "The White Pelé",
      "title_es": "El Pelé Blanco"
    },
    {
      "name": "Antonio Di Natale",
      "pos": "st",
      "title": "Totò",
      "title_es": "Totò"
    }
  ],
  "Genoa": [
    {
      "name": "Mattia Perin",
      "pos": "gk",
      "title": "Perin",
      "title_es": "Perin"
    },
    {
      "name": "Gianluca Signorini",
      "pos": "def",
      "title": "Il Capitano",
      "title_es": "Il Capitano"
    },
    {
      "name": "Stefano Eranio",
      "pos": "mid",
      "title": "Eranio",
      "title_es": "Eranio"
    },
    {
      "name": "Diego Milito",
      "pos": "st",
      "title": "The Prince",
      "title_es": "El Príncipe"
    }
  ],
  "Parma": [
    {
      "name": "Gianluigi Buffon",
      "pos": "gk",
      "title": "Gigi",
      "title_es": "Gigi"
    },
    {
      "name": "Lilian Thuram",
      "pos": "def",
      "title": "Thuram",
      "title_es": "Thuram"
    },
    {
      "name": "Juan Sebastián Verón",
      "pos": "mid",
      "title": "La Brujita",
      "title_es": "La Brujita"
    },
    {
      "name": "Hernán Crespo",
      "pos": "st",
      "title": "Valdanito",
      "title_es": "Valdanito"
    }
  ],
  "Empoli": [
    {
      "name": "Davide Bassi",
      "pos": "gk",
      "title": "Bassi",
      "title_es": "Bassi"
    },
    {
      "name": "Daniele Rugani",
      "pos": "def",
      "title": "Rugani",
      "title_es": "Rugani"
    },
    {
      "name": "Riccardo Saponara",
      "pos": "mid",
      "title": "Saponara",
      "title_es": "Saponara"
    },
    {
      "name": "Massimo Maccarone",
      "pos": "st",
      "title": "Big Mac",
      "title_es": "Big Mac"
    }
  ],
  "Sassuolo": [
    {
      "name": "Andrea Consigli",
      "pos": "gk",
      "title": "Consigli",
      "title_es": "Consigli"
    },
    {
      "name": "Francesco Acerbi",
      "pos": "def",
      "title": "Acerbi",
      "title_es": "Acerbi"
    },
    {
      "name": "Domenico Berardi",
      "pos": "mid",
      "title": "Mimmo",
      "title_es": "Mimmo"
    },
    {
      "name": "Francesco Caputo",
      "pos": "st",
      "title": "Ciccio",
      "title_es": "Ciccio"
    }
  ],
  "Cagliari": [
    {
      "name": "Enrico Albertosi",
      "pos": "gk",
      "title": "Albertosi",
      "title_es": "Albertosi"
    },
    {
      "name": "Pierluigi Cera",
      "pos": "def",
      "title": "Cera",
      "title_es": "Cera"
    },
    {
      "name": "Gianfranco Zola",
      "pos": "mid",
      "title": "Magic Box",
      "title_es": "Magic Box"
    },
    {
      "name": "Luigi Riva",
      "pos": "st",
      "title": "Rombo di Tuono",
      "title_es": "Rombo di Tuono"
    }
  ],
  "Verona": [
    {
      "name": "Claudio Garella",
      "pos": "gk",
      "title": "Garella",
      "title_es": "Garella"
    },
    {
      "name": "Roberto Tricella",
      "pos": "def",
      "title": "Tricella",
      "title_es": "Tricella"
    },
    {
      "name": "Hans-Peter Briegel",
      "pos": "mid",
      "title": "The Roller",
      "title_es": "La Apisonadora"
    },
    {
      "name": "Luca Toni",
      "pos": "st",
      "title": "Toni",
      "title_es": "Toni"
    }
  ],
  "Lecce": [
    {
      "name": "Wladimiro Falcone",
      "pos": "gk",
      "title": "Falcone",
      "title_es": "Falcone"
    },
    {
      "name": "Lorenzo Stovini",
      "pos": "def",
      "title": "Stovini",
      "title_es": "Stovini"
    },
    {
      "name": "Guillermo Giacomazzi",
      "pos": "mid",
      "title": "Giacomazzi",
      "title_es": "Giacomazzi"
    },
    {
      "name": "Ernesto Chevantón",
      "pos": "st",
      "title": "Cheva",
      "title_es": "Cheva"
    }
  ],
  "Pisa": [
    {
      "name": "Alessandro Mannini",
      "pos": "gk",
      "title": "Mannini",
      "title_es": "Mannini"
    },
    {
      "name": "Henrik Larsen",
      "pos": "def",
      "title": "Larsen",
      "title_es": "Larsen"
    },
    {
      "name": "Dunga",
      "pos": "mid",
      "title": "Dunga",
      "title_es": "Dunga"
    },
    {
      "name": "Wim Kieft",
      "pos": "st",
      "title": "Kieft",
      "title_es": "Kieft"
    }
  ],
  "Cremonese": [
    {
      "name": "Michelangelo Rampulla",
      "pos": "gk",
      "title": "Rampulla",
      "title_es": "Rampulla"
    },
    {
      "name": "Corrado Verdelli",
      "pos": "def",
      "title": "Verdelli",
      "title_es": "Verdelli"
    },
    {
      "name": "Attilio Lombardo",
      "pos": "mid",
      "title": "The Bald Eagle",
      "title_es": "El Águila Calva"
    },
    {
      "name": "Gianluca Vialli",
      "pos": "st",
      "title": "Vialli",
      "title_es": "Vialli"
    }
  ],
  "Bayern Munich": [
    {
      "name": "Oliver Kahn",
      "pos": "gk",
      "title": "Der Titan",
      "title_es": "El Titán"
    },
    {
      "name": "Franz Beckenbauer",
      "pos": "def",
      "title": "Der Kaiser",
      "title_es": "El Káiser"
    },
    {
      "name": "Lothar Matthäus",
      "pos": "mid",
      "title": "Lothar",
      "title_es": "Lothar"
    },
    {
      "name": "Gerd Müller",
      "pos": "st",
      "title": "Der Bomber",
      "title_es": "El Bombardero"
    }
  ],
  "Bayer Leverkusen": [
    {
      "name": "Rüdiger Vollborn",
      "pos": "gk",
      "title": "Rüdiger",
      "title_es": "Rüdiger"
    },
    {
      "name": "Jens Nowotny",
      "pos": "def",
      "title": "Jens",
      "title_es": "Jens"
    },
    {
      "name": "Michael Ballack",
      "pos": "mid",
      "title": "Capitano",
      "title_es": "Capitano"
    },
    {
      "name": "Ulf Kirsten",
      "pos": "st",
      "title": "Der Schwatte",
      "title_es": "El Negro"
    }
  ],
  "Borussia Dortmund": [
    {
      "name": "Roman Weidenfeller",
      "pos": "gk",
      "title": "Roman",
      "title_es": "Roman"
    },
    {
      "name": "Mats Hummels",
      "pos": "def",
      "title": "Mats",
      "title_es": "Mats"
    },
    {
      "name": "Marco Reus",
      "pos": "mid",
      "title": "Woodyinho",
      "title_es": "Woodyinho"
    },
    {
      "name": "Robert Lewandowski",
      "pos": "st",
      "title": "Lewy",
      "title_es": "Lewy"
    }
  ],
  "RB Leipzig": [
    {
      "name": "Péter Gulácsi",
      "pos": "gk",
      "title": "Pete",
      "title_es": "Pete"
    },
    {
      "name": "Dayot Upamecano",
      "pos": "def",
      "title": "Upa",
      "title_es": "Upa"
    },
    {
      "name": "Emil Forsberg",
      "pos": "mid",
      "title": "Emil",
      "title_es": "Emil"
    },
    {
      "name": "Timo Werner",
      "pos": "st",
      "title": "Turbo Timo",
      "title_es": "Turbo Timo"
    }
  ],
  "Stuttgart": [
    {
      "name": "Timo Hildebrand",
      "pos": "gk",
      "title": "Timo",
      "title_es": "Timo"
    },
    {
      "name": "Karlheinz Förster",
      "pos": "def",
      "title": "Förster",
      "title_es": "Förster"
    },
    {
      "name": "Krassimir Balakov",
      "pos": "mid",
      "title": "Bala",
      "title_es": "Bala"
    },
    {
      "name": "Mario Gómez",
      "pos": "st",
      "title": "Super Mario",
      "title_es": "Súper Mario"
    }
  ],
  "Eintracht Frankfurt": [
    {
      "name": "Kevin Trapp",
      "pos": "gk",
      "title": "Trapp",
      "title_es": "Trapp"
    },
    {
      "name": "Karl-Heinz Körbel",
      "pos": "def",
      "title": "Charly",
      "title_es": "Charly"
    },
    {
      "name": "Bernd Hölzenbein",
      "pos": "mid",
      "title": "Bernd",
      "title_es": "Bernd"
    },
    {
      "name": "Anthony Yeboah",
      "pos": "st",
      "title": "Tony",
      "title_es": "Tony"
    }
  ],
  "Wolfsburg": [
    {
      "name": "Diego Benaglio",
      "pos": "gk",
      "title": "Diego",
      "title_es": "Diego"
    },
    {
      "name": "Marcel Schäfer",
      "pos": "def",
      "title": "Schäfer",
      "title_es": "Schäfer"
    },
    {
      "name": "Kevin De Bruyne",
      "pos": "mid",
      "title": "KDB",
      "title_es": "KDB"
    },
    {
      "name": "Edin Džeko",
      "pos": "st",
      "title": "The Bosnian Diamond",
      "title_es": "El Diamante Bosnio"
    }
  ],
  "Gladbach": [
    {
      "name": "Marc-André ter Stegen",
      "pos": "gk",
      "title": "Marc",
      "title_es": "Marc"
    },
    {
      "name": "Berti Vogts",
      "pos": "def",
      "title": "Der Terrier",
      "title_es": "El Terrier"
    },
    {
      "name": "Günter Netzer",
      "pos": "mid",
      "title": "Günter",
      "title_es": "Günter"
    },
    {
      "name": "Jupp Heynckes",
      "pos": "st",
      "title": "Don Jupp",
      "title_es": "Don Jupp"
    }
  ],
  "Freiburg": [
    {
      "name": "Richard Golz",
      "pos": "gk",
      "title": "Golz",
      "title_es": "Golz"
    },
    {
      "name": "Christian Günter",
      "pos": "def",
      "title": "Captain Günter",
      "title_es": "Capitán Günter"
    },
    {
      "name": "Vincenzo Grifo",
      "pos": "mid",
      "title": "Grifo",
      "title_es": "Grifo"
    },
    {
      "name": "Nils Petersen",
      "pos": "st",
      "title": "Der Joker",
      "title_es": "El Joker"
    }
  ],
  "Hoffenheim": [
    {
      "name": "Oliver Baumann",
      "pos": "gk",
      "title": "Baumann",
      "title_es": "Baumann"
    },
    {
      "name": "Andreas Beck",
      "pos": "def",
      "title": "Beck",
      "title_es": "Beck"
    },
    {
      "name": "Sejad Salihović",
      "pos": "mid",
      "title": "Salihović",
      "title_es": "Salihović"
    },
    {
      "name": "Andrej Kramarić",
      "pos": "st",
      "title": "Kramarić",
      "title_es": "Kramarić"
    }
  ],
  "Mainz": [
    {
      "name": "Dimo Wache",
      "pos": "gk",
      "title": "Wache",
      "title_es": "Wache"
    },
    {
      "name": "Nikolče Noveski",
      "pos": "def",
      "title": "Noveski",
      "title_es": "Noveski"
    },
    {
      "name": "Andreas Ivanschitz",
      "pos": "mid",
      "title": "Ivanschitz",
      "title_es": "Ivanschitz"
    },
    {
      "name": "Shinji Okazaki",
      "pos": "st",
      "title": "Okazaki",
      "title_es": "Okazaki"
    }
  ],
  "Union Berlin": [
    {
      "name": "Rafał Gikiewicz",
      "pos": "gk",
      "title": "Giki",
      "title_es": "Giki"
    },
    {
      "name": "Christopher Trimmel",
      "pos": "def",
      "title": "Trimmi",
      "title_es": "Trimmi"
    },
    {
      "name": "Max Kruse",
      "pos": "mid",
      "title": "Kruse",
      "title_es": "Kruse"
    },
    {
      "name": "Taiwo Awoniyi",
      "pos": "st",
      "title": "Taiwo",
      "title_es": "Taiwo"
    }
  ],
  "Werder Bremen": [
    {
      "name": "Tim Wiese",
      "pos": "gk",
      "title": "Wiese",
      "title_es": "Wiese"
    },
    {
      "name": "Per Mertesacker",
      "pos": "def",
      "title": "Big Fucking German",
      "title_es": "BFG"
    },
    {
      "name": "Johan Micoud",
      "pos": "mid",
      "title": "Le Chef",
      "title_es": "Le Chef"
    },
    {
      "name": "Claudio Pizarro",
      "pos": "st",
      "title": "El Bombardero de los Andes",
      "title_es": "El Bombardero"
    }
  ],
  "Augsburg": [
    {
      "name": "Marwin Hitz",
      "pos": "gk",
      "title": "Hitz",
      "title_es": "Hitz"
    },
    {
      "name": "Jeffrey Gouweleeuw",
      "pos": "def",
      "title": "Gouweleeuw",
      "title_es": "Gouweleeuw"
    },
    {
      "name": "Daniel Baier",
      "pos": "mid",
      "title": "Baier",
      "title_es": "Baier"
    },
    {
      "name": "Raúl Bobadilla",
      "pos": "st",
      "title": "Bobadilla",
      "title_es": "Bobadilla"
    }
  ],
  "Köln": [
    {
      "name": "Harald Schumacher",
      "pos": "gk",
      "title": "Toni",
      "title_es": "Toni"
    },
    {
      "name": "Jonas Hector",
      "pos": "def",
      "title": "Hector",
      "title_es": "Hector"
    },
    {
      "name": "Wolfgang Overath",
      "pos": "mid",
      "title": "Overath",
      "title_es": "Overath"
    },
    {
      "name": "Lukas Podolski",
      "pos": "st",
      "title": "Poldi",
      "title_es": "Poldi"
    }
  ],
  "Hamburg": [
    {
      "name": "Uli Stein",
      "pos": "gk",
      "title": "Uli",
      "title_es": "Uli"
    },
    {
      "name": "Manfred Kaltz",
      "pos": "def",
      "title": "Manni",
      "title_es": "Manni"
    },
    {
      "name": "Felix Magath",
      "pos": "mid",
      "title": "Magath",
      "title_es": "Magath"
    },
    {
      "name": "Uwe Seeler",
      "pos": "st",
      "title": "Uns Uwe",
      "title_es": "Uns Uwe"
    }
  ],
  "Heidenheim": [
    {
      "name": "Kevin Müller",
      "pos": "gk",
      "title": "Müller",
      "title_es": "Müller"
    },
    {
      "name": "Patrick Mainka",
      "pos": "def",
      "title": "Mainka",
      "title_es": "Mainka"
    },
    {
      "name": "Marc Schnatterer",
      "pos": "mid",
      "title": "Schnatti",
      "title_es": "Schnatti"
    },
    {
      "name": "Tim Kleindienst",
      "pos": "st",
      "title": "Kleindienst",
      "title_es": "Kleindienst"
    }
  ],
  "St. Pauli": [
    {
      "name": "Philipp Tschauner",
      "pos": "gk",
      "title": "Tschauni",
      "title_es": "Tschauni"
    },
    {
      "name": "Marcel Halstenberg",
      "pos": "def",
      "title": "Halste",
      "title_es": "Halste"
    },
    {
      "name": "Fabian Boll",
      "pos": "mid",
      "title": "Boller",
      "title_es": "Boller"
    },
    {
      "name": "Marius Ebbers",
      "pos": "st",
      "title": "Ebbe",
      "title_es": "Ebbe"
    }
  ],
  "Dinamo Zagreb": [
    {
      "name": "Dražen Ladić",
      "pos": "gk",
      "title": "Ladić",
      "title_es": "Ladić"
    },
    {
      "name": "Velimir Zajec",
      "pos": "def",
      "title": "Zeko",
      "title_es": "Zeko"
    },
    {
      "name": "Zvonimir Boban",
      "pos": "mid",
      "title": "Zvone",
      "title_es": "Zvone"
    },
    {
      "name": "Davor Šuker",
      "pos": "st",
      "title": "Šukerman",
      "title_es": "Šukerman"
    }
  ],
  "Hajduk Split": [
    {
      "name": "Vladimir Beara",
      "pos": "gk",
      "title": "Great Vladimir",
      "title_es": "El Gran Vladimir"
    },
    {
      "name": "Ivan Buljan",
      "pos": "def",
      "title": "Ike",
      "title_es": "Ike"
    },
    {
      "name": "Aljoša Asanović",
      "pos": "mid",
      "title": "Vatreni Lakat",
      "title_es": "Vatreni Lakat"
    },
    {
      "name": "Frane Matošić",
      "pos": "st",
      "title": "Frane",
      "title_es": "Frane"
    }
  ],
  "Rijeka": [
    {
      "name": "Andrej Prskalo",
      "pos": "gk",
      "title": "Prskalo",
      "title_es": "Prskalo"
    },
    {
      "name": "Srećko Juričić",
      "pos": "def",
      "title": "Srećko",
      "title_es": "Srećko"
    },
    {
      "name": "Damir Desnica",
      "pos": "mid",
      "title": "Damir",
      "title_es": "Damir"
    },
    {
      "name": "Milan Radović",
      "pos": "st",
      "title": "Milan",
      "title_es": "Milan"
    }
  ],
  "Osijek": [
    {
      "name": "Miroslav Žitnjak",
      "pos": "gk",
      "title": "Miroslav",
      "title_es": "Miroslav"
    },
    {
      "name": "Domagoj Vida",
      "pos": "def",
      "title": "Vida",
      "title_es": "Vida"
    },
    {
      "name": "Nenad Bjelica",
      "pos": "mid",
      "title": "Nenad",
      "title_es": "Nenad"
    },
    {
      "name": "Petar Krpan",
      "pos": "st",
      "title": "Petar",
      "title_es": "Petar"
    }
  ],
  "Lokomotiva Zagreb": [
    {
      "name": "Ivo Grbić",
      "pos": "gk",
      "title": "Ivo",
      "title_es": "Ivo"
    },
    {
      "name": "Denis Kolinger",
      "pos": "def",
      "title": "Denis",
      "title_es": "Denis"
    },
    {
      "name": "Lovro Majer",
      "pos": "mid",
      "title": "Lovro",
      "title_es": "Lovro"
    },
    {
      "name": "Lirim Kastrati",
      "pos": "st",
      "title": "Lirim",
      "title_es": "Lirim"
    }
  ],
  "Varaždin": [
    {
      "name": "Oliver Zelenika",
      "pos": "gk",
      "title": "Oliver",
      "title_es": "Oliver"
    },
    {
      "name": "Igor Prahić",
      "pos": "def",
      "title": "Igor",
      "title_es": "Igor"
    },
    {
      "name": "Miljenko Mumlek",
      "pos": "mid",
      "title": "Miljenko",
      "title_es": "Miljenko"
    },
    {
      "name": "Leon Benko",
      "pos": "st",
      "title": "Leon",
      "title_es": "Leon"
    }
  ],
  "Slaven Belupo": [
    {
      "name": "Silvio Rodić",
      "pos": "gk",
      "title": "Silvio",
      "title_es": "Silvio"
    },
    {
      "name": "Mario Burić",
      "pos": "def",
      "title": "Mario",
      "title_es": "Mario"
    },
    {
      "name": "Mateas Delić",
      "pos": "mid",
      "title": "Mateas",
      "title_es": "Mateas"
    },
    {
      "name": "Marijo Dodik",
      "pos": "st",
      "title": "Marijo",
      "title_es": "Marijo"
    }
  ],
  "Istra 1961": [
    {
      "name": "Vanja Iveša",
      "pos": "gk",
      "title": "Vanja",
      "title_es": "Vanja"
    },
    {
      "name": "Fausto Budicin",
      "pos": "def",
      "title": "Fausto",
      "title_es": "Fausto"
    },
    {
      "name": "Siniša Linić",
      "pos": "mid",
      "title": "Siniša",
      "title_es": "Siniša"
    },
    {
      "name": "Asim Šehić",
      "pos": "st",
      "title": "Asim",
      "title_es": "Asim"
    }
  ],
  "Gorica": [
    {
      "name": "Kristijan Kahlina",
      "pos": "gk",
      "title": "Kristijan",
      "title_es": "Kristijan"
    },
    {
      "name": "Aleksandar Jovičić",
      "pos": "def",
      "title": "Aleksandar",
      "title_es": "Aleksandar"
    },
    {
      "name": "Kristijan Lovrić",
      "pos": "mid",
      "title": "Lovrić",
      "title_es": "Lovrić"
    },
    {
      "name": "Łukasz Zwoliński",
      "pos": "st",
      "title": "Łukasz",
      "title_es": "Łukasz"
    }
  ],
  "Vukovar 91": [
    {
      "name": "Vlado Bilić",
      "pos": "gk",
      "title": "Vlado",
      "title_es": "Vlado"
    },
    {
      "name": "Stipe Bošnjak",
      "pos": "def",
      "title": "Stipe",
      "title_es": "Stipe"
    },
    {
      "name": "Mario Lučić",
      "pos": "mid",
      "title": "Mario",
      "title_es": "Mario"
    },
    {
      "name": "Ivan Bošnjak",
      "pos": "st",
      "title": "Ivan",
      "title_es": "Ivan"
    }
  ],
  "Wydad": [
    {
      "name": "Nadir Lamyaghri",
      "pos": "gk",
      "title": "Nadir",
      "title_es": "Nadir"
    },
    {
      "name": "Noureddine Naybet",
      "pos": "def",
      "title": "Naybet",
      "title_es": "Naybet"
    },
    {
      "name": "Aziz Bouderbala",
      "pos": "mid",
      "title": "Aziz",
      "title_es": "Aziz"
    },
    {
      "name": "Ayoub El Kaabi",
      "pos": "st",
      "title": "Ayoub",
      "title_es": "Ayoub"
    }
  ],
  "Raja": [
    {
      "name": "Anas Zniti",
      "pos": "gk",
      "title": "Zniti",
      "title_es": "Zniti"
    },
    {
      "name": "Amin Erbati",
      "pos": "def",
      "title": "Amin",
      "title_es": "Amin"
    },
    {
      "name": "Mustapha Moustawdaa",
      "pos": "mid",
      "title": "Mustapha",
      "title_es": "Mustapha"
    },
    {
      "name": "Salaheddine Bassir",
      "pos": "st",
      "title": "Bassir",
      "title_es": "Bassir"
    }
  ],
  "RS Berkane": [
    {
      "name": "Zouhair Laaroubi",
      "pos": "gk",
      "title": "Zouhair",
      "title_es": "Zouhair"
    },
    {
      "name": "Issoufou Dayo",
      "pos": "def",
      "title": "Dayo",
      "title_es": "Dayo"
    },
    {
      "name": "Omar Namsaoui",
      "pos": "mid",
      "title": "Omar",
      "title_es": "Omar"
    },
    {
      "name": "Fo-Doh Laba",
      "pos": "st",
      "title": "Laba",
      "title_es": "Laba"
    }
  ],
  "FUS Rabat": [
    {
      "name": "Aymane Majid",
      "pos": "gk",
      "title": "Aymane",
      "title_es": "Aymane"
    },
    {
      "name": "Nayef Aguerd",
      "pos": "def",
      "title": "Nayef",
      "title_es": "Nayef"
    },
    {
      "name": "Mourad Batna",
      "pos": "mid",
      "title": "Mourad",
      "title_es": "Mourad"
    },
    {
      "name": "Abdeslam Benjelloun",
      "pos": "st",
      "title": "Abdeslam",
      "title_es": "Abdeslam"
    }
  ],
  "FAR Rabat": [
    {
      "name": "Driss Benzekri",
      "pos": "gk",
      "title": "Driss",
      "title_es": "Driss"
    },
    {
      "name": "Abderrahim Taleb",
      "pos": "def",
      "title": "Taleb",
      "title_es": "Taleb"
    },
    {
      "name": "Mohamed Timoumi",
      "pos": "mid",
      "title": "Timoumi",
      "title_es": "Timoumi"
    },
    {
      "name": "Abdelsalam Laghrissi",
      "pos": "st",
      "title": "Laghrissi",
      "title_es": "Laghrissi"
    }
  ],
  "Maghreb Fès": [
    {
      "name": "Anas Zniti",
      "pos": "gk",
      "title": "Zniti",
      "title_es": "Zniti"
    },
    {
      "name": "Samir Zekroumi",
      "pos": "def",
      "title": "Samir",
      "title_es": "Samir"
    },
    {
      "name": "Tarik Sektioui",
      "pos": "mid",
      "title": "Tarik",
      "title_es": "Tarik"
    },
    {
      "name": "Hamza Abourazzouk",
      "pos": "st",
      "title": "Hamza",
      "title_es": "Hamza"
    }
  ],
  "Ittihad Tanger": [
    {
      "name": "Ahmed Mohamadina",
      "pos": "gk",
      "title": "Ahmed",
      "title_es": "Ahmed"
    },
    {
      "name": "Oussama Gharib",
      "pos": "def",
      "title": "Oussama",
      "title_es": "Oussama"
    },
    {
      "name": "Enam Mendamo",
      "pos": "mid",
      "title": "Enam",
      "title_es": "Enam"
    },
    {
      "name": "Axel Meye",
      "pos": "st",
      "title": "Axel",
      "title_es": "Axel"
    }
  ],
  "OC Safi": [
    {
      "name": "Majid Mokhtar",
      "pos": "gk",
      "title": "Majid",
      "title_es": "Majid"
    },
    {
      "name": "Saad Ait Khorsa",
      "pos": "def",
      "title": "Saad",
      "title_es": "Saad"
    },
    {
      "name": "Brahim El Bahri",
      "pos": "mid",
      "title": "Brahim",
      "title_es": "Brahim"
    },
    {
      "name": "Abderrazak Hamdallah",
      "pos": "st",
      "title": "Abderrazak",
      "title_es": "Abderrazak"
    }
  ],
  "Difaâ El Jadida": [
    {
      "name": "Yahia Filali",
      "pos": "gk",
      "title": "Yahia",
      "title_es": "Yahia"
    },
    {
      "name": "Youssef Aguerdoum",
      "pos": "def",
      "title": "Youssef",
      "title_es": "Youssef"
    },
    {
      "name": "Ayoub Nanah",
      "pos": "mid",
      "title": "Ayoub",
      "title_es": "Ayoub"
    },
    {
      "name": "Walid Azaro",
      "pos": "st",
      "title": "Walid",
      "title_es": "Walid"
    }
  ],
  "Hassania Agadir": [
    {
      "name": "Fahd El Ahmadi",
      "pos": "gk",
      "title": "Fahd",
      "title_es": "Fahd"
    },
    {
      "name": "Yassine Rami",
      "pos": "def",
      "title": "Yassine",
      "title_es": "Yassine"
    },
    {
      "name": "Jalal Daoudi",
      "pos": "mid",
      "title": "Jalal",
      "title_es": "Jalal"
    },
    {
      "name": "Karim El Berkaoui",
      "pos": "st",
      "title": "Karim",
      "title_es": "Karim"
    }
  ],
  "Moghreb Tétouan": [
    {
      "name": "Mohamed El Youssfi",
      "pos": "gk",
      "title": "Mohamed",
      "title_es": "Mohamed"
    },
    {
      "name": "Mohamed Abarhoun",
      "pos": "def",
      "title": "Mohamed",
      "title_es": "Mohamed"
    },
    {
      "name": "Zaid Krouch",
      "pos": "mid",
      "title": "Zaid",
      "title_es": "Zaid"
    },
    {
      "name": "Zouhair Naïm",
      "pos": "st",
      "title": "Zouhair",
      "title_es": "Zouhair"
    }
  ],
  "Chabab Mohammedia": [
    {
      "name": "Tahar Raad",
      "pos": "gk",
      "title": "Tahar",
      "title_es": "Tahar"
    },
    {
      "name": "Abdelkader Rouissi",
      "pos": "def",
      "title": "Abdelkader",
      "title_es": "Abdelkader"
    },
    {
      "name": "Hassan Amcharrat",
      "pos": "mid",
      "title": "Hassan",
      "title_es": "Hassan"
    },
    {
      "name": "Ahmed Faras",
      "pos": "st",
      "title": "Ahmed",
      "title_es": "Ahmed"
    }
  ],
  "Union Touarga": [
    {
      "name": "Abderrahmane Houasli",
      "pos": "gk",
      "title": "Abderrahmane",
      "title_es": "Abderrahmane"
    },
    {
      "name": "Achraf Harmach",
      "pos": "def",
      "title": "Achraf",
      "title_es": "Achraf"
    },
    {
      "name": "Amine Zouhzouh",
      "pos": "mid",
      "title": "Amine",
      "title_es": "Amine"
    },
    {
      "name": "Hicham Khaloua",
      "pos": "st",
      "title": "Hicham",
      "title_es": "Hicham"
    }
  ],
  "Renaissance Zemamra": [
    {
      "name": "Yassine El Houasli",
      "pos": "gk",
      "title": "Yassine",
      "title_es": "Yassine"
    },
    {
      "name": "Marouane Lemzaouri",
      "pos": "def",
      "title": "Marouane",
      "title_es": "Marouane"
    },
    {
      "name": "Abdessamad El Mobarky",
      "pos": "mid",
      "title": "Abdessamad",
      "title_es": "Abdessamad"
    },
    {
      "name": "Jawad Ghabra",
      "pos": "st",
      "title": "Jawad",
      "title_es": "Jawad"
    }
  ],
  "Nacional": [
    {
      "name": "Rodolfo Rodríguez",
      "pos": "gk",
      "title": "Rodolfo",
      "title_es": "Rodolfo"
    },
    {
      "name": "Hugo De León",
      "pos": "def",
      "title": "Hugo",
      "title_es": "Hugo"
    },
    {
      "name": "Héctor Scarone",
      "pos": "mid",
      "title": "El Mago",
      "title_es": "El Mago"
    },
    {
      "name": "Luis Suárez",
      "pos": "st",
      "title": "El Pistolero",
      "title_es": "El Pistolero"
    }
  ],
  "Peñarol": [
    {
      "name": "Ladislao Mazurkiewicz",
      "pos": "gk",
      "title": "Chiquito",
      "title_es": "Chiquito"
    },
    {
      "name": "Néstor Gonçalves",
      "pos": "def",
      "title": "Tito",
      "title_es": "Tito"
    },
    {
      "name": "Juan Alberto Schiaffino",
      "pos": "mid",
      "title": "Pepe",
      "title_es": "Pepe"
    },
    {
      "name": "Fernando Morena",
      "pos": "st",
      "title": "Nando",
      "title_es": "Nando"
    }
  ],
  "Defensor Sporting": [
    {
      "name": "Martín Silva",
      "pos": "gk",
      "title": "Martín",
      "title_es": "Martín"
    },
    {
      "name": "Martín Cáceres",
      "pos": "def",
      "title": "El Pelado",
      "title_es": "El Pelado"
    },
    {
      "name": "Nicolás Olivera",
      "pos": "mid",
      "title": "Nico",
      "title_es": "Nico"
    },
    {
      "name": "Maxi Gómez",
      "pos": "st",
      "title": "Maxi",
      "title_es": "Maxi"
    }
  ],
  "Danubio": [
    {
      "name": "Esteban Conde",
      "pos": "gk",
      "title": "Coco",
      "title_es": "Coco"
    },
    {
      "name": "José María Giménez",
      "pos": "def",
      "title": "Josema",
      "title_es": "Josema"
    },
    {
      "name": "Álvaro Recoba",
      "pos": "mid",
      "title": "El Chino",
      "title_es": "El Chino"
    },
    {
      "name": "Ruben Sosa",
      "pos": "st",
      "title": "Ruben",
      "title_es": "Ruben"
    }
  ],
  "Liverpool Montevideo": [
    {
      "name": "Jorge Bava",
      "pos": "gk",
      "title": "Jorge",
      "title_es": "Jorge"
    },
    {
      "name": "Juan Álvez",
      "pos": "def",
      "title": "Juan",
      "title_es": "Juan"
    },
    {
      "name": "Nicolás De La Cruz",
      "pos": "mid",
      "title": "Nico",
      "title_es": "Nico"
    },
    {
      "name": "Emiliano Alfaro",
      "pos": "st",
      "title": "Emi",
      "title_es": "Emi"
    }
  ],
  "Cerro Largo": [
    {
      "name": "Washington Aguerre",
      "pos": "gk",
      "title": "Washington",
      "title_es": "Washington"
    },
    {
      "name": "Hugo Magallanes",
      "pos": "def",
      "title": "Hugo",
      "title_es": "Hugo"
    },
    {
      "name": "Sebastián Assis",
      "pos": "mid",
      "title": "Sebastián",
      "title_es": "Sebastián"
    },
    {
      "name": "Enzo Borges",
      "pos": "st",
      "title": "Enzo",
      "title_es": "Enzo"
    }
  ],
  "Boston River": [
    {
      "name": "Gonzalo Falcón",
      "pos": "gk",
      "title": "Gonzalo",
      "title_es": "Gonzalo"
    },
    {
      "name": "Guillermo Fratta",
      "pos": "def",
      "title": "Guillermo",
      "title_es": "Guillermo"
    },
    {
      "name": "Diego Scotti",
      "pos": "mid",
      "title": "Diego",
      "title_es": "Diego"
    },
    {
      "name": "Facundo Rodríguez",
      "pos": "st",
      "title": "Facundo",
      "title_es": "Facundo"
    }
  ],
  "Racing Montevideo": [
    {
      "name": "Jorge Contreras",
      "pos": "gk",
      "title": "Jorge",
      "title_es": "Jorge"
    },
    {
      "name": "Rodrigo Brasesco",
      "pos": "def",
      "title": "Rodrigo",
      "title_es": "Rodrigo"
    },
    {
      "name": "Jean Pierre Barrientos",
      "pos": "mid",
      "title": "Jean Pierre",
      "title_es": "Jean Pierre"
    },
    {
      "name": "Líber Quiñones",
      "pos": "st",
      "title": "Líber",
      "title_es": "Líber"
    }
  ],
  "River Plate Montevideo": [
    {
      "name": "Nicola Pérez",
      "pos": "gk",
      "title": "Nicola",
      "title_es": "Nicola"
    },
    {
      "name": "Claudio Herrera",
      "pos": "def",
      "title": "Claudio",
      "title_es": "Claudio"
    },
    {
      "name": "Gabriel Marques",
      "pos": "mid",
      "title": "Gabriel",
      "title_es": "Gabriel"
    },
    {
      "name": "Michael Santos",
      "pos": "st",
      "title": "Michael",
      "title_es": "Michael"
    }
  ],
  "Wanderers": [
    {
      "name": "Leonardo Burián",
      "pos": "gk",
      "title": "Leonardo",
      "title_es": "Leonardo"
    },
    {
      "name": "Maximiliano Olivera",
      "pos": "def",
      "title": "Maxi",
      "title_es": "Maxi"
    },
    {
      "name": "Matías Santos",
      "pos": "mid",
      "title": "Matías",
      "title_es": "Matías"
    },
    {
      "name": "Sergio Blanco",
      "pos": "st",
      "title": "Chapita",
      "title_es": "Chapita"
    }
  ],
  "Plaza Colonia": [
    {
      "name": "Nicolás Guirín",
      "pos": "gk",
      "title": "Nicolás",
      "title_es": "Nicolás"
    },
    {
      "name": "Mario Risso",
      "pos": "def",
      "title": "Mario",
      "title_es": "Mario"
    },
    {
      "name": "Facundo Waller",
      "pos": "mid",
      "title": "Facundo",
      "title_es": "Facundo"
    },
    {
      "name": "Nicolás Dibble",
      "pos": "st",
      "title": "Nicolás",
      "title_es": "Nicolás"
    }
  ],
  "Fénix": [
    {
      "name": "Luis Mejía",
      "pos": "gk",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Ignacio Pallas",
      "pos": "def",
      "title": "Ignacio",
      "title_es": "Ignacio"
    },
    {
      "name": "Martín Ligüera",
      "pos": "mid",
      "title": "Martín",
      "title_es": "Martín"
    },
    {
      "name": "Maximiliano Pérez",
      "pos": "st",
      "title": "Maxi",
      "title_es": "Maxi"
    }
  ],
  "Deportivo Maldonado": [
    {
      "name": "Danilo Lerda",
      "pos": "gk",
      "title": "Danilo",
      "title_es": "Danilo"
    },
    {
      "name": "Gastón Pagano",
      "pos": "def",
      "title": "Gastón",
      "title_es": "Gastón"
    },
    {
      "name": "Federico Ramos",
      "pos": "mid",
      "title": "Federico",
      "title_es": "Federico"
    },
    {
      "name": "Facundo Batista",
      "pos": "st",
      "title": "Facundo",
      "title_es": "Facundo"
    }
  ],
  "Juventud": [
    {
      "name": "Fabián Carini",
      "pos": "gk",
      "title": "Fabián",
      "title_es": "Fabián"
    },
    {
      "name": "Alejandro Reyes",
      "pos": "def",
      "title": "Alejandro",
      "title_es": "Alejandro"
    },
    {
      "name": "Matías Duffard",
      "pos": "mid",
      "title": "Matías",
      "title_es": "Matías"
    },
    {
      "name": "Jaime Báez",
      "pos": "st",
      "title": "Jaime",
      "title_es": "Jaime"
    }
  ],
  "Atlético Nacional": [
    {
      "name": "René Higuita",
      "pos": "gk",
      "title": "El Loco",
      "title_es": "El Loco"
    },
    {
      "name": "Andrés Escobar",
      "pos": "def",
      "title": "The Gentleman",
      "title_es": "El Caballero"
    },
    {
      "name": "Macnelly Torres",
      "pos": "mid",
      "title": "Macnelly",
      "title_es": "Macnelly"
    },
    {
      "name": "Víctor Aristizábal",
      "pos": "st",
      "title": "Aristigol",
      "title_es": "Aristigol"
    }
  ],
  "Millonarios": [
    {
      "name": "Julio Cozzi",
      "pos": "gk",
      "title": "Cozzi",
      "title_es": "Cozzi"
    },
    {
      "name": "Francisco Zuluaga",
      "pos": "def",
      "title": "Cobo",
      "title_es": "Cobo"
    },
    {
      "name": "Alfredo Di Stéfano",
      "pos": "mid",
      "title": "The Blond Arrow",
      "title_es": "La Saeta Rubia"
    },
    {
      "name": "Willington Ortiz",
      "pos": "st",
      "title": "Willy",
      "title_es": "Willy"
    }
  ],
  "América de Cali": [
    {
      "name": "Julio César Falcioni",
      "pos": "gk",
      "title": "Falcioni",
      "title_es": "Falcioni"
    },
    {
      "name": "Jorge Bermúdez",
      "pos": "def",
      "title": "El Patrón",
      "title_es": "El Patrón"
    },
    {
      "name": "Freddy Rincón",
      "pos": "mid",
      "title": "El Coloso",
      "title_es": "El Coloso"
    },
    {
      "name": "Antony de Ávila",
      "pos": "st",
      "title": "El Pitufo",
      "title_es": "El Pitufo"
    }
  ],
  "Junior": [
    {
      "name": "Sebastián Viera",
      "pos": "gk",
      "title": "Sebastián",
      "title_es": "Sebastián"
    },
    {
      "name": "Alexis Mendoza",
      "pos": "def",
      "title": "Alexis",
      "title_es": "Alexis"
    },
    {
      "name": "Carlos Valderrama",
      "pos": "mid",
      "title": "El Pibe",
      "title_es": "El Pibe"
    },
    {
      "name": "Iván Valenciano",
      "pos": "st",
      "title": "El Bombardero",
      "title_es": "El Bombardero"
    }
  ],
  "Deportes Tolima": [
    {
      "name": "Joel Silva",
      "pos": "gk",
      "title": "Joel",
      "title_es": "Joel"
    },
    {
      "name": "Gerardo Vallejo",
      "pos": "def",
      "title": "Gerardo",
      "title_es": "Gerardo"
    },
    {
      "name": "David Silva",
      "pos": "mid",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Marco Pérez",
      "pos": "st",
      "title": "Marco",
      "title_es": "Marco"
    }
  ],
  "Deportivo Cali": [
    {
      "name": "Faryd Mondragón",
      "pos": "gk",
      "title": "El Turco",
      "title_es": "El Turco"
    },
    {
      "name": "Mario Yepes",
      "pos": "def",
      "title": "Super Mario",
      "title_es": "Súper Mario"
    },
    {
      "name": "Carlos Valderrama",
      "pos": "mid",
      "title": "El Pibe",
      "title_es": "El Pibe"
    },
    {
      "name": "Hamilton Ricard",
      "pos": "st",
      "title": "Hamilton",
      "title_es": "Hamilton"
    }
  ],
  "Santa Fe": [
    {
      "name": "Camilo Vargas",
      "pos": "gk",
      "title": "Camilo",
      "title_es": "Camilo"
    },
    {
      "name": "Francisco Meza",
      "pos": "def",
      "title": "Francisco",
      "title_es": "Francisco"
    },
    {
      "name": "Omar Pérez",
      "pos": "mid",
      "title": "Omar",
      "title_es": "Omar"
    },
    {
      "name": "Léider Preciado",
      "pos": "st",
      "title": "Léider",
      "title_es": "Léider"
    }
  ],
  "Independiente Medellín": [
    {
      "name": "David González",
      "pos": "gk",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Amaranto Perea",
      "pos": "def",
      "title": "Amaranto",
      "title_es": "Amaranto"
    },
    {
      "name": "Mao Molina",
      "pos": "mid",
      "title": "Mao",
      "title_es": "Mao"
    },
    {
      "name": "Jackson Martínez",
      "pos": "st",
      "title": "Cha Cha Cha",
      "title_es": "Cha Cha Cha"
    }
  ],
  "Bucaramanga": [
    {
      "name": "Luis Delgado",
      "pos": "gk",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Faraón León",
      "pos": "def",
      "title": "Faraón",
      "title_es": "Faraón"
    },
    {
      "name": "Sherman Cárdenas",
      "pos": "mid",
      "title": "Sherman",
      "title_es": "Sherman"
    },
    {
      "name": "Dayro Moreno",
      "pos": "st",
      "title": "Dayro",
      "title_es": "Dayro"
    }
  ],
  "Once Caldas": [
    {
      "name": "Juan Carlos Henao",
      "pos": "gk",
      "title": "Henao",
      "title_es": "Henao"
    },
    {
      "name": "Samuel Vanegas",
      "pos": "def",
      "title": "Samuel",
      "title_es": "Samuel"
    },
    {
      "name": "Arnulfo Valentierra",
      "pos": "mid",
      "title": "Arnulfo",
      "title_es": "Arnulfo"
    },
    {
      "name": "Sergio Galván Rey",
      "pos": "st",
      "title": "Sergio",
      "title_es": "Sergio"
    }
  ],
  "Deportivo Pasto": [
    {
      "name": "Carlos Barahona",
      "pos": "gk",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Walden Vargas",
      "pos": "def",
      "title": "Walden",
      "title_es": "Walden"
    },
    {
      "name": "René Rosero",
      "pos": "mid",
      "title": "René",
      "title_es": "René"
    },
    {
      "name": "Carlos Rendón",
      "pos": "st",
      "title": "Carlos",
      "title_es": "Carlos"
    }
  ],
  "La Equidad": [
    {
      "name": "Diego Novoa",
      "pos": "gk",
      "title": "Diego",
      "title_es": "Diego"
    },
    {
      "name": "Jhon Alex Cano",
      "pos": "def",
      "title": "Jhon Alex",
      "title_es": "Jhon Alex"
    },
    {
      "name": "Stalin Motta",
      "pos": "mid",
      "title": "Stalin",
      "title_es": "Stalin"
    },
    {
      "name": "Carmelo Valencia",
      "pos": "st",
      "title": "Carmelo",
      "title_es": "Carmelo"
    }
  ],
  "Águilas Doradas": [
    {
      "name": "Carlos Bejarano",
      "pos": "gk",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Carlos Arboleda",
      "pos": "def",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Christian Marrugo",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Luis Páez",
      "pos": "st",
      "title": "Luis",
      "title_es": "Luis"
    }
  ],
  "Deportivo Pereira": [
    {
      "name": "René Higuita",
      "pos": "gk",
      "title": "El Loco",
      "title_es": "El Loco"
    },
    {
      "name": "Jhon Lozano",
      "pos": "def",
      "title": "Jhon",
      "title_es": "Jhon"
    },
    {
      "name": "Jhonny Ramírez",
      "pos": "mid",
      "title": "Jhonny",
      "title_es": "Jhonny"
    },
    {
      "name": "Carlos Darwin Quintero",
      "pos": "st",
      "title": "Darwin",
      "title_es": "Darwin"
    }
  ],
  "Envigado": [
    {
      "name": "Bréiner Castillo",
      "pos": "gk",
      "title": "Bréiner",
      "title_es": "Bréiner"
    },
    {
      "name": "Andrés Orozco",
      "pos": "def",
      "title": "Andrés",
      "title_es": "Andrés"
    },
    {
      "name": "Giovanni Moreno",
      "pos": "mid",
      "title": "Gio",
      "title_es": "Gio"
    },
    {
      "name": "Dorlan Pabón",
      "pos": "st",
      "title": "Memín",
      "title_es": "Memín"
    }
  ],
  "Alianza": [
    {
      "name": "Ricardo Jerez",
      "pos": "gk",
      "title": "Ricardo",
      "title_es": "Ricardo"
    },
    {
      "name": "David Valencia",
      "pos": "def",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Harrison Henao",
      "pos": "mid",
      "title": "Harrison",
      "title_es": "Harrison"
    },
    {
      "name": "Ayron del Valle",
      "pos": "st",
      "title": "Ayron",
      "title_es": "Ayron"
    }
  ],
  "América": [
    {
      "name": "Guillermo Ochoa",
      "pos": "gk",
      "title": "Memo",
      "title_es": "Memo"
    },
    {
      "name": "Alfredo Tena",
      "pos": "def",
      "title": "Captain Fury",
      "title_es": "Capitán Furia"
    },
    {
      "name": "Carlos Reinoso",
      "pos": "mid",
      "title": "El Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "Cuauhtémoc Blanco",
      "pos": "st",
      "title": "Cuau",
      "title_es": "Cuau"
    }
  ],
  "Tigres": [
    {
      "name": "Nahuel Guzmán",
      "pos": "gk",
      "title": "Patón",
      "title_es": "Patón"
    },
    {
      "name": "Juninho",
      "pos": "def",
      "title": "Juninho",
      "title_es": "Juninho"
    },
    {
      "name": "Tomás Boy",
      "pos": "mid",
      "title": "El Jefe",
      "title_es": "El Jefe"
    },
    {
      "name": "André-Pierre Gignac",
      "pos": "st",
      "title": "Dédé",
      "title_es": "Dédé"
    }
  ],
  "Monterrey": [
    {
      "name": "Jonathan Orozco",
      "pos": "gk",
      "title": "Jona",
      "title_es": "Jona"
    },
    {
      "name": "José María Basanta",
      "pos": "def",
      "title": "Chema",
      "title_es": "Chema"
    },
    {
      "name": "Jesús Arellano",
      "pos": "mid",
      "title": "Cabrito",
      "title_es": "Cabrito"
    },
    {
      "name": "Humberto Suazo",
      "pos": "st",
      "title": "Chupete",
      "title_es": "Chupete"
    }
  ],
  "Cruz Azul": [
    {
      "name": "José de Jesús Corona",
      "pos": "gk",
      "title": "Chuy",
      "title_es": "Chuy"
    },
    {
      "name": "Juan Reynoso",
      "pos": "def",
      "title": "Juan",
      "title_es": "Juan"
    },
    {
      "name": "Christian Giménez",
      "pos": "mid",
      "title": "Chaco",
      "title_es": "Chaco"
    },
    {
      "name": "Carlos Hermosillo",
      "pos": "st",
      "title": "El Grandote",
      "title_es": "El Grandote de Cerro Azul"
    }
  ],
  "Toluca": [
    {
      "name": "Hernán Cristante",
      "pos": "gk",
      "title": "Hernán",
      "title_es": "Hernán"
    },
    {
      "name": "Paulo da Silva",
      "pos": "def",
      "title": "Paulo",
      "title_es": "Paulo"
    },
    {
      "name": "Sinha",
      "pos": "mid",
      "title": "Sinha",
      "title_es": "Sinha"
    },
    {
      "name": "José Cardozo",
      "pos": "st",
      "title": "El Príncipe Guaraní",
      "title_es": "El Príncipe Guaraní"
    }
  ],
  "Chivas": [
    {
      "name": "Oswaldo Sánchez",
      "pos": "gk",
      "title": "San Oswaldo",
      "title_es": "San Oswaldo"
    },
    {
      "name": "Carlos Salcido",
      "pos": "def",
      "title": "Salcido",
      "title_es": "Salcido"
    },
    {
      "name": "Ramón Morales",
      "pos": "mid",
      "title": "Ramoncito",
      "title_es": "Ramoncito"
    },
    {
      "name": "Omar Bravo",
      "pos": "st",
      "title": "Omar",
      "title_es": "Omar"
    }
  ],
  "Pumas": [
    {
      "name": "Jorge Campos",
      "pos": "gk",
      "title": "El Brody",
      "title_es": "El Brody"
    },
    {
      "name": "Darío Verón",
      "pos": "def",
      "title": "Darío",
      "title_es": "Darío"
    },
    {
      "name": "Leandro Augusto",
      "pos": "mid",
      "title": "Leandro",
      "title_es": "Leandro"
    },
    {
      "name": "Hugo Sánchez",
      "pos": "st",
      "title": "Hugol",
      "title_es": "Hugol"
    }
  ],
  "León": [
    {
      "name": "Antonio Carbajal",
      "pos": "gk",
      "title": "La Tota",
      "title_es": "La Tota"
    },
    {
      "name": "Rafael Márquez",
      "pos": "def",
      "title": "El Káiser",
      "title_es": "El Káiser"
    },
    {
      "name": "Luis Montes",
      "pos": "mid",
      "title": "Chapo",
      "title_es": "Chapo"
    },
    {
      "name": "Mauro Boselli",
      "pos": "st",
      "title": "Mauro",
      "title_es": "Mauro"
    }
  ],
  "Pachuca": [
    {
      "name": "Miguel Calero",
      "pos": "gk",
      "title": "El Cóndor",
      "title_es": "El Cóndor"
    },
    {
      "name": "Aquivaldo Mosquera",
      "pos": "def",
      "title": "Aquivaldo",
      "title_es": "Aquivaldo"
    },
    {
      "name": "Gabriel Caballero",
      "pos": "mid",
      "title": "El Eterno",
      "title_es": "El Eterno"
    },
    {
      "name": "Franco Jara",
      "pos": "st",
      "title": "Jinete",
      "title_es": "Jinete"
    }
  ],
  "Santos Laguna": [
    {
      "name": "Agustín Marchesín",
      "pos": "gk",
      "title": "Marche",
      "title_es": "Marche"
    },
    {
      "name": "Carlos Izquierdoz",
      "pos": "def",
      "title": "Cali",
      "title_es": "Cali"
    },
    {
      "name": "Rodrigo Ruiz",
      "pos": "mid",
      "title": "Pony",
      "title_es": "Pony"
    },
    {
      "name": "Jared Borgetti",
      "pos": "st",
      "title": "El Zorro",
      "title_es": "El Zorro del Desierto"
    }
  ],
  "Atlas": [
    {
      "name": "Erubey Cabuto",
      "pos": "gk",
      "title": "Erubey",
      "title_es": "Erubey"
    },
    {
      "name": "Rafael Márquez",
      "pos": "def",
      "title": "El Káiser",
      "title_es": "El Káiser"
    },
    {
      "name": "Pável Pardo",
      "pos": "mid",
      "title": "El Bebé",
      "title_es": "El Bebé"
    },
    {
      "name": "Daniel Osorno",
      "pos": "st",
      "title": "Dani",
      "title_es": "Dani"
    }
  ],
  "Necaxa": [
    {
      "name": "Nicolás Navarro",
      "pos": "gk",
      "title": "Nico",
      "title_es": "Nico"
    },
    {
      "name": "Pablo Quatrocchi",
      "pos": "def",
      "title": "Pablo",
      "title_es": "Pablo"
    },
    {
      "name": "Álex Aguinaga",
      "pos": "mid",
      "title": "El Güero",
      "title_es": "El Güero"
    },
    {
      "name": "Ivo Basay",
      "pos": "st",
      "title": "Ivo",
      "title_es": "Ivo"
    }
  ],
  "Puebla": [
    {
      "name": "Pablo Larios",
      "pos": "gk",
      "title": "El Arquero",
      "title_es": "El Arquero de la Selva"
    },
    {
      "name": "Roberto Ruiz Esparza",
      "pos": "def",
      "title": "Roberto",
      "title_es": "Roberto"
    },
    {
      "name": "Jorge Aravena",
      "pos": "mid",
      "title": "Mortero",
      "title_es": "Mortero"
    },
    {
      "name": "Carlos Poblete",
      "pos": "st",
      "title": "Búfalo",
      "title_es": "Búfalo"
    }
  ],
  "Tijuana": [
    {
      "name": "Cirilo Saucedo",
      "pos": "gk",
      "title": "Cirilo",
      "title_es": "Cirilo"
    },
    {
      "name": "Javier Gandolfi",
      "pos": "def",
      "title": "Javier",
      "title_es": "Javier"
    },
    {
      "name": "Fernando Arce",
      "pos": "mid",
      "title": "Arce",
      "title_es": "Arce"
    },
    {
      "name": "Dayro Moreno",
      "pos": "st",
      "title": "Dayro",
      "title_es": "Dayro"
    }
  ],
  "Querétaro": [
    {
      "name": "Tiago Volpi",
      "pos": "gk",
      "title": "Volpi",
      "title_es": "Volpi"
    },
    {
      "name": "Miguel Martínez",
      "pos": "def",
      "title": "Miguel",
      "title_es": "Miguel"
    },
    {
      "name": "Ronaldinho",
      "pos": "mid",
      "title": "Dinho",
      "title_es": "Dinho"
    },
    {
      "name": "Camilo Sanvezzo",
      "pos": "st",
      "title": "Camilo",
      "title_es": "Camilo"
    }
  ],
  "Juárez": [
    {
      "name": "Edmundo Vázquez",
      "pos": "gk",
      "title": "Edmundo",
      "title_es": "Edmundo"
    },
    {
      "name": "Maximiliano Olivera",
      "pos": "def",
      "title": "Maxi",
      "title_es": "Maxi"
    },
    {
      "name": "Jefferson Intriago",
      "pos": "mid",
      "title": "Jefferson",
      "title_es": "Jefferson"
    },
    {
      "name": "Darío Lezcano",
      "pos": "st",
      "title": "Darío",
      "title_es": "Darío"
    }
  ],
  "Mazatlán": [
    {
      "name": "Nicolás Vikonis",
      "pos": "gk",
      "title": "Nico",
      "title_es": "Nico"
    },
    {
      "name": "Nicolás Díaz",
      "pos": "def",
      "title": "Nico",
      "title_es": "Nico"
    },
    {
      "name": "Roberto Meraz",
      "pos": "mid",
      "title": "Roberto",
      "title_es": "Roberto"
    },
    {
      "name": "Camilo Sanvezzo",
      "pos": "st",
      "title": "Camilo",
      "title_es": "Camilo"
    }
  ],
  "Atlético San Luis": [
    {
      "name": "Marcelo Barovero",
      "pos": "gk",
      "title": "Trapito",
      "title_es": "Trapito"
    },
    {
      "name": "Unai Bilbao",
      "pos": "def",
      "title": "Unai",
      "title_es": "Unai"
    },
    {
      "name": "Javier Güémez",
      "pos": "mid",
      "title": "Javier",
      "title_es": "Javier"
    },
    {
      "name": "Germán Berterame",
      "pos": "st",
      "title": "Germán",
      "title_es": "Germán"
    }
  ],
  "Inter Miami": [
    {
      "name": "Drake Callender",
      "pos": "gk",
      "title": "Drake",
      "title_es": "Drake"
    },
    {
      "name": "DeAndre Yedlin",
      "pos": "def",
      "title": "Yedlin",
      "title_es": "Yedlin"
    },
    {
      "name": "Sergio Busquets",
      "pos": "mid",
      "title": "Busi",
      "title_es": "Busi"
    },
    {
      "name": "Lionel Messi",
      "pos": "st",
      "title": "La Pulga",
      "title_es": "La Pulga"
    }
  ],
  "LAFC": [
    {
      "name": "Tyler Miller",
      "pos": "gk",
      "title": "Tyler",
      "title_es": "Tyler"
    },
    {
      "name": "Walker Zimmerman",
      "pos": "def",
      "title": "Walker",
      "title_es": "Walker"
    },
    {
      "name": "Carlos Vela",
      "pos": "mid",
      "title": "Carlitos",
      "title_es": "Carlitos"
    },
    {
      "name": "Diego Rossi",
      "pos": "st",
      "title": "Diego",
      "title_es": "Diego"
    }
  ],
  "LA Galaxy": [
    {
      "name": "Kevin Hartman",
      "pos": "gk",
      "title": "El Gato",
      "title_es": "El Gato"
    },
    {
      "name": "Omar Gonzalez",
      "pos": "def",
      "title": "Omar",
      "title_es": "Omar"
    },
    {
      "name": "Landon Donovan",
      "pos": "mid",
      "title": "Captain America",
      "title_es": "Capitán América"
    },
    {
      "name": "Robbie Keane",
      "pos": "st",
      "title": "Keano",
      "title_es": "Keano"
    }
  ],
  "Columbus Crew": [
    {
      "name": "Zack Steffen",
      "pos": "gk",
      "title": "Zack",
      "title_es": "Zack"
    },
    {
      "name": "Chad Marshall",
      "pos": "def",
      "title": "Chad",
      "title_es": "Chad"
    },
    {
      "name": "Guillermo Barros Schelotto",
      "pos": "mid",
      "title": "El Mellizo",
      "title_es": "El Mellizo"
    },
    {
      "name": "Brian McBride",
      "pos": "st",
      "title": "Brian",
      "title_es": "Brian"
    }
  ],
  "Seattle Sounders": [
    {
      "name": "Stefan Frei",
      "pos": "gk",
      "title": "Stefan",
      "title_es": "Stefan"
    },
    {
      "name": "Román Torres",
      "pos": "def",
      "title": "Román",
      "title_es": "Román"
    },
    {
      "name": "Osvaldo Alonso",
      "pos": "mid",
      "title": "Ozzie",
      "title_es": "Ozzie"
    },
    {
      "name": "Clint Dempsey",
      "pos": "st",
      "title": "Deuce",
      "title_es": "Deuce"
    }
  ],
  "Atlanta United": [
    {
      "name": "Brad Guzan",
      "pos": "gk",
      "title": "Brad",
      "title_es": "Brad"
    },
    {
      "name": "Leandro González Pírez",
      "pos": "def",
      "title": "Leandro",
      "title_es": "Leandro"
    },
    {
      "name": "Miguel Almirón",
      "pos": "mid",
      "title": "Miggy",
      "title_es": "Miggy"
    },
    {
      "name": "Josef Martínez",
      "pos": "st",
      "title": "Josef",
      "title_es": "Josef"
    }
  ],
  "NYCFC": [
    {
      "name": "Sean Johnson",
      "pos": "gk",
      "title": "Sean",
      "title_es": "Sean"
    },
    {
      "name": "Alexander Callens",
      "pos": "def",
      "title": "Alexander",
      "title_es": "Alexander"
    },
    {
      "name": "Maxi Moralez",
      "pos": "mid",
      "title": "Maxi",
      "title_es": "Maxi"
    },
    {
      "name": "David Villa",
      "pos": "st",
      "title": "El Guaje",
      "title_es": "El Guaje"
    }
  ],
  "Cincinnati": [
    {
      "name": "Roman Celentano",
      "pos": "gk",
      "title": "Roman",
      "title_es": "Roman"
    },
    {
      "name": "Matt Miazga",
      "pos": "def",
      "title": "Matt",
      "title_es": "Matt"
    },
    {
      "name": "Luciano Acosta",
      "pos": "mid",
      "title": "Lucho",
      "title_es": "Lucho"
    },
    {
      "name": "Brandon Vazquez",
      "pos": "st",
      "title": "Brandon",
      "title_es": "Brandon"
    }
  ],
  "Orlando City": [
    {
      "name": "Pedro Gallese",
      "pos": "gk",
      "title": "El Pulpo",
      "title_es": "El Pulpo"
    },
    {
      "name": "Robin Jansson",
      "pos": "def",
      "title": "Robin",
      "title_es": "Robin"
    },
    {
      "name": "Kaká",
      "pos": "mid",
      "title": "Kaká",
      "title_es": "Kaká"
    },
    {
      "name": "Cyle Larin",
      "pos": "st",
      "title": "Cyle",
      "title_es": "Cyle"
    }
  ],
  "Philadelphia Union": [
    {
      "name": "Andre Blake",
      "pos": "gk",
      "title": "Andre",
      "title_es": "Andre"
    },
    {
      "name": "Jakob Glesnes",
      "pos": "def",
      "title": "Jakob",
      "title_es": "Jakob"
    },
    {
      "name": "Alejandro Bedoya",
      "pos": "mid",
      "title": "Ale",
      "title_es": "Ale"
    },
    {
      "name": "Sébastien Le Toux",
      "pos": "st",
      "title": "Seba",
      "title_es": "Seba"
    }
  ],
  "Austin FC": [
    {
      "name": "Brad Stuver",
      "pos": "gk",
      "title": "Brad",
      "title_es": "Brad"
    },
    {
      "name": "Julio Cascante",
      "pos": "def",
      "title": "Julio",
      "title_es": "Julio"
    },
    {
      "name": "Sebastián Driussi",
      "pos": "mid",
      "title": "Seba",
      "title_es": "Seba"
    },
    {
      "name": "Diego Fagúndez",
      "pos": "st",
      "title": "Diego",
      "title_es": "Diego"
    }
  ],
  "Nashville SC": [
    {
      "name": "Joe Willis",
      "pos": "gk",
      "title": "Joe",
      "title_es": "Joe"
    },
    {
      "name": "Walker Zimmerman",
      "pos": "def",
      "title": "Walker",
      "title_es": "Walker"
    },
    {
      "name": "Hany Mukhtar",
      "pos": "mid",
      "title": "Hany",
      "title_es": "Hany"
    },
    {
      "name": "C.J. Sapong",
      "pos": "st",
      "title": "C.J.",
      "title_es": "C.J."
    }
  ],
  "Portland Timbers": [
    {
      "name": "Donovan Ricketts",
      "pos": "gk",
      "title": "Donovan",
      "title_es": "Donovan"
    },
    {
      "name": "Liam Ridgewell",
      "pos": "def",
      "title": "Liam",
      "title_es": "Liam"
    },
    {
      "name": "Diego Valeri",
      "pos": "mid",
      "title": "El Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "Fanendo Adi",
      "pos": "st",
      "title": "Adi",
      "title_es": "Adi"
    }
  ],
  "Real Salt Lake": [
    {
      "name": "Nick Rimando",
      "pos": "gk",
      "title": "Nick",
      "title_es": "Nick"
    },
    {
      "name": "Jámison Olave",
      "pos": "def",
      "title": "Olave",
      "title_es": "Olave"
    },
    {
      "name": "Kyle Beckerman",
      "pos": "mid",
      "title": "Kyle",
      "title_es": "Kyle"
    },
    {
      "name": "Álvaro Saborío",
      "pos": "st",
      "title": "Sabo",
      "title_es": "Sabo"
    }
  ],
  "Sporting KC": [
    {
      "name": "Tim Melia",
      "pos": "gk",
      "title": "Tim",
      "title_es": "Tim"
    },
    {
      "name": "Matt Besler",
      "pos": "def",
      "title": "Matt",
      "title_es": "Matt"
    },
    {
      "name": "Preki",
      "pos": "mid",
      "title": "Preki",
      "title_es": "Preki"
    },
    {
      "name": "Dom Dwyer",
      "pos": "st",
      "title": "Dom",
      "title_es": "Dom"
    }
  ],
  "Houston Dynamo": [
    {
      "name": "Pat Onstad",
      "pos": "gk",
      "title": "Pat",
      "title_es": "Pat"
    },
    {
      "name": "Bobby Boswell",
      "pos": "def",
      "title": "Bobby",
      "title_es": "Bobby"
    },
    {
      "name": "Brad Davis",
      "pos": "mid",
      "title": "Brad",
      "title_es": "Brad"
    },
    {
      "name": "Brian Ching",
      "pos": "st",
      "title": "Brian",
      "title_es": "Brian"
    }
  ],
  "Minnesota United": [
    {
      "name": "Vito Mannone",
      "pos": "gk",
      "title": "Vito",
      "title_es": "Vito"
    },
    {
      "name": "Michael Boxall",
      "pos": "def",
      "title": "Michael",
      "title_es": "Michael"
    },
    {
      "name": "Emanuel Reynoso",
      "pos": "mid",
      "title": "Bebelo",
      "title_es": "Bebelo"
    },
    {
      "name": "Christian Ramirez",
      "pos": "st",
      "title": "Superman",
      "title_es": "Superman"
    }
  ],
  "DC United": [
    {
      "name": "Bill Hamid",
      "pos": "gk",
      "title": "Bill",
      "title_es": "Bill"
    },
    {
      "name": "Eddie Pope",
      "pos": "def",
      "title": "Eddie",
      "title_es": "Eddie"
    },
    {
      "name": "Marco Etcheverry",
      "pos": "mid",
      "title": "El Diablo",
      "title_es": "El Diablo"
    },
    {
      "name": "Jaime Moreno",
      "pos": "st",
      "title": "Jaime",
      "title_es": "Jaime"
    }
  ],
  "Chicago Fire": [
    {
      "name": "Zach Thornton",
      "pos": "gk",
      "title": "Zach",
      "title_es": "Zach"
    },
    {
      "name": "C.J. Brown",
      "pos": "def",
      "title": "C.J.",
      "title_es": "C.J."
    },
    {
      "name": "Piotr Nowak",
      "pos": "mid",
      "title": "Piotr",
      "title_es": "Piotr"
    },
    {
      "name": "Ante Razov",
      "pos": "st",
      "title": "Ante",
      "title_es": "Ante"
    }
  ],
  "Charlotte FC": [
    {
      "name": "Kristijan Kahlina",
      "pos": "gk",
      "title": "Kristijan",
      "title_es": "Kristijan"
    },
    {
      "name": "Adilson Malanda",
      "pos": "def",
      "title": "Adilson",
      "title_es": "Adilson"
    },
    {
      "name": "Ashley Westwood",
      "pos": "mid",
      "title": "Ashley",
      "title_es": "Ashley"
    },
    {
      "name": "Karol Świderski",
      "pos": "st",
      "title": "Karol",
      "title_es": "Karol"
    }
  ],
  "San Jose Earthquakes": [
    {
      "name": "Joe Cannon",
      "pos": "gk",
      "title": "Joe",
      "title_es": "Joe"
    },
    {
      "name": "Jeff Agoos",
      "pos": "def",
      "title": "Jeff",
      "title_es": "Jeff"
    },
    {
      "name": "Ronald Cerritos",
      "pos": "mid",
      "title": "Ronald",
      "title_es": "Ronald"
    },
    {
      "name": "Chris Wondolowski",
      "pos": "st",
      "title": "Wondo",
      "title_es": "Wondo"
    }
  ],
  "Young Boys": [
    {
      "name": "Marco Wölfli",
      "pos": "gk",
      "title": "Marco",
      "title_es": "Marco"
    },
    {
      "name": "Steve von Bergen",
      "pos": "def",
      "title": "Steve",
      "title_es": "Steve"
    },
    {
      "name": "Hakan Yakin",
      "pos": "mid",
      "title": "Hakan",
      "title_es": "Hakan"
    },
    {
      "name": "Stéphane Chapuisat",
      "pos": "st",
      "title": "Chappi",
      "title_es": "Chappi"
    }
  ],
  "Basel": [
    {
      "name": "Yann Sommer",
      "pos": "gk",
      "title": "Yann",
      "title_es": "Yann"
    },
    {
      "name": "Murat Yakin",
      "pos": "def",
      "title": "Muri",
      "title_es": "Muri"
    },
    {
      "name": "Matias Delgado",
      "pos": "mid",
      "title": "El Mago",
      "title_es": "El Mago"
    },
    {
      "name": "Marco Streller",
      "pos": "st",
      "title": "Marco",
      "title_es": "Marco"
    }
  ],
  "Servette": [
    {
      "name": "Marco Pascolo",
      "pos": "gk",
      "title": "Marco",
      "title_es": "Marco"
    },
    {
      "name": "Alain Geiger",
      "pos": "def",
      "title": "Alain",
      "title_es": "Alain"
    },
    {
      "name": "Johann Lonfat",
      "pos": "mid",
      "title": "Johann",
      "title_es": "Johann"
    },
    {
      "name": "Karl-Heinz Rummenigge",
      "pos": "st",
      "title": "Kalle",
      "title_es": "Kalle"
    }
  ],
  "St. Gallen": [
    {
      "name": "Jörg Stiel",
      "pos": "gk",
      "title": "Jörg",
      "title_es": "Jörg"
    },
    {
      "name": "Marc Zellweger",
      "pos": "def",
      "title": "Zelli",
      "title_es": "Zelli"
    },
    {
      "name": "Tranquillo Barnetta",
      "pos": "mid",
      "title": "Quillo",
      "title_es": "Quillo"
    },
    {
      "name": "Ivan Zamorano",
      "pos": "st",
      "title": "Bam Bam",
      "title_es": "Bam Bam"
    }
  ],
  "Zürich": [
    {
      "name": "Johnny Leoni",
      "pos": "gk",
      "title": "Johnny",
      "title_es": "Johnny"
    },
    {
      "name": "Hannu Tihinen",
      "pos": "def",
      "title": "Hannu",
      "title_es": "Hannu"
    },
    {
      "name": "Blerim Džemaili",
      "pos": "mid",
      "title": "Blerim",
      "title_es": "Blerim"
    },
    {
      "name": "Shabani Nonda",
      "pos": "st",
      "title": "Shabani",
      "title_es": "Shabani"
    }
  ],
  "Lugano": [
    {
      "name": "Noam Baumann",
      "pos": "gk",
      "title": "Noam",
      "title_es": "Noam"
    },
    {
      "name": "Mijat Marić",
      "pos": "def",
      "title": "Mijat",
      "title_es": "Mijat"
    },
    {
      "name": "Mattia Bottani",
      "pos": "mid",
      "title": "Mattia",
      "title_es": "Mattia"
    },
    {
      "name": "Julio Hernán Rossi",
      "pos": "st",
      "title": "Julio",
      "title_es": "Julio"
    }
  ],
  "Luzern": [
    {
      "name": "David Zibung",
      "pos": "gk",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Stefan Wolf",
      "pos": "def",
      "title": "Stefan",
      "title_es": "Stefan"
    },
    {
      "name": "Gerardo Seoane",
      "pos": "mid",
      "title": "Gerry",
      "title_es": "Gerry"
    },
    {
      "name": "Alexander Frei",
      "pos": "st",
      "title": "Alex",
      "title_es": "Alex"
    }
  ],
  "Sion": [
    {
      "name": "Andris Vaņins",
      "pos": "gk",
      "title": "Andris",
      "title_es": "Andris"
    },
    {
      "name": "Alain Geiger",
      "pos": "def",
      "title": "Alain",
      "title_es": "Alain"
    },
    {
      "name": "Gelson Fernandes",
      "pos": "mid",
      "title": "Gelson",
      "title_es": "Gelson"
    },
    {
      "name": "Álvaro Saborío",
      "pos": "st",
      "title": "Sabo",
      "title_es": "Sabo"
    }
  ],
  "Grasshoppers": [
    {
      "name": "Stefan Huber",
      "pos": "gk",
      "title": "Stefan",
      "title_es": "Stefan"
    },
    {
      "name": "Mats Gren",
      "pos": "def",
      "title": "Mats",
      "title_es": "Mats"
    },
    {
      "name": "Ciriaco Sforza",
      "pos": "mid",
      "title": "Ciriaco",
      "title_es": "Ciriaco"
    },
    {
      "name": "Giovane Élber",
      "pos": "st",
      "title": "Élber",
      "title_es": "Élber"
    }
  ],
  "Lausanne": [
    {
      "name": "Thomas Castella",
      "pos": "gk",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Stéphane Henchoz",
      "pos": "def",
      "title": "Stéphane",
      "title_es": "Stéphane"
    },
    {
      "name": "Fabio Celestini",
      "pos": "mid",
      "title": "Fabio",
      "title_es": "Fabio"
    },
    {
      "name": "Zeki Amdouni",
      "pos": "st",
      "title": "Zeki",
      "title_es": "Zeki"
    }
  ],
  "Thun": [
    {
      "name": "Guillaume Faivre",
      "pos": "gk",
      "title": "Guillaume",
      "title_es": "Guillaume"
    },
    {
      "name": "Andreas Wittwer",
      "pos": "def",
      "title": "Andreas",
      "title_es": "Andreas"
    },
    {
      "name": "Nelson Ferreira",
      "pos": "mid",
      "title": "Nelson",
      "title_es": "Nelson"
    },
    {
      "name": "Mauro Lustrinelli",
      "pos": "st",
      "title": "Lustrigol",
      "title_es": "Lustrigol"
    }
  ],
  "Winterthur": [
    {
      "name": "Raphaël Spiegel",
      "pos": "gk",
      "title": "Raphaël",
      "title_es": "Raphaël"
    },
    {
      "name": "Granit Lekaj",
      "pos": "def",
      "title": "Granit",
      "title_es": "Granit"
    },
    {
      "name": "Remo Freuler",
      "pos": "mid",
      "title": "Remo",
      "title_es": "Remo"
    },
    {
      "name": "Innocent Emeghara",
      "pos": "st",
      "title": "Innocent",
      "title_es": "Innocent"
    }
  ],
  "Yverdon": [
    {
      "name": "Kevin Martin",
      "pos": "gk",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "Ludovic Magnin",
      "pos": "def",
      "title": "Ludo",
      "title_es": "Ludo"
    },
    {
      "name": "Mustafa Sejmenović",
      "pos": "mid",
      "title": "Mustafa",
      "title_es": "Mustafa"
    },
    {
      "name": "Djibril Cissé",
      "pos": "st",
      "title": "Djibril",
      "title_es": "Djibril"
    }
  ],
  "Vissel Kobe": [
    {
      "name": "Daiya Maekawa",
      "pos": "gk",
      "title": "Daiya",
      "title_es": "Daiya"
    },
    {
      "name": "Thomas Vermaelen",
      "pos": "def",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Andrés Iniesta",
      "pos": "mid",
      "title": "El Ilusionista",
      "title_es": "El Ilusionista"
    },
    {
      "name": "Kazuyoshi Miura",
      "pos": "st",
      "title": "King Kazu",
      "title_es": "Rey Kazu"
    }
  ],
  "Kawasaki Frontale": [
    {
      "name": "Jung Sung-ryong",
      "pos": "gk",
      "title": "Sung-ryong",
      "title_es": "Sung-ryong"
    },
    {
      "name": "Shogo Taniguchi",
      "pos": "def",
      "title": "Shogo",
      "title_es": "Shogo"
    },
    {
      "name": "Kengo Nakamura",
      "pos": "mid",
      "title": "Kengo",
      "title_es": "Kengo"
    },
    {
      "name": "Yu Kobayashi",
      "pos": "st",
      "title": "Yu",
      "title_es": "Yu"
    }
  ],
  "Yokohama F. Marinos": [
    {
      "name": "Yoshikatsu Kawaguchi",
      "pos": "gk",
      "title": "Yoshi",
      "title_es": "Yoshi"
    },
    {
      "name": "Yuji Nakazawa",
      "pos": "def",
      "title": "Bomber",
      "title_es": "Bomber"
    },
    {
      "name": "Shunsuke Nakamura",
      "pos": "mid",
      "title": "Shunsuke",
      "title_es": "Shunsuke"
    },
    {
      "name": "Shoji Jo",
      "pos": "st",
      "title": "Shoji",
      "title_es": "Shoji"
    }
  ],
  "Kashima Antlers": [
    {
      "name": "Hitoshi Sogahata",
      "pos": "gk",
      "title": "Hitoshi",
      "title_es": "Hitoshi"
    },
    {
      "name": "Yutaka Akita",
      "pos": "def",
      "title": "Yutaka",
      "title_es": "Yutaka"
    },
    {
      "name": "Mitsuo Ogasawara",
      "pos": "mid",
      "title": "Mitsuo",
      "title_es": "Mitsuo"
    },
    {
      "name": "Atsushi Yanagisawa",
      "pos": "st",
      "title": "Atsushi",
      "title_es": "Atsushi"
    }
  ],
  "Urawa Red Diamonds": [
    {
      "name": "Shusaku Nishikawa",
      "pos": "gk",
      "title": "Shusaku",
      "title_es": "Shusaku"
    },
    {
      "name": "Marcus Tulio Tanaka",
      "pos": "def",
      "title": "Tulio",
      "title_es": "Tulio"
    },
    {
      "name": "Shinji Ono",
      "pos": "mid",
      "title": "Tensai",
      "title_es": "Tensai"
    },
    {
      "name": "Washington",
      "pos": "st",
      "title": "Washington",
      "title_es": "Washington"
    }
  ],
  "Gamba Osaka": [
    {
      "name": "Yosuke Fujigaya",
      "pos": "gk",
      "title": "Yosuke",
      "title_es": "Yosuke"
    },
    {
      "name": "Satoshi Yamaguchi",
      "pos": "def",
      "title": "Satoshi",
      "title_es": "Satoshi"
    },
    {
      "name": "Yasuhito Endo",
      "pos": "mid",
      "title": "Yatto",
      "title_es": "Yatto"
    },
    {
      "name": "Patrick M'Boma",
      "pos": "st",
      "title": "Magic M'Boma",
      "title_es": "Magic M'Boma"
    }
  ],
  "Sanfrecce Hiroshima": [
    {
      "name": "Takuto Hayashi",
      "pos": "gk",
      "title": "Takuto",
      "title_es": "Takuto"
    },
    {
      "name": "Tsukasa Shiotani",
      "pos": "def",
      "title": "Tsukasa",
      "title_es": "Tsukasa"
    },
    {
      "name": "Toshihiro Aoyama",
      "pos": "mid",
      "title": "Toshihiro",
      "title_es": "Toshihiro"
    },
    {
      "name": "Hisato Sato",
      "pos": "st",
      "title": "Hisato",
      "title_es": "Hisato"
    }
  ],
  "Cerezo Osaka": [
    {
      "name": "Kim Jin-hyeon",
      "pos": "gk",
      "title": "Jin-hyeon",
      "title_es": "Jin-hyeon"
    },
    {
      "name": "Matej Jonjić",
      "pos": "def",
      "title": "Matej",
      "title_es": "Matej"
    },
    {
      "name": "Shinji Kagawa",
      "pos": "mid",
      "title": "Shinji",
      "title_es": "Shinji"
    },
    {
      "name": "Diego Forlán",
      "pos": "st",
      "title": "Cachavacha",
      "title_es": "Cachavacha"
    }
  ],
  "FC Tokyo": [
    {
      "name": "Shuichi Gonda",
      "pos": "gk",
      "title": "Shuichi",
      "title_es": "Shuichi"
    },
    {
      "name": "Masato Morishige",
      "pos": "def",
      "title": "Masato",
      "title_es": "Masato"
    },
    {
      "name": "Naohiro Ishikawa",
      "pos": "mid",
      "title": "Naohiro",
      "title_es": "Naohiro"
    },
    {
      "name": "Amaral",
      "pos": "st",
      "title": "King of Tokyo",
      "title_es": "Rey de Tokio"
    }
  ],
  "Nagoya Grampus": [
    {
      "name": "Seigo Narazaki",
      "pos": "gk",
      "title": "Seigo",
      "title_es": "Seigo"
    },
    {
      "name": "Maya Yoshida",
      "pos": "def",
      "title": "Maya",
      "title_es": "Maya"
    },
    {
      "name": "Dragan Stojković",
      "pos": "mid",
      "title": "Piksi",
      "title_es": "Piksi"
    },
    {
      "name": "Gary Lineker",
      "pos": "st",
      "title": "Gary",
      "title_es": "Gary"
    }
  ],
  "Kashiwa Reysol": [
    {
      "name": "Kosuke Nakamura",
      "pos": "gk",
      "title": "Kosuke",
      "title_es": "Kosuke"
    },
    {
      "name": "Hiroki Sakai",
      "pos": "def",
      "title": "Hiroki",
      "title_es": "Hiroki"
    },
    {
      "name": "Leandro Domingues",
      "pos": "mid",
      "title": "Leandro",
      "title_es": "Leandro"
    },
    {
      "name": "Michael Olunga",
      "pos": "st",
      "title": "Engineer",
      "title_es": "El Ingeniero"
    }
  ],
  "Shimizu S-Pulse": [
    {
      "name": "Masanori Sanada",
      "pos": "gk",
      "title": "Masanori",
      "title_es": "Masanori"
    },
    {
      "name": "Ryuzo Morioka",
      "pos": "def",
      "title": "Ryuzo",
      "title_es": "Ryuzo"
    },
    {
      "name": "Jungo Fujimoto",
      "pos": "mid",
      "title": "Jungo",
      "title_es": "Jungo"
    },
    {
      "name": "Shinji Okazaki",
      "pos": "st",
      "title": "Shinji",
      "title_es": "Shinji"
    }
  ],
  "Kyoto Sanga": [
    {
      "name": "Hiroki Mizuhara",
      "pos": "gk",
      "title": "Hiroki",
      "title_es": "Hiroki"
    },
    {
      "name": "Kazuki Teshima",
      "pos": "def",
      "title": "Kazuki",
      "title_es": "Kazuki"
    },
    {
      "name": "Park Ji-sung",
      "pos": "mid",
      "title": "Three-Lung Park",
      "title_es": "Tres Pulmones Park"
    },
    {
      "name": "Paulinho",
      "pos": "st",
      "title": "Paulinho",
      "title_es": "Paulinho"
    }
  ],
  "Avispa Fukuoka": [
    {
      "name": "Masaaki Kanzaki",
      "pos": "gk",
      "title": "Masaaki",
      "title_es": "Masaaki"
    },
    {
      "name": "Makoto Rindo",
      "pos": "def",
      "title": "Makoto",
      "title_es": "Makoto"
    },
    {
      "name": "Hisashi Jogo",
      "pos": "mid",
      "title": "Hisashi",
      "title_es": "Hisashi"
    },
    {
      "name": "Daisuke Ishizu",
      "pos": "st",
      "title": "Daisuke",
      "title_es": "Daisuke"
    }
  ],
  "Consadole Sapporo": [
    {
      "name": "Takanori Sugeno",
      "pos": "gk",
      "title": "Takanori",
      "title_es": "Takanori"
    },
    {
      "name": "Akito Fukumori",
      "pos": "def",
      "title": "Akito",
      "title_es": "Akito"
    },
    {
      "name": "Shinji Ono",
      "pos": "mid",
      "title": "Shinji",
      "title_es": "Shinji"
    },
    {
      "name": "Hulk",
      "pos": "st",
      "title": "Hulk",
      "title_es": "Hulk"
    }
  ],
  "Albirex Niigata": [
    {
      "name": "Masaaki Higashiguchi",
      "pos": "gk",
      "title": "Masaaki",
      "title_es": "Masaaki"
    },
    {
      "name": "Kentaro Ohi",
      "pos": "def",
      "title": "Kentaro",
      "title_es": "Kentaro"
    },
    {
      "name": "Marcio Richardes",
      "pos": "mid",
      "title": "Marcio",
      "title_es": "Marcio"
    },
    {
      "name": "Edmilson",
      "pos": "st",
      "title": "Edmilson",
      "title_es": "Edmilson"
    }
  ],
  "Sagan Tosu": [
    {
      "name": "Akihiro Hayashi",
      "pos": "gk",
      "title": "Akihiro",
      "title_es": "Akihiro"
    },
    {
      "name": "Kim Min-hyeok",
      "pos": "def",
      "title": "Min-hyeok",
      "title_es": "Min-hyeok"
    },
    {
      "name": "Daichi Kamada",
      "pos": "mid",
      "title": "Daichi",
      "title_es": "Daichi"
    },
    {
      "name": "Fernando Torres",
      "pos": "st",
      "title": "El Niño",
      "title_es": "El Niño"
    }
  ],
  "Shonan Bellmare": [
    {
      "name": "Nobuyuki Kojima",
      "pos": "gk",
      "title": "Nobuyuki",
      "title_es": "Nobuyuki"
    },
    {
      "name": "Keisuke Tsuboi",
      "pos": "def",
      "title": "Keisuke",
      "title_es": "Keisuke"
    },
    {
      "name": "Hidetoshi Nakata",
      "pos": "mid",
      "title": "Hide",
      "title_es": "Hide"
    },
    {
      "name": "Wagner Lopes",
      "pos": "st",
      "title": "Wagner",
      "title_es": "Wagner"
    }
  ],
  "Génération Foot": [
    {
      "name": "Ousmane Kane",
      "pos": "gk",
      "title": "Ousmane",
      "title_es": "Ousmane"
    },
    {
      "name": "Fallou Diagne",
      "pos": "def",
      "title": "Fallou",
      "title_es": "Fallou"
    },
    {
      "name": "Ismaïla Sarr",
      "pos": "mid",
      "title": "Ismaïla",
      "title_es": "Ismaïla"
    },
    {
      "name": "Sadio Mané",
      "pos": "st",
      "title": "Sadio",
      "title_es": "Sadio"
    }
  ],
  "ASC Jaraaf": [
    {
      "name": "Cheikh Seck",
      "pos": "gk",
      "title": "Cheikh",
      "title_es": "Cheikh"
    },
    {
      "name": "Lamine Dieng",
      "pos": "def",
      "title": "Lamine",
      "title_es": "Lamine"
    },
    {
      "name": "Victor Diagne",
      "pos": "mid",
      "title": "Victor",
      "title_es": "Victor"
    },
    {
      "name": "Ibrahima N'Diaye",
      "pos": "st",
      "title": "Ibrahima",
      "title_es": "Ibrahima"
    }
  ],
  "Teungueth FC": [
    {
      "name": "Ibrahima Niass",
      "pos": "gk",
      "title": "Ibrahima",
      "title_es": "Ibrahima"
    },
    {
      "name": "El Hadj Moutarou Baldé",
      "pos": "def",
      "title": "Moutarou",
      "title_es": "Moutarou"
    },
    {
      "name": "Gibril Sillah",
      "pos": "mid",
      "title": "Gibril",
      "title_es": "Gibril"
    },
    {
      "name": "Paul Bassène",
      "pos": "st",
      "title": "Paul",
      "title_es": "Paul"
    }
  ],
  "Casa Sports": [
    {
      "name": "Ousmane Mané",
      "pos": "gk",
      "title": "Ousmane",
      "title_es": "Ousmane"
    },
    {
      "name": "Mamadou Lamine Danfa",
      "pos": "def",
      "title": "Lamine",
      "title_es": "Lamine"
    },
    {
      "name": "Stéphane Badji",
      "pos": "mid",
      "title": "Stéphane",
      "title_es": "Stéphane"
    },
    {
      "name": "Aliou Coly",
      "pos": "st",
      "title": "Aliou",
      "title_es": "Aliou"
    }
  ],
  "Diambars": [
    {
      "name": "Alioune Cissé",
      "pos": "gk",
      "title": "Alioune",
      "title_es": "Alioune"
    },
    {
      "name": "Kara Mbodj",
      "pos": "def",
      "title": "Kara",
      "title_es": "Kara"
    },
    {
      "name": "Idrissa Gueye",
      "pos": "mid",
      "title": "Gana",
      "title_es": "Gana"
    },
    {
      "name": "Bamba Dieng",
      "pos": "st",
      "title": "Bamba",
      "title_es": "Bamba"
    }
  ],
  "Dakar Sacré-Cœur": [
    {
      "name": "Cheikh Bamba",
      "pos": "gk",
      "title": "Cheikh",
      "title_es": "Cheikh"
    },
    {
      "name": "Amadou M'Baye",
      "pos": "def",
      "title": "Amadou",
      "title_es": "Amadou"
    },
    {
      "name": "Ousseynou Cavin Diagne",
      "pos": "mid",
      "title": "Ousseynou",
      "title_es": "Ousseynou"
    },
    {
      "name": "Iliman Ndiaye",
      "pos": "st",
      "title": "Iliman",
      "title_es": "Iliman"
    }
  ],
  "AS Pikine": [
    {
      "name": "Ousmane Cissokho",
      "pos": "gk",
      "title": "Ousmane",
      "title_es": "Ousmane"
    },
    {
      "name": "Lamine Corréa",
      "pos": "def",
      "title": "Lamine",
      "title_es": "Lamine"
    },
    {
      "name": "Landing Sagna",
      "pos": "mid",
      "title": "Landing",
      "title_es": "Landing"
    },
    {
      "name": "Adama Mbaye",
      "pos": "st",
      "title": "Adama",
      "title_es": "Adama"
    }
  ],
  "Guédiawaye": [
    {
      "name": "Cheikh Fall",
      "pos": "gk",
      "title": "Cheikh",
      "title_es": "Cheikh"
    },
    {
      "name": "Vieux Sané",
      "pos": "def",
      "title": "Vieux",
      "title_es": "Vieux"
    },
    {
      "name": "Balla Diop",
      "pos": "mid",
      "title": "Balla",
      "title_es": "Balla"
    },
    {
      "name": "Cheikh Ndiaye",
      "pos": "st",
      "title": "Cheikh",
      "title_es": "Cheikh"
    }
  ],
  "Stade de Mbour": [
    {
      "name": "El Hadji Ndiaye",
      "pos": "gk",
      "title": "El Hadji",
      "title_es": "El Hadji"
    },
    {
      "name": "Fallou Diagne",
      "pos": "def",
      "title": "Fallou",
      "title_es": "Fallou"
    },
    {
      "name": "Ousmane N'Doye",
      "pos": "mid",
      "title": "Ousmane",
      "title_es": "Ousmane"
    },
    {
      "name": "Ibou Diop",
      "pos": "st",
      "title": "Ibou",
      "title_es": "Ibou"
    }
  ],
  "US Gorée": [
    {
      "name": "Tony Sylva",
      "pos": "gk",
      "title": "Tony",
      "title_es": "Tony"
    },
    {
      "name": "Oumar Cissé",
      "pos": "def",
      "title": "Oumar",
      "title_es": "Oumar"
    },
    {
      "name": "Mansour Sy",
      "pos": "mid",
      "title": "Mansour",
      "title_es": "Mansour"
    },
    {
      "name": "Raoul Diagne",
      "pos": "st",
      "title": "Raoul",
      "title_es": "Raoul"
    }
  ],
  "Ndiambour": [
    {
      "name": "Mansour Ba",
      "pos": "gk",
      "title": "Mansour",
      "title_es": "Mansour"
    },
    {
      "name": "Assane N'Diaye",
      "pos": "def",
      "title": "Assane",
      "title_es": "Assane"
    },
    {
      "name": "Salif Diao",
      "pos": "mid",
      "title": "Salif",
      "title_es": "Salif"
    },
    {
      "name": "Macoumba Kandji",
      "pos": "st",
      "title": "Macoumba",
      "title_es": "Macoumba"
    }
  ],
  "Sonacos": [
    {
      "name": "Ousmane Sy",
      "pos": "gk",
      "title": "Ousmane",
      "title_es": "Ousmane"
    },
    {
      "name": "Papa Diop",
      "pos": "def",
      "title": "Papa",
      "title_es": "Papa"
    },
    {
      "name": "Mamadou Lamine",
      "pos": "mid",
      "title": "Mamadou",
      "title_es": "Mamadou"
    },
    {
      "name": "Ibrahima Diouf",
      "pos": "st",
      "title": "Ibrahima",
      "title_es": "Ibrahima"
    }
  ],
  "Copenhagen": [
    {
      "name": "Jesper Christiansen",
      "pos": "gk",
      "title": "Jesper",
      "title_es": "Jesper"
    },
    {
      "name": "Denis Vavro",
      "pos": "def",
      "title": "Denis",
      "title_es": "Denis"
    },
    {
      "name": "Thomas Delaney",
      "pos": "mid",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Dame N'Doye",
      "pos": "st",
      "title": "Dame",
      "title_es": "Dame"
    }
  ],
  "Midtjylland": [
    {
      "name": "Jesper Hansen",
      "pos": "gk",
      "title": "Jesper",
      "title_es": "Jesper"
    },
    {
      "name": "Erik Sviatchenko",
      "pos": "def",
      "title": "Erik",
      "title_es": "Erik"
    },
    {
      "name": "Jakob Poulsen",
      "pos": "mid",
      "title": "Jakob",
      "title_es": "Jakob"
    },
    {
      "name": "Paul Onuachu",
      "pos": "st",
      "title": "Paul",
      "title_es": "Paul"
    }
  ],
  "Brøndby": [
    {
      "name": "Peter Schmeichel",
      "pos": "gk",
      "title": "The Great Dane",
      "title_es": "El Gran Danés"
    },
    {
      "name": "Daniel Agger",
      "pos": "def",
      "title": "Daniel",
      "title_es": "Daniel"
    },
    {
      "name": "Michael Laudrup",
      "pos": "mid",
      "title": "Michael",
      "title_es": "Michael"
    },
    {
      "name": "Ebbe Sand",
      "pos": "st",
      "title": "Ebbe",
      "title_es": "Ebbe"
    }
  ],
  "Nordsjælland": [
    {
      "name": "Runar Alex Runarsson",
      "pos": "gk",
      "title": "Runar",
      "title_es": "Runar"
    },
    {
      "name": "Jores Okore",
      "pos": "def",
      "title": "Jores",
      "title_es": "Jores"
    },
    {
      "name": "Mikkel Damsgaard",
      "pos": "mid",
      "title": "Mikkel",
      "title_es": "Mikkel"
    },
    {
      "name": "Marcus Ingvartsen",
      "pos": "st",
      "title": "Marcus",
      "title_es": "Marcus"
    }
  ],
  "Aarhus": [
    {
      "name": "Troels Rasmussen",
      "pos": "gk",
      "title": "Troels",
      "title_es": "Troels"
    },
    {
      "name": "Leon Andreasen",
      "pos": "def",
      "title": "Leon",
      "title_es": "Leon"
    },
    {
      "name": "Martin Jørgensen",
      "pos": "mid",
      "title": "Martin",
      "title_es": "Martin"
    },
    {
      "name": "Peter Graulund",
      "pos": "st",
      "title": "Peter",
      "title_es": "Peter"
    }
  ],
  "Randers": [
    {
      "name": "Kevin Stuhr Ellegaard",
      "pos": "gk",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "Mads Fenger",
      "pos": "def",
      "title": "Mads",
      "title_es": "Mads"
    },
    {
      "name": "Christian Keller",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Ronnie Schwartz",
      "pos": "st",
      "title": "Ronnie",
      "title_es": "Ronnie"
    }
  ],
  "Silkeborg": [
    {
      "name": "Peter Kjær",
      "pos": "gk",
      "title": "Peter",
      "title_es": "Peter"
    },
    {
      "name": "Jim Larsen",
      "pos": "def",
      "title": "Jim",
      "title_es": "Jim"
    },
    {
      "name": "Morten Bruun",
      "pos": "mid",
      "title": "Morten",
      "title_es": "Morten"
    },
    {
      "name": "Henrik Pedersen",
      "pos": "st",
      "title": "Henrik",
      "title_es": "Henrik"
    }
  ],
  "Viborg": [
    {
      "name": "Arek Onyszko",
      "pos": "gk",
      "title": "Arek",
      "title_es": "Arek"
    },
    {
      "name": "Thomas Tengstedt",
      "pos": "def",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Thomas Frandsen",
      "pos": "mid",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Søren Frederiksen",
      "pos": "st",
      "title": "Søren",
      "title_es": "Søren"
    }
  ],
  "OB": [
    {
      "name": "Thomas Sørensen",
      "pos": "gk",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Thomas Helveg",
      "pos": "def",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Christian Eriksen",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Mwape Miti",
      "pos": "st",
      "title": "Mwape",
      "title_es": "Mwape"
    }
  ],
  "Sønderjyske": [
    {
      "name": "Marin Skender",
      "pos": "gk",
      "title": "Marin",
      "title_es": "Marin"
    },
    {
      "name": "Marc Pedersen",
      "pos": "def",
      "title": "Marc",
      "title_es": "Marc"
    },
    {
      "name": "Henrik Hansen",
      "pos": "mid",
      "title": "Henrik",
      "title_es": "Henrik"
    },
    {
      "name": "Tommy Bechmann",
      "pos": "st",
      "title": "Tommy",
      "title_es": "Tommy"
    }
  ],
  "Lyngby": [
    {
      "name": "Per Wind",
      "pos": "gk",
      "title": "Per",
      "title_es": "Per"
    },
    {
      "name": "Klaus Berggreen",
      "pos": "def",
      "title": "Klaus",
      "title_es": "Klaus"
    },
    {
      "name": "Mikkel Beckmann",
      "pos": "mid",
      "title": "Mikkel",
      "title_es": "Mikkel"
    },
    {
      "name": "Yussuf Poulsen",
      "pos": "st",
      "title": "Yussuf",
      "title_es": "Yussuf"
    }
  ],
  "Vejle": [
    {
      "name": "Alex Nielsen",
      "pos": "gk",
      "title": "Alex",
      "title_es": "Alex"
    },
    {
      "name": "John Sivebæk",
      "pos": "def",
      "title": "John",
      "title_es": "John"
    },
    {
      "name": "Thomas Gravesen",
      "pos": "mid",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Allan Simonsen",
      "pos": "st",
      "title": "Allan",
      "title_es": "Allan"
    }
  ],
  "Red Bull Salzburg": [
    {
      "name": "Alexander Manninger",
      "pos": "gk",
      "title": "Alex",
      "title_es": "Alex"
    },
    {
      "name": "Martin Hinteregger",
      "pos": "def",
      "title": "Hinti",
      "title_es": "Hinti"
    },
    {
      "name": "Kevin Kampl",
      "pos": "mid",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "Jonathan Soriano",
      "pos": "st",
      "title": "El Capitán",
      "title_es": "El Capitán"
    }
  ],
  "Sturm Graz": [
    {
      "name": "Kazimierz Sidorczuk",
      "pos": "gk",
      "title": "Kazi",
      "title_es": "Kazi"
    },
    {
      "name": "Darko Milanič",
      "pos": "def",
      "title": "Darko",
      "title_es": "Darko"
    },
    {
      "name": "Ivica Vastić",
      "pos": "mid",
      "title": "Ivo",
      "title_es": "Ivo"
    },
    {
      "name": "Mario Haas",
      "pos": "st",
      "title": "Super Mario",
      "title_es": "Súper Mario"
    }
  ],
  "Rapid Wien": [
    {
      "name": "Michael Konsel",
      "pos": "gk",
      "title": "Panther",
      "title_es": "Pantera"
    },
    {
      "name": "Peter Schöttel",
      "pos": "def",
      "title": "Peter",
      "title_es": "Peter"
    },
    {
      "name": "Andreas Herzog",
      "pos": "mid",
      "title": "Andi",
      "title_es": "Andi"
    },
    {
      "name": "Hans Krankl",
      "pos": "st",
      "title": "Goleador",
      "title_es": "Goleador"
    }
  ],
  "Austria Wien": [
    {
      "name": "Franz Wohlfahrt",
      "pos": "gk",
      "title": "Franz",
      "title_es": "Franz"
    },
    {
      "name": "Robert Sara",
      "pos": "def",
      "title": "Robert",
      "title_es": "Robert"
    },
    {
      "name": "Herbert Prohaska",
      "pos": "mid",
      "title": "Schneckerl",
      "title_es": "Schneckerl"
    },
    {
      "name": "Toni Polster",
      "pos": "st",
      "title": "Toni",
      "title_es": "Toni"
    }
  ],
  "LASK": [
    {
      "name": "Alexander Schlager",
      "pos": "gk",
      "title": "Alex",
      "title_es": "Alex"
    },
    {
      "name": "Gernot Trauner",
      "pos": "def",
      "title": "Gernot",
      "title_es": "Gernot"
    },
    {
      "name": "Peter Michorl",
      "pos": "mid",
      "title": "Peter",
      "title_es": "Peter"
    },
    {
      "name": "Christian Mayrleb",
      "pos": "st",
      "title": "Morisi",
      "title_es": "Morisi"
    }
  ],
  "Wolfsberger": [
    {
      "name": "Alexander Kofler",
      "pos": "gk",
      "title": "Alex",
      "title_es": "Alex"
    },
    {
      "name": "Michael Sollbauer",
      "pos": "def",
      "title": "Michael",
      "title_es": "Michael"
    },
    {
      "name": "Michael Liendl",
      "pos": "mid",
      "title": "Michi",
      "title_es": "Michi"
    },
    {
      "name": "Shon Weissman",
      "pos": "st",
      "title": "Shon",
      "title_es": "Shon"
    }
  ],
  "Hartberg": [
    {
      "name": "René Swete",
      "pos": "gk",
      "title": "René",
      "title_es": "René"
    },
    {
      "name": "Thomas Rotter",
      "pos": "def",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Rajko Rep",
      "pos": "mid",
      "title": "Rajko",
      "title_es": "Rajko"
    },
    {
      "name": "Dario Tadić",
      "pos": "st",
      "title": "Dario",
      "title_es": "Dario"
    }
  ],
  "Austria Klagenfurt": [
    {
      "name": "Phillip Menzel",
      "pos": "gk",
      "title": "Phillip",
      "title_es": "Phillip"
    },
    {
      "name": "Thorsten Mahrer",
      "pos": "def",
      "title": "Thorsten",
      "title_es": "Thorsten"
    },
    {
      "name": "Christopher Cvetko",
      "pos": "mid",
      "title": "Christopher",
      "title_es": "Christopher"
    },
    {
      "name": "Markus Pink",
      "pos": "st",
      "title": "Markus",
      "title_es": "Markus"
    }
  ],
  "WSG Tirol": [
    {
      "name": "Ferdinand Oswald",
      "pos": "gk",
      "title": "Ferdinand",
      "title_es": "Ferdinand"
    },
    {
      "name": "David Gugganig",
      "pos": "def",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Žan Rogelj",
      "pos": "mid",
      "title": "Žan",
      "title_es": "Žan"
    },
    {
      "name": "Nikolai Baden Frederiksen",
      "pos": "st",
      "title": "Nikolai",
      "title_es": "Nikolai"
    }
  ],
  "Ried": [
    {
      "name": "Thomas Gebauer",
      "pos": "gk",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Oliver Glasner",
      "pos": "def",
      "title": "Oliver",
      "title_es": "Oliver"
    },
    {
      "name": "Marcel Ziegl",
      "pos": "mid",
      "title": "Marcel",
      "title_es": "Marcel"
    },
    {
      "name": "Hamdi Salihi",
      "pos": "st",
      "title": "Hamdi",
      "title_es": "Hamdi"
    }
  ],
  "Altach": [
    {
      "name": "Martin Kobras",
      "pos": "gk",
      "title": "Martin",
      "title_es": "Martin"
    },
    {
      "name": "Philipp Netzer",
      "pos": "def",
      "title": "Philipp",
      "title_es": "Philipp"
    },
    {
      "name": "Boris Prokopič",
      "pos": "mid",
      "title": "Boris",
      "title_es": "Boris"
    },
    {
      "name": "Hannes Aigner",
      "pos": "st",
      "title": "Hannes",
      "title_es": "Hannes"
    }
  ],
  "Blau-Weiß Linz": [
    {
      "name": "Nicolas Schmid",
      "pos": "gk",
      "title": "Nicolas",
      "title_es": "Nicolas"
    },
    {
      "name": "Fabio Strauss",
      "pos": "def",
      "title": "Fabio",
      "title_es": "Fabio"
    },
    {
      "name": "Simon Pirkl",
      "pos": "mid",
      "title": "Simon",
      "title_es": "Simon"
    },
    {
      "name": "Ronivaldo",
      "pos": "st",
      "title": "Ronivaldo",
      "title_es": "Ronivaldo"
    }
  ],
  "Shakhtar": [
    {
      "name": "Andriy Pyatov",
      "pos": "gk",
      "title": "Andriy",
      "title_es": "Andriy"
    },
    {
      "name": "Darijo Srna",
      "pos": "def",
      "title": "Captain Darijo",
      "title_es": "Capitán Darijo"
    },
    {
      "name": "Fernandinho",
      "pos": "mid",
      "title": "Ferna",
      "title_es": "Ferna"
    },
    {
      "name": "Luiz Adriano",
      "pos": "st",
      "title": "Luiz",
      "title_es": "Luiz"
    }
  ],
  "Dynamo Kyiv": [
    {
      "name": "Oleksandr Shovkovskyi",
      "pos": "gk",
      "title": "Sasho",
      "title_es": "Sasho"
    },
    {
      "name": "Oleh Luzhnyi",
      "pos": "def",
      "title": "Oleh",
      "title_es": "Oleh"
    },
    {
      "name": "Andriy Yarmolenko",
      "pos": "mid",
      "title": "Yarmolenko",
      "title_es": "Yarmolenko"
    },
    {
      "name": "Andriy Shevchenko",
      "pos": "st",
      "title": "Sheva",
      "title_es": "Sheva"
    }
  ],
  "Dnipro-1": [
    {
      "name": "Denys Boyko",
      "pos": "gk",
      "title": "Denys",
      "title_es": "Denys"
    },
    {
      "name": "Douglas",
      "pos": "def",
      "title": "Douglas",
      "title_es": "Douglas"
    },
    {
      "name": "Yevhen Konoplyanka",
      "pos": "mid",
      "title": "Kono",
      "title_es": "Kono"
    },
    {
      "name": "Yevhen Seleznyov",
      "pos": "st",
      "title": "Seleznyov",
      "title_es": "Seleznyov"
    }
  ],
  "Zorya": [
    {
      "name": "Mykyta Shevchenko",
      "pos": "gk",
      "title": "Mykyta",
      "title_es": "Mykyta"
    },
    {
      "name": "Vitaliy Vernydub",
      "pos": "def",
      "title": "Vitaliy",
      "title_es": "Vitaliy"
    },
    {
      "name": "Oleksandr Karavayev",
      "pos": "mid",
      "title": "Oleksandr",
      "title_es": "Oleksandr"
    },
    {
      "name": "Pylyp Budkivskyi",
      "pos": "st",
      "title": "Pylyp",
      "title_es": "Pylyp"
    }
  ],
  "Oleksandriya": [
    {
      "name": "Yuriy Pankiv",
      "pos": "gk",
      "title": "Yuriy",
      "title_es": "Yuriy"
    },
    {
      "name": "Anton Shendrik",
      "pos": "def",
      "title": "Anton",
      "title_es": "Anton"
    },
    {
      "name": "Vasyl Hrytsuk",
      "pos": "mid",
      "title": "Vasyl",
      "title_es": "Vasyl"
    },
    {
      "name": "Artem Sitalo",
      "pos": "st",
      "title": "Artem",
      "title_es": "Artem"
    }
  ],
  "Polissya Zhytomyr": [
    {
      "name": "Oleh Kudryk",
      "pos": "gk",
      "title": "Oleh",
      "title_es": "Oleh"
    },
    {
      "name": "Serhiy Chobotenko",
      "pos": "def",
      "title": "Serhiy",
      "title_es": "Serhiy"
    },
    {
      "name": "Bohdan Kushnirenko",
      "pos": "mid",
      "title": "Bohdan",
      "title_es": "Bohdan"
    },
    {
      "name": "Beni Makouana",
      "pos": "st",
      "title": "Beni",
      "title_es": "Beni"
    }
  ],
  "Kryvbas": [
    {
      "name": "Maksym Startsev",
      "pos": "gk",
      "title": "Maksym",
      "title_es": "Maksym"
    },
    {
      "name": "Vyacheslav Checher",
      "pos": "def",
      "title": "Vyacheslav",
      "title_es": "Vyacheslav"
    },
    {
      "name": "Ruslan Kostyshyn",
      "pos": "mid",
      "title": "Ruslan",
      "title_es": "Ruslan"
    },
    {
      "name": "Serhiy Motuz",
      "pos": "st",
      "title": "Serhiy",
      "title_es": "Serhiy"
    }
  ],
  "Kolos Kovalivka": [
    {
      "name": "Yevhen Volynets",
      "pos": "gk",
      "title": "Yevhen",
      "title_es": "Yevhen"
    },
    {
      "name": "Kyrylo Petrov",
      "pos": "def",
      "title": "Kyrylo",
      "title_es": "Kyrylo"
    },
    {
      "name": "Vadym Milko",
      "pos": "mid",
      "title": "Vadym",
      "title_es": "Vadym"
    },
    {
      "name": "Volodymyr Lysenko",
      "pos": "st",
      "title": "Volodymyr",
      "title_es": "Volodymyr"
    }
  ],
  "Vorskla Poltava": [
    {
      "name": "Serhiy Dolhanskyi",
      "pos": "gk",
      "title": "Serhiy",
      "title_es": "Serhiy"
    },
    {
      "name": "Volodymyr Chesnakov",
      "pos": "def",
      "title": "Volodymyr",
      "title_es": "Volodymyr"
    },
    {
      "name": "Jovan Markoski",
      "pos": "mid",
      "title": "Jovan",
      "title_es": "Jovan"
    },
    {
      "name": "Vasyl Sachko",
      "pos": "st",
      "title": "Vasyl",
      "title_es": "Vasyl"
    }
  ],
  "Rukh Lviv": [
    {
      "name": "Yuriy Pankiv",
      "pos": "gk",
      "title": "Yuriy",
      "title_es": "Yuriy"
    },
    {
      "name": "Roman Didyk",
      "pos": "def",
      "title": "Roman",
      "title_es": "Roman"
    },
    {
      "name": "Yuriy Klymchuk",
      "pos": "mid",
      "title": "Yuriy",
      "title_es": "Yuriy"
    },
    {
      "name": "Ilya Kvasnytsya",
      "pos": "st",
      "title": "Ilya",
      "title_es": "Ilya"
    }
  ],
  "LNZ Cherkasy": [
    {
      "name": "Kyrylo Samoylenko",
      "pos": "gk",
      "title": "Kyrylo",
      "title_es": "Kyrylo"
    },
    {
      "name": "Nazariy Muravskyi",
      "pos": "def",
      "title": "Nazariy",
      "title_es": "Nazariy"
    },
    {
      "name": "Vitaliy Boyko",
      "pos": "mid",
      "title": "Vitaliy",
      "title_es": "Vitaliy"
    },
    {
      "name": "Maksym Pryadun",
      "pos": "st",
      "title": "Maksym",
      "title_es": "Maksym"
    }
  ],
  "Veres Rivne": [
    {
      "name": "Bohdan Kohut",
      "pos": "gk",
      "title": "Bohdan",
      "title_es": "Bohdan"
    },
    {
      "name": "Roman Honcharenko",
      "pos": "def",
      "title": "Roman",
      "title_es": "Roman"
    },
    {
      "name": "Valeriy Kucherov",
      "pos": "mid",
      "title": "Valeriy",
      "title_es": "Valeriy"
    },
    {
      "name": "Mykhailo Shestakov",
      "pos": "st",
      "title": "Mykhailo",
      "title_es": "Mykhailo"
    }
  ],
  "Obolon Kyiv": [
    {
      "name": "Artem Kychak",
      "pos": "gk",
      "title": "Artem",
      "title_es": "Artem"
    },
    {
      "name": "Pavlo Lukyanchuk",
      "pos": "def",
      "title": "Pavlo",
      "title_es": "Pavlo"
    },
    {
      "name": "Oleh Slobodian",
      "pos": "mid",
      "title": "Oleh",
      "title_es": "Oleh"
    },
    {
      "name": "Ihor Krasnopir",
      "pos": "st",
      "title": "Ihor",
      "title_es": "Ihor"
    }
  ],
  "Chornomorets Odesa": [
    {
      "name": "Viktor Hryshko",
      "pos": "gk",
      "title": "Viktor",
      "title_es": "Viktor"
    },
    {
      "name": "Yuriy Nikiforov",
      "pos": "def",
      "title": "Yuriy",
      "title_es": "Yuriy"
    },
    {
      "name": "Ilya Tsymbalar",
      "pos": "mid",
      "title": "Ilya",
      "title_es": "Ilya"
    },
    {
      "name": "Ivan Hetsko",
      "pos": "st",
      "title": "Ivan",
      "title_es": "Ivan"
    }
  ],
  "Ulsan HD": [
    {
      "name": "Kim Byung-ji",
      "pos": "gk",
      "title": "Byung-ji",
      "title_es": "Byung-ji"
    },
    {
      "name": "Hong Myung-bo",
      "pos": "def",
      "title": "Eternal Libero",
      "title_es": "Libero Eterno"
    },
    {
      "name": "Yoo Sang-chul",
      "pos": "mid",
      "title": "Sang-chul",
      "title_es": "Sang-chul"
    },
    {
      "name": "Junior Negrão",
      "pos": "st",
      "title": "Junior",
      "title_es": "Junior"
    }
  ],
  "Jeonbuk": [
    {
      "name": "Kwoun Sun-tae",
      "pos": "gk",
      "title": "Sun-tae",
      "title_es": "Sun-tae"
    },
    {
      "name": "Choi Jin-cheul",
      "pos": "def",
      "title": "Jin-cheul",
      "title_es": "Jin-cheul"
    },
    {
      "name": "Lee Jae-sung",
      "pos": "mid",
      "title": "Jae-sung",
      "title_es": "Jae-sung"
    },
    {
      "name": "Lee Dong-gook",
      "pos": "st",
      "title": "Lion King",
      "title_es": "Rey León"
    }
  ],
  "FC Seoul": [
    {
      "name": "Valeri Sarychev",
      "pos": "gk",
      "title": "Shin Eui-son",
      "title_es": "Shin Eui-son"
    },
    {
      "name": "Adilson",
      "pos": "def",
      "title": "Adilson",
      "title_es": "Adilson"
    },
    {
      "name": "Ki Sung-yueng",
      "pos": "mid",
      "title": "Ki",
      "title_es": "Ki"
    },
    {
      "name": "Dejan Damjanović",
      "pos": "st",
      "title": "Dejan",
      "title_es": "Dejan"
    }
  ],
  "Pohang Steelers": [
    {
      "name": "Shin Hwa-yong",
      "pos": "gk",
      "title": "Hwa-yong",
      "title_es": "Hwa-yong"
    },
    {
      "name": "Kim Gwang-seok",
      "pos": "def",
      "title": "Gwang-seok",
      "title_es": "Gwang-seok"
    },
    {
      "name": "Hwang Jin-sung",
      "pos": "mid",
      "title": "Jin-sung",
      "title_es": "Jin-sung"
    },
    {
      "name": "Hwang Sun-hong",
      "pos": "st",
      "title": "Sun-hong",
      "title_es": "Sun-hong"
    }
  ],
  "Gimcheon Sangmu": [
    {
      "name": "Kim Dong-jun",
      "pos": "gk",
      "title": "Dong-jun",
      "title_es": "Dong-jun"
    },
    {
      "name": "Park Ji-soo",
      "pos": "def",
      "title": "Ji-soo",
      "title_es": "Ji-soo"
    },
    {
      "name": "Kwon Chang-hoon",
      "pos": "mid",
      "title": "Chang-hoon",
      "title_es": "Chang-hoon"
    },
    {
      "name": "Joo Min-kyu",
      "pos": "st",
      "title": "Min-kyu",
      "title_es": "Min-kyu"
    }
  ],
  "Gwangju FC": [
    {
      "name": "Yoon Pyeong-gook",
      "pos": "gk",
      "title": "Pyeong-gook",
      "title_es": "Pyeong-gook"
    },
    {
      "name": "Ahn Young-kyu",
      "pos": "def",
      "title": "Young-kyu",
      "title_es": "Young-kyu"
    },
    {
      "name": "Yeo Reum",
      "pos": "mid",
      "title": "Reum",
      "title_es": "Reum"
    },
    {
      "name": "Felipe",
      "pos": "st",
      "title": "Felipe",
      "title_es": "Felipe"
    }
  ],
  "Suwon Samsung": [
    {
      "name": "Lee Woon-jae",
      "pos": "gk",
      "title": "Spider Hands",
      "title_es": "Manos de Araña"
    },
    {
      "name": "Kwak Hee-ju",
      "pos": "def",
      "title": "Hee-ju",
      "title_es": "Hee-ju"
    },
    {
      "name": "Seo Jung-won",
      "pos": "mid",
      "title": "Jung-won",
      "title_es": "Jung-won"
    },
    {
      "name": "Nádson",
      "pos": "st",
      "title": "Nádson",
      "title_es": "Nádson"
    }
  ],
  "Daegu FC": [
    {
      "name": "Jo Hyeon-woo",
      "pos": "gk",
      "title": "Hyeon-woo",
      "title_es": "Hyeon-woo"
    },
    {
      "name": "Hong Jeong-woon",
      "pos": "def",
      "title": "Jeong-woon",
      "title_es": "Jeong-woon"
    },
    {
      "name": "Cesinha",
      "pos": "mid",
      "title": "Cesinha",
      "title_es": "Cesinha"
    },
    {
      "name": "Edgar",
      "pos": "st",
      "title": "Edgar",
      "title_es": "Edgar"
    }
  ],
  "Daejeon Hana Citizen": [
    {
      "name": "Choi Eun-sung",
      "pos": "gk",
      "title": "Eun-sung",
      "title_es": "Eun-sung"
    },
    {
      "name": "Lee Woong-hee",
      "pos": "def",
      "title": "Woong-hee",
      "title_es": "Woong-hee"
    },
    {
      "name": "Lee Kwan-woo",
      "pos": "mid",
      "title": "Kwan-woo",
      "title_es": "Kwan-woo"
    },
    {
      "name": "Kim Eun-jung",
      "pos": "st",
      "title": "Eun-jung",
      "title_es": "Eun-jung"
    }
  ],
  "Gangwon FC": [
    {
      "name": "Lee Bum-young",
      "pos": "gk",
      "title": "Bum-young",
      "title_es": "Bum-young"
    },
    {
      "name": "Oh Beom-seok",
      "pos": "def",
      "title": "Beom-seok",
      "title_es": "Beom-seok"
    },
    {
      "name": "Han Kook-young",
      "pos": "mid",
      "title": "Kook-young",
      "title_es": "Kook-young"
    },
    {
      "name": "Jung Jo-gook",
      "pos": "st",
      "title": "Jo-gook",
      "title_es": "Jo-gook"
    }
  ],
  "Jeju United": [
    {
      "name": "Kim Dong-jun",
      "pos": "gk",
      "title": "Dong-jun",
      "title_es": "Dong-jun"
    },
    {
      "name": "Cho Yong-hyung",
      "pos": "def",
      "title": "Yong-hyung",
      "title_es": "Yong-hyung"
    },
    {
      "name": "Koo Ja-cheol",
      "pos": "mid",
      "title": "Ja-cheol",
      "title_es": "Ja-cheol"
    },
    {
      "name": "Joo Min-kyu",
      "pos": "st",
      "title": "Min-kyu",
      "title_es": "Min-kyu"
    }
  ],
  "Incheon United": [
    {
      "name": "Lee Tae-hee",
      "pos": "gk",
      "title": "Tae-hee",
      "title_es": "Tae-hee"
    },
    {
      "name": "Lim Joong-yong",
      "pos": "def",
      "title": "Joong-yong",
      "title_es": "Joong-yong"
    },
    {
      "name": "Elias Aguilar",
      "pos": "mid",
      "title": "Elias",
      "title_es": "Elias"
    },
    {
      "name": "Stefan Mugoša",
      "pos": "st",
      "title": "Stefan",
      "title_es": "Stefan"
    }
  ],
  "LDU Quito": [
    {
      "name": "José Francisco Cevallos",
      "pos": "gk",
      "title": "Las Manos de Ecuador",
      "title_es": "Las Manos de Ecuador"
    },
    {
      "name": "Norberto Araujo",
      "pos": "def",
      "title": "El Samurai",
      "title_es": "El Samurái"
    },
    {
      "name": "Édison Méndez",
      "pos": "mid",
      "title": "Kinito",
      "title_es": "Kinito"
    },
    {
      "name": "Claudio Bieler",
      "pos": "st",
      "title": "Taca",
      "title_es": "Taca"
    }
  ],
  "Independiente del Valle": [
    {
      "name": "Moisés Ramírez",
      "pos": "gk",
      "title": "Araña",
      "title_es": "Araña"
    },
    {
      "name": "Luis Segovia",
      "pos": "def",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Cristian Pellerano",
      "pos": "mid",
      "title": "Pelle",
      "title_es": "Pelle"
    },
    {
      "name": "Junior Sornoza",
      "pos": "st",
      "title": "El Zorro",
      "title_es": "El Zorro"
    }
  ],
  "Barcelona SC": [
    {
      "name": "Carlos Luis Morales",
      "pos": "gk",
      "title": "Pestañita",
      "title_es": "Pestañita"
    },
    {
      "name": "Jimmy Montanero",
      "pos": "def",
      "title": "El Mormón",
      "title_es": "El Mormón"
    },
    {
      "name": "Damián Díaz",
      "pos": "mid",
      "title": "Kitu",
      "title_es": "Kitu"
    },
    {
      "name": "Carlos Alfaro Moreno",
      "pos": "st",
      "title": "El Beto",
      "title_es": "El Beto"
    }
  ],
  "Emelec": [
    {
      "name": "Esteban Dreer",
      "pos": "gk",
      "title": "El Rifle",
      "title_es": "El Rifle"
    },
    {
      "name": "Iván Hurtado",
      "pos": "def",
      "title": "Bam Bam",
      "title_es": "Bam Bam"
    },
    {
      "name": "Ángel Mena",
      "pos": "mid",
      "title": "El Ángel",
      "title_es": "El Ángel"
    },
    {
      "name": "Carlos Juárez",
      "pos": "st",
      "title": "El Cuqui",
      "title_es": "El Cuqui"
    }
  ],
  "Aucas": [
    {
      "name": "Damián Frascarelli",
      "pos": "gk",
      "title": "Damián",
      "title_es": "Damián"
    },
    {
      "name": "Luis Romero",
      "pos": "def",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Jhonny Quiñónez",
      "pos": "mid",
      "title": "Jhonny",
      "title_es": "Jhonny"
    },
    {
      "name": "Francisco Fydriszewski",
      "pos": "st",
      "title": "Polaco",
      "title_es": "Polaco"
    }
  ],
  "Universidad Católica Quito": [
    {
      "name": "Hernán Galíndez",
      "pos": "gk",
      "title": "El Gordo",
      "title_es": "El Gordo"
    },
    {
      "name": "Yúber Mosquera",
      "pos": "def",
      "title": "Yúber",
      "title_es": "Yúber"
    },
    {
      "name": "Facundo Martínez",
      "pos": "mid",
      "title": "Facu",
      "title_es": "Facu"
    },
    {
      "name": "Jhon Cifuente",
      "pos": "st",
      "title": "JJ",
      "title_es": "JJ"
    }
  ],
  "Delfín": [
    {
      "name": "Pedro Ortiz",
      "pos": "gk",
      "title": "El Candado",
      "title_es": "El Candado"
    },
    {
      "name": "Williams Riveros",
      "pos": "def",
      "title": "Williams",
      "title_es": "Williams"
    },
    {
      "name": "Bruno Piñatares",
      "pos": "mid",
      "title": "Bruno",
      "title_es": "Bruno"
    },
    {
      "name": "Carlos Garcés",
      "pos": "st",
      "title": "Carlitos",
      "title_es": "Carlitos"
    }
  ],
  "Deportivo Cuenca": [
    {
      "name": "Brian Heras",
      "pos": "gk",
      "title": "Brian",
      "title_es": "Brian"
    },
    {
      "name": "Brian Cucco",
      "pos": "def",
      "title": "Brian",
      "title_es": "Brian"
    },
    {
      "name": "Lucas Mancinelli",
      "pos": "mid",
      "title": "Lucas",
      "title_es": "Lucas"
    },
    {
      "name": "Raúl Becerra",
      "pos": "st",
      "title": "Raúl",
      "title_es": "Raúl"
    }
  ],
  "Técnico Universitario": [
    {
      "name": "Walter Chávez",
      "pos": "gk",
      "title": "Walter",
      "title_es": "Walter"
    },
    {
      "name": "Eddie Guevara",
      "pos": "def",
      "title": "Eddie",
      "title_es": "Eddie"
    },
    {
      "name": "Charles Vélez",
      "pos": "mid",
      "title": "Charles",
      "title_es": "Charles"
    },
    {
      "name": "Diego Armas",
      "pos": "st",
      "title": "Diego",
      "title_es": "Diego"
    }
  ],
  "Orense": [
    {
      "name": "Rolando Silva",
      "pos": "gk",
      "title": "Rolando",
      "title_es": "Rolando"
    },
    {
      "name": "Gabriel Achilier",
      "pos": "def",
      "title": "El Diablo",
      "title_es": "El Diablo"
    },
    {
      "name": "Sebastián Assis",
      "pos": "mid",
      "title": "Sebastián",
      "title_es": "Sebastián"
    },
    {
      "name": "José Miguel Andrade",
      "pos": "st",
      "title": "José",
      "title_es": "José"
    }
  ],
  "Macará": [
    {
      "name": "Javier Burrai",
      "pos": "gk",
      "title": "Javier",
      "title_es": "Javier"
    },
    {
      "name": "Moisés Corozo",
      "pos": "def",
      "title": "Moisés",
      "title_es": "Moisés"
    },
    {
      "name": "Carlos Feraud",
      "pos": "mid",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Juan Manuel Tévez",
      "pos": "st",
      "title": "Búfalo",
      "title_es": "Búfalo"
    }
  ],
  "Mushuc Runa": [
    {
      "name": "Iván Brun",
      "pos": "gk",
      "title": "Iván",
      "title_es": "Iván"
    },
    {
      "name": "Darwin Quilumba",
      "pos": "def",
      "title": "Darwin",
      "title_es": "Darwin"
    },
    {
      "name": "Marco Mosquera",
      "pos": "mid",
      "title": "Marco",
      "title_es": "Marco"
    },
    {
      "name": "Jonatan Bauman",
      "pos": "st",
      "title": "Jony",
      "title_es": "Jony"
    }
  ],
  "Sydney FC": [
    {
      "name": "Andrew Redmayne",
      "pos": "gk",
      "title": "Redders",
      "title_es": "Redders"
    },
    {
      "name": "Alex Wilkinson",
      "pos": "def",
      "title": "Wilko",
      "title_es": "Wilko"
    },
    {
      "name": "Miloš Ninković",
      "pos": "mid",
      "title": "Ninko",
      "title_es": "Ninko"
    },
    {
      "name": "Alessandro Del Piero",
      "pos": "st",
      "title": "Pinturicchio",
      "title_es": "Pinturicchio"
    }
  ],
  "Melbourne City": [
    {
      "name": "Thomas Sørensen",
      "pos": "gk",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Curtis Good",
      "pos": "def",
      "title": "Curtis",
      "title_es": "Curtis"
    },
    {
      "name": "Aaron Mooy",
      "pos": "mid",
      "title": "Aaron",
      "title_es": "Aaron"
    },
    {
      "name": "Jamie Maclaren",
      "pos": "st",
      "title": "J-Mac",
      "title_es": "J-Mac"
    }
  ],
  "Melbourne Victory": [
    {
      "name": "Lawrence Thomas",
      "pos": "gk",
      "title": "Lozza",
      "title_es": "Lozza"
    },
    {
      "name": "Kevin Muscat",
      "pos": "def",
      "title": "Muscy",
      "title_es": "Muscy"
    },
    {
      "name": "Mark Milligan",
      "pos": "mid",
      "title": "Millsy",
      "title_es": "Millsy"
    },
    {
      "name": "Archie Thompson",
      "pos": "st",
      "title": "Archie",
      "title_es": "Archie"
    }
  ],
  "Central Coast Mariners": [
    {
      "name": "Mathew Ryan",
      "pos": "gk",
      "title": "Maty",
      "title_es": "Maty"
    },
    {
      "name": "Trent Sainsbury",
      "pos": "def",
      "title": "Trent",
      "title_es": "Trent"
    },
    {
      "name": "Mile Jedinak",
      "pos": "mid",
      "title": "Jedi",
      "title_es": "Jedi"
    },
    {
      "name": "Matt Simon",
      "pos": "st",
      "title": "Matty",
      "title_es": "Matty"
    }
  ],
  "Western Sydney": [
    {
      "name": "Ante Covic",
      "pos": "gk",
      "title": "Ante",
      "title_es": "Ante"
    },
    {
      "name": "Nikolai Topor-Stanley",
      "pos": "def",
      "title": "Toppa",
      "title_es": "Toppa"
    },
    {
      "name": "Shinji Ono",
      "pos": "mid",
      "title": "Tensai",
      "title_es": "Tensai"
    },
    {
      "name": "Brendon Šantalab",
      "pos": "st",
      "title": "Santa",
      "title_es": "Santa"
    }
  ],
  "Adelaide United": [
    {
      "name": "Eugene Galekovic",
      "pos": "gk",
      "title": "Euge",
      "title_es": "Euge"
    },
    {
      "name": "Michael Marrone",
      "pos": "def",
      "title": "Mickey",
      "title_es": "Mickey"
    },
    {
      "name": "Isaias",
      "pos": "mid",
      "title": "Isaias",
      "title_es": "Isaias"
    },
    {
      "name": "Craig Goodwin",
      "pos": "st",
      "title": "Goody",
      "title_es": "Goody"
    }
  ],
  "Wellington Phoenix": [
    {
      "name": "Glen Moss",
      "pos": "gk",
      "title": "Mossy",
      "title_es": "Mossy"
    },
    {
      "name": "Andrew Durante",
      "pos": "def",
      "title": "Dura",
      "title_es": "Dura"
    },
    {
      "name": "Ulises Dávila",
      "pos": "mid",
      "title": "Uli",
      "title_es": "Uli"
    },
    {
      "name": "Roy Krishna",
      "pos": "st",
      "title": "Roy",
      "title_es": "Roy"
    }
  ],
  "Brisbane Roar": [
    {
      "name": "Michael Theo",
      "pos": "gk",
      "title": "Theo",
      "title_es": "Theo"
    },
    {
      "name": "Matt Smith",
      "pos": "def",
      "title": "Smudge",
      "title_es": "Smudge"
    },
    {
      "name": "Thomas Broich",
      "pos": "mid",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Besart Berisha",
      "pos": "st",
      "title": "Besart",
      "title_es": "Besart"
    }
  ],
  "Newcastle Jets": [
    {
      "name": "Ben Kennedy",
      "pos": "gk",
      "title": "BK",
      "title_es": "BK"
    },
    {
      "name": "Nigel Boogaard",
      "pos": "def",
      "title": "Nigel",
      "title_es": "Nigel"
    },
    {
      "name": "Ronald Vargas",
      "pos": "mid",
      "title": "Ronny",
      "title_es": "Ronny"
    },
    {
      "name": "Joel Griffiths",
      "pos": "st",
      "title": "Joel",
      "title_es": "Joel"
    }
  ],
  "Macarthur FC": [
    {
      "name": "Adam Federici",
      "pos": "gk",
      "title": "Feds",
      "title_es": "Feds"
    },
    {
      "name": "Aleksandar Šušnjar",
      "pos": "def",
      "title": "Aleks",
      "title_es": "Aleks"
    },
    {
      "name": "Ulises Dávila",
      "pos": "mid",
      "title": "Uli",
      "title_es": "Uli"
    },
    {
      "name": "Matt Derbyshire",
      "pos": "st",
      "title": "Matt",
      "title_es": "Matt"
    }
  ],
  "Perth Glory": [
    {
      "name": "Liam Reddy",
      "pos": "gk",
      "title": "Rocket",
      "title_es": "Cohete"
    },
    {
      "name": "Dino Djulbic",
      "pos": "def",
      "title": "Dino",
      "title_es": "Dino"
    },
    {
      "name": "Diego Castro",
      "pos": "mid",
      "title": "El Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "Andy Keogh",
      "pos": "st",
      "title": "Andy",
      "title_es": "Andy"
    }
  ],
  "Western United": [
    {
      "name": "Filip Kurto",
      "pos": "gk",
      "title": "Filip",
      "title_es": "Filip"
    },
    {
      "name": "Josh Risdon",
      "pos": "def",
      "title": "Rizzo",
      "title_es": "Rizzo"
    },
    {
      "name": "Alessandro Diamanti",
      "pos": "mid",
      "title": "Alino",
      "title_es": "Alino"
    },
    {
      "name": "Besart Berisha",
      "pos": "st",
      "title": "Besart",
      "title_es": "Besart"
    }
  ],
  "Galatasaray": [
    {
      "name": "Fernando Muslera",
      "pos": "gk",
      "title": "Nando",
      "title_es": "Nando"
    },
    {
      "name": "Bülent Korkmaz",
      "pos": "def",
      "title": "Büyük Kaptan",
      "title_es": "El Gran Capitán"
    },
    {
      "name": "Gheorghe Hagi",
      "pos": "mid",
      "title": "Comandante",
      "title_es": "Comandante"
    },
    {
      "name": "Metin Oktay",
      "pos": "st",
      "title": "Taçsız Kral",
      "title_es": "El Rey Sin Corona"
    }
  ],
  "Fenerbahçe": [
    {
      "name": "Volkan Demirel",
      "pos": "gk",
      "title": "Volkan",
      "title_es": "Volkan"
    },
    {
      "name": "Diego Lugano",
      "pos": "def",
      "title": "Tota",
      "title_es": "Tota"
    },
    {
      "name": "Alex de Souza",
      "pos": "mid",
      "title": "Kral",
      "title_es": "Rey"
    },
    {
      "name": "Lefter Küçükandonyadis",
      "pos": "st",
      "title": "Ordinaryüs",
      "title_es": "Ordinaryüs"
    }
  ],
  "Beşiktaş": [
    {
      "name": "Óscar Córdoba",
      "pos": "gk",
      "title": "Óscar",
      "title_es": "Óscar"
    },
    {
      "name": "Gökhan Keskin",
      "pos": "def",
      "title": "Gökhan",
      "title_es": "Gökhan"
    },
    {
      "name": "Sergen Yalçın",
      "pos": "mid",
      "title": "Sergen",
      "title_es": "Sergen"
    },
    {
      "name": "Hakkı Yeten",
      "pos": "st",
      "title": "Baba Hakkı",
      "title_es": "Baba Hakkı"
    }
  ],
  "Trabzonspor": [
    {
      "name": "Uğurcan Çakır",
      "pos": "gk",
      "title": "Uğurcan",
      "title_es": "Uğurcan"
    },
    {
      "name": "Egemen Korkmaz",
      "pos": "def",
      "title": "Egemen",
      "title_es": "Egemen"
    },
    {
      "name": "Hami Mandıralı",
      "pos": "mid",
      "title": "Hami",
      "title_es": "Hami"
    },
    {
      "name": "Fatih Tekke",
      "pos": "st",
      "title": "Sultan",
      "title_es": "Sultan"
    }
  ],
  "Başakşehir": [
    {
      "name": "Volkan Babacan",
      "pos": "gk",
      "title": "Volkan",
      "title_es": "Volkan"
    },
    {
      "name": "Alexandru Epureanu",
      "pos": "def",
      "title": "Alex",
      "title_es": "Alex"
    },
    {
      "name": "Edin Višća",
      "pos": "mid",
      "title": "Edin",
      "title_es": "Edin"
    },
    {
      "name": "Emmanuel Adebayor",
      "pos": "st",
      "title": "Adebayor",
      "title_es": "Adebayor"
    }
  ],
  "Samsunspor": [
    {
      "name": "Göksel Gencer",
      "pos": "gk",
      "title": "Göksel",
      "title_es": "Göksel"
    },
    {
      "name": "Ercan Koloğlu",
      "pos": "def",
      "title": "Ercan",
      "title_es": "Ercan"
    },
    {
      "name": "Celil Sağır",
      "pos": "mid",
      "title": "Celil",
      "title_es": "Celil"
    },
    {
      "name": "Serkan Aykut",
      "pos": "st",
      "title": "Serkan",
      "title_es": "Serkan"
    }
  ],
  "Göztepe": [
    {
      "name": "Beto",
      "pos": "gk",
      "title": "Beto",
      "title_es": "Beto"
    },
    {
      "name": "Titi",
      "pos": "def",
      "title": "Titi",
      "title_es": "Titi"
    },
    {
      "name": "Gürsel Aksel",
      "pos": "mid",
      "title": "Gürsel",
      "title_es": "Gürsel"
    },
    {
      "name": "Fevzi Zemzem",
      "pos": "st",
      "title": "Buldozer",
      "title_es": "Buldozer"
    }
  ],
  "Konyaspor": [
    {
      "name": "Serkan Kırıntılı",
      "pos": "gk",
      "title": "Serkan",
      "title_es": "Serkan"
    },
    {
      "name": "Ali Turan",
      "pos": "def",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Amir Hadžiahmetović",
      "pos": "mid",
      "title": "Amir",
      "title_es": "Amir"
    },
    {
      "name": "Riad Bajić",
      "pos": "st",
      "title": "Riad",
      "title_es": "Riad"
    }
  ],
  "Rizespor": [
    {
      "name": "Gökhan Akkan",
      "pos": "gk",
      "title": "Gökhan",
      "title_es": "Gökhan"
    },
    {
      "name": "Koray Altınay",
      "pos": "def",
      "title": "Koray",
      "title_es": "Koray"
    },
    {
      "name": "Fernando Boldrin",
      "pos": "mid",
      "title": "Boldrin",
      "title_es": "Boldrin"
    },
    {
      "name": "Léonard Kweuke",
      "pos": "st",
      "title": "Léonard",
      "title_es": "Léonard"
    }
  ],
  "Antalyaspor": [
    {
      "name": "Ruud Boffin",
      "pos": "gk",
      "title": "Ruud",
      "title_es": "Ruud"
    },
    {
      "name": "Diego Ângelo",
      "pos": "def",
      "title": "Diego",
      "title_es": "Diego"
    },
    {
      "name": "Hakan Özmert",
      "pos": "mid",
      "title": "Hakan",
      "title_es": "Hakan"
    },
    {
      "name": "Samuel Eto'o",
      "pos": "st",
      "title": "Eto'o",
      "title_es": "Eto'o"
    }
  ],
  "Kasımpaşa": [
    {
      "name": "Ramazan Köse",
      "pos": "gk",
      "title": "Ramazan",
      "title_es": "Ramazan"
    },
    {
      "name": "Ryan Donk",
      "pos": "def",
      "title": "Ryan",
      "title_es": "Ryan"
    },
    {
      "name": "André Castro",
      "pos": "mid",
      "title": "André",
      "title_es": "André"
    },
    {
      "name": "Kalu Uche",
      "pos": "st",
      "title": "Kalu",
      "title_es": "Kalu"
    }
  ],
  "Sivasspor": [
    {
      "name": "Mamadou Samassa",
      "pos": "gk",
      "title": "Mamadou",
      "title_es": "Mamadou"
    },
    {
      "name": "Ziya Erdal",
      "pos": "def",
      "title": "Ziya",
      "title_es": "Ziya"
    },
    {
      "name": "Aatif Chahechouhe",
      "pos": "mid",
      "title": "Aatif",
      "title_es": "Aatif"
    },
    {
      "name": "Mehmet Yıldız",
      "pos": "st",
      "title": "Mehmet",
      "title_es": "Mehmet"
    }
  ],
  "Eyüpspor": [
    {
      "name": "Harun Tekin",
      "pos": "gk",
      "title": "Harun",
      "title_es": "Harun"
    },
    {
      "name": "Uğur Demirok",
      "pos": "def",
      "title": "Uğur",
      "title_es": "Uğur"
    },
    {
      "name": "Ryan Babel",
      "pos": "mid",
      "title": "Ryan",
      "title_es": "Ryan"
    },
    {
      "name": "Gianni Bruno",
      "pos": "st",
      "title": "Gianni",
      "title_es": "Gianni"
    }
  ],
  "Adana Demirspor": [
    {
      "name": "Arijanet Muric",
      "pos": "gk",
      "title": "Arijanet",
      "title_es": "Arijanet"
    },
    {
      "name": "Samet Akaydin",
      "pos": "def",
      "title": "Samet",
      "title_es": "Samet"
    },
    {
      "name": "Younès Belhanda",
      "pos": "mid",
      "title": "Younès",
      "title_es": "Younès"
    },
    {
      "name": "Mario Balotelli",
      "pos": "st",
      "title": "Super Mario",
      "title_es": "Súper Mario"
    }
  ],
  "Alanyaspor": [
    {
      "name": "José Marafona",
      "pos": "gk",
      "title": "Marafona",
      "title_es": "Marafona"
    },
    {
      "name": "Fabrice N'Sakala",
      "pos": "def",
      "title": "Fabrice",
      "title_es": "Fabrice"
    },
    {
      "name": "Efecan Karaca",
      "pos": "mid",
      "title": "Efecan",
      "title_es": "Efecan"
    },
    {
      "name": "Papiss Cissé",
      "pos": "st",
      "title": "Papiss",
      "title_es": "Papiss"
    }
  ],
  "Gaziantep": [
    {
      "name": "Günay Güvenç",
      "pos": "gk",
      "title": "Günay",
      "title_es": "Günay"
    },
    {
      "name": "Papy Djilobodji",
      "pos": "def",
      "title": "Papy",
      "title_es": "Papy"
    },
    {
      "name": "Alexandru Maxim",
      "pos": "mid",
      "title": "Alex",
      "title_es": "Alex"
    },
    {
      "name": "João Figueiredo",
      "pos": "st",
      "title": "João",
      "title_es": "João"
    }
  ],
  "Kayserispor": [
    {
      "name": "Silviu Lung Jr.",
      "pos": "gk",
      "title": "Silviu",
      "title_es": "Silviu"
    },
    {
      "name": "Jean-Armel Kana-Biyik",
      "pos": "def",
      "title": "Jean-Armel",
      "title_es": "Jean-Armel"
    },
    {
      "name": "Deniz Türüç",
      "pos": "mid",
      "title": "Deniz",
      "title_es": "Deniz"
    },
    {
      "name": "Umut Bulut",
      "pos": "st",
      "title": "Umut",
      "title_es": "Umut"
    }
  ],
  "Gençlerbirliği": [
    {
      "name": "Johannes Hopf",
      "pos": "gk",
      "title": "Johannes",
      "title_es": "Johannes"
    },
    {
      "name": "Ahmet Çalık",
      "pos": "def",
      "title": "Ahmet",
      "title_es": "Ahmet"
    },
    {
      "name": "Stéphane Sessègnon",
      "pos": "mid",
      "title": "Stéphane",
      "title_es": "Stéphane"
    },
    {
      "name": "Bogdan Stancu",
      "pos": "st",
      "title": "Bogdan",
      "title_es": "Bogdan"
    }
  ],
  "Malmö FF": [
    {
      "name": "Johan Dahlin",
      "pos": "gk",
      "title": "Johan",
      "title_es": "Johan"
    },
    {
      "name": "Pontus Jansson",
      "pos": "def",
      "title": "Pontus",
      "title_es": "Pontus"
    },
    {
      "name": "Anders Christiansen",
      "pos": "mid",
      "title": "AC",
      "title_es": "AC"
    },
    {
      "name": "Markus Rosenberg",
      "pos": "st",
      "title": "Mackan",
      "title_es": "Mackan"
    }
  ],
  "Hammarby": [
    {
      "name": "Johannes Hopf",
      "pos": "gk",
      "title": "Johannes",
      "title_es": "Johannes"
    },
    {
      "name": "Björn Paulsen",
      "pos": "def",
      "title": "Björn",
      "title_es": "Björn"
    },
    {
      "name": "Kennedy Bakircioglu",
      "pos": "mid",
      "title": "Kennedy",
      "title_es": "Kennedy"
    },
    {
      "name": "Nahir Besara",
      "pos": "st",
      "title": "Nahir",
      "title_es": "Nahir"
    }
  ],
  "Djurgården": [
    {
      "name": "Andreas Isaksson",
      "pos": "gk",
      "title": "Isak",
      "title_es": "Isak"
    },
    {
      "name": "Marcus Danielson",
      "pos": "def",
      "title": "Marcus",
      "title_es": "Marcus"
    },
    {
      "name": "Kim Källström",
      "pos": "mid",
      "title": "Kim",
      "title_es": "Kim"
    },
    {
      "name": "Tobias Hysén",
      "pos": "st",
      "title": "Tobias",
      "title_es": "Tobias"
    }
  ],
  "AIK": [
    {
      "name": "Ivan Turina",
      "pos": "gk",
      "title": "Ivan",
      "title_es": "Ivan"
    },
    {
      "name": "Per Karlsson",
      "pos": "def",
      "title": "Pertan",
      "title_es": "Pertan"
    },
    {
      "name": "Sebastian Larsson",
      "pos": "mid",
      "title": "Seb",
      "title_es": "Seb"
    },
    {
      "name": "Henok Goitom",
      "pos": "st",
      "title": "Henok",
      "title_es": "Henok"
    }
  ],
  "Elfsborg": [
    {
      "name": "Kevin Stuhr Ellegaard",
      "pos": "gk",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "Johan Larsson",
      "pos": "def",
      "title": "Johan",
      "title_es": "Johan"
    },
    {
      "name": "Anders Svensson",
      "pos": "mid",
      "title": "Taco",
      "title_es": "Taco"
    },
    {
      "name": "Lasse Nilsson",
      "pos": "st",
      "title": "Lasse",
      "title_es": "Lasse"
    }
  ],
  "Häcken": [
    {
      "name": "Peter Abrahamsson",
      "pos": "gk",
      "title": "Peter",
      "title_es": "Peter"
    },
    {
      "name": "Simon Sandberg",
      "pos": "def",
      "title": "Simon",
      "title_es": "Simon"
    },
    {
      "name": "Martin Ericsson",
      "pos": "mid",
      "title": "Martin",
      "title_es": "Martin"
    },
    {
      "name": "Alexander Jeremejeff",
      "pos": "st",
      "title": "Alexander",
      "title_es": "Alexander"
    }
  ],
  "Norrköping": [
    {
      "name": "Isak Pettersson",
      "pos": "gk",
      "title": "Isak",
      "title_es": "Isak"
    },
    {
      "name": "Andreas Johansson",
      "pos": "def",
      "title": "Ante",
      "title_es": "Ante"
    },
    {
      "name": "Simon Thern",
      "pos": "mid",
      "title": "Simon",
      "title_es": "Simon"
    },
    {
      "name": "Christoffer Nyman",
      "pos": "st",
      "title": "Totte",
      "title_es": "Totte"
    }
  ],
  "IFK Göteborg": [
    {
      "name": "Thomas Ravelli",
      "pos": "gk",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Glenn Hysén",
      "pos": "def",
      "title": "Glenn",
      "title_es": "Glenn"
    },
    {
      "name": "Pontus Wernbloom",
      "pos": "mid",
      "title": "Pontus",
      "title_es": "Pontus"
    },
    {
      "name": "Marcus Berg",
      "pos": "st",
      "title": "Marcus",
      "title_es": "Marcus"
    }
  ],
  "GAIS": [
    {
      "name": "Dime Jankulovski",
      "pos": "gk",
      "title": "Dime",
      "title_es": "Dime"
    },
    {
      "name": "Richard Spong",
      "pos": "def",
      "title": "Richard",
      "title_es": "Richard"
    },
    {
      "name": "Wanderson do Carmo",
      "pos": "mid",
      "title": "Wanderson",
      "title_es": "Wanderson"
    },
    {
      "name": "Mervan Çelik",
      "pos": "st",
      "title": "Mervan",
      "title_es": "Mervan"
    }
  ],
  "Sirius": [
    {
      "name": "Lukas Jonsson",
      "pos": "gk",
      "title": "Lukas",
      "title_es": "Lukas"
    },
    {
      "name": "Tim Björkström",
      "pos": "def",
      "title": "Tim",
      "title_es": "Tim"
    },
    {
      "name": "Yukiya Sugita",
      "pos": "mid",
      "title": "Sugi",
      "title_es": "Sugi"
    },
    {
      "name": "Christian Kouakou",
      "pos": "st",
      "title": "Christian",
      "title_es": "Christian"
    }
  ],
  "Brommapojkarna": [
    {
      "name": "Kristoffer Nordfeldt",
      "pos": "gk",
      "title": "Kristoffer",
      "title_es": "Kristoffer"
    },
    {
      "name": "Jacob Une Larsson",
      "pos": "def",
      "title": "Jacob",
      "title_es": "Jacob"
    },
    {
      "name": "Bojan Djordjic",
      "pos": "mid",
      "title": "Bojan",
      "title_es": "Bojan"
    },
    {
      "name": "Jack Lahne",
      "pos": "st",
      "title": "Jack",
      "title_es": "Jack"
    }
  ],
  "Värnamo": [
    {
      "name": "Pilip Vaitsiakhovich",
      "pos": "gk",
      "title": "Pilip",
      "title_es": "Pilip"
    },
    {
      "name": "Victor Eriksson",
      "pos": "def",
      "title": "Victor",
      "title_es": "Victor"
    },
    {
      "name": "Oscar Johansson",
      "pos": "mid",
      "title": "Oscar",
      "title_es": "Oscar"
    },
    {
      "name": "Marcus Antonsson",
      "pos": "st",
      "title": "Marcus",
      "title_es": "Marcus"
    }
  ],
  "Halmstad": [
    {
      "name": "Håkan Svensson",
      "pos": "gk",
      "title": "Håkan",
      "title_es": "Håkan"
    },
    {
      "name": "Tommy Jönsson",
      "pos": "def",
      "title": "Tommy",
      "title_es": "Tommy"
    },
    {
      "name": "Fredrik Ljungberg",
      "pos": "mid",
      "title": "Freddie",
      "title_es": "Freddie"
    },
    {
      "name": "Mikael Boman",
      "pos": "st",
      "title": "Mikael",
      "title_es": "Mikael"
    }
  ],
  "Öster": [
    {
      "name": "Björn Stringheim",
      "pos": "gk",
      "title": "Björn",
      "title_es": "Björn"
    },
    {
      "name": "Karl-Gunnar Björklund",
      "pos": "def",
      "title": "Karl-Gunnar",
      "title_es": "Karl-Gunnar"
    },
    {
      "name": "Tommy Evesson",
      "pos": "mid",
      "title": "Tommy",
      "title_es": "Tommy"
    },
    {
      "name": "Harry Bild",
      "pos": "st",
      "title": "Harry",
      "title_es": "Harry"
    }
  ],
  "The New Saints": [
    {
      "name": "Paul Harrison",
      "pos": "gk",
      "title": "Harrison",
      "title_es": "Harrison"
    },
    {
      "name": "Phil Baker",
      "pos": "def",
      "title": "Baker",
      "title_es": "Baker"
    },
    {
      "name": "Aeron Edwards",
      "pos": "mid",
      "title": "Edwards",
      "title_es": "Edwards"
    },
    {
      "name": "Greg Draper",
      "pos": "st",
      "title": "Draper",
      "title_es": "Draper"
    }
  ],
  "Connah's Quay": [
    {
      "name": "John Danby",
      "pos": "gk",
      "title": "Danby",
      "title_es": "Danby"
    },
    {
      "name": "George Horan",
      "pos": "def",
      "title": "Horan",
      "title_es": "Horan"
    },
    {
      "name": "Callum Morris",
      "pos": "mid",
      "title": "Morris",
      "title_es": "Morris"
    },
    {
      "name": "Michael Wilde",
      "pos": "st",
      "title": "Wilde",
      "title_es": "Wilde"
    }
  ],
  "Penybont": [
    {
      "name": "Rhys Wilson",
      "pos": "gk",
      "title": "Wilson",
      "title_es": "Wilson"
    },
    {
      "name": "Kane Owen",
      "pos": "def",
      "title": "Owen",
      "title_es": "Owen"
    },
    {
      "name": "Kostya Georgievsky",
      "pos": "mid",
      "title": "Kostya",
      "title_es": "Kostya"
    },
    {
      "name": "Nathan Wood",
      "pos": "st",
      "title": "Wood",
      "title_es": "Wood"
    }
  ],
  "Bala Town": [
    {
      "name": "Ashley Morris",
      "pos": "gk",
      "title": "Morris",
      "title_es": "Morris"
    },
    {
      "name": "Stuart Jones",
      "pos": "def",
      "title": "Jones",
      "title_es": "Jones"
    },
    {
      "name": "Chris Venables",
      "pos": "mid",
      "title": "Venables",
      "title_es": "Venables"
    },
    {
      "name": "Lee Hunt",
      "pos": "st",
      "title": "Hunt",
      "title_es": "Hunt"
    }
  ],
  "Cardiff MU": [
    {
      "name": "Will Fuller",
      "pos": "gk",
      "title": "Fuller",
      "title_es": "Fuller"
    },
    {
      "name": "Bradley Woolridge",
      "pos": "def",
      "title": "Woolridge",
      "title_es": "Woolridge"
    },
    {
      "name": "Eliot Evans",
      "pos": "mid",
      "title": "Evans",
      "title_es": "Evans"
    },
    {
      "name": "Adam Roscrow",
      "pos": "st",
      "title": "Roscrow",
      "title_es": "Roscrow"
    }
  ],
  "Caernarfon": [
    {
      "name": "Alex Ramsay",
      "pos": "gk",
      "title": "Ramsay",
      "title_es": "Ramsay"
    },
    {
      "name": "Gareth Edwards",
      "pos": "def",
      "title": "Edwards",
      "title_es": "Edwards"
    },
    {
      "name": "Darren Thomas",
      "pos": "mid",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Jamie Breese",
      "pos": "st",
      "title": "Breese",
      "title_es": "Breese"
    }
  ],
  "Newtown": [
    {
      "name": "Dave Jones",
      "pos": "gk",
      "title": "Jones",
      "title_es": "Jones"
    },
    {
      "name": "Kieran Mills-Evans",
      "pos": "def",
      "title": "Mills-Evans",
      "title_es": "Mills-Evans"
    },
    {
      "name": "Craig Williams",
      "pos": "mid",
      "title": "Williams",
      "title_es": "Williams"
    },
    {
      "name": "Jason Oswell",
      "pos": "st",
      "title": "Oswell",
      "title_es": "Oswell"
    }
  ],
  "Barry Town": [
    {
      "name": "Mike Lewis",
      "pos": "gk",
      "title": "Lewis",
      "title_es": "Lewis"
    },
    {
      "name": "Luke Cooper",
      "pos": "def",
      "title": "Cooper",
      "title_es": "Cooper"
    },
    {
      "name": "Jordan Cotterill",
      "pos": "mid",
      "title": "Cotterill",
      "title_es": "Cotterill"
    },
    {
      "name": "Kayne McLaggon",
      "pos": "st",
      "title": "McLaggon",
      "title_es": "McLaggon"
    }
  ],
  "Haverfordwest": [
    {
      "name": "Lee Idzi",
      "pos": "gk",
      "title": "Idzi",
      "title_es": "Idzi"
    },
    {
      "name": "Ricky Watts",
      "pos": "def",
      "title": "Watts",
      "title_es": "Watts"
    },
    {
      "name": "Elliot Scotcher",
      "pos": "mid",
      "title": "Scotcher",
      "title_es": "Scotcher"
    },
    {
      "name": "Jack Wilson",
      "pos": "st",
      "title": "Wilson",
      "title_es": "Wilson"
    }
  ],
  "Flint Town": [
    {
      "name": "Aaron Jones",
      "pos": "gk",
      "title": "Jones",
      "title_es": "Jones"
    },
    {
      "name": "Ben Nash",
      "pos": "def",
      "title": "Nash",
      "title_es": "Nash"
    },
    {
      "name": "Callum Bratley",
      "pos": "mid",
      "title": "Bratley",
      "title_es": "Bratley"
    },
    {
      "name": "Mark Cadwallader",
      "pos": "st",
      "title": "Cadwallader",
      "title_es": "Cadwallader"
    }
  ],
  "Legia Warsaw": [
    {
      "name": "Artur Boruc",
      "pos": "gk",
      "title": "King Artur",
      "title_es": "Rey Artur"
    },
    {
      "name": "Jacek Zieliński",
      "pos": "def",
      "title": "Zielek",
      "title_es": "Zielek"
    },
    {
      "name": "Kazimierz Deyna",
      "pos": "mid",
      "title": "Kazika",
      "title_es": "Kazika"
    },
    {
      "name": "Lucjan Brychczy",
      "pos": "st",
      "title": "Kici",
      "title_es": "Kici"
    }
  ],
  "Raków": [
    {
      "name": "Vladan Kovačević",
      "pos": "gk",
      "title": "Vladan",
      "title_es": "Vladan"
    },
    {
      "name": "Tomáš Petrášek",
      "pos": "def",
      "title": "Tomáš",
      "title_es": "Tomáš"
    },
    {
      "name": "Ivi López",
      "pos": "mid",
      "title": "Ivi",
      "title_es": "Ivi"
    },
    {
      "name": "Vladislavs Gutkovskis",
      "pos": "st",
      "title": "Gutko",
      "title_es": "Gutko"
    }
  ],
  "Lech Poznań": [
    {
      "name": "Waldemar Piątek",
      "pos": "gk",
      "title": "Waldemar",
      "title_es": "Waldemar"
    },
    {
      "name": "Bartosz Bosacki",
      "pos": "def",
      "title": "Bosacki",
      "title_es": "Bosacki"
    },
    {
      "name": "Mirosław Okoński",
      "pos": "mid",
      "title": "Mirosław",
      "title_es": "Mirosław"
    },
    {
      "name": "Piotr Reiss",
      "pos": "st",
      "title": "Reiss",
      "title_es": "Reiss"
    }
  ],
  "Jagiellonia": [
    {
      "name": "Marian Kelemen",
      "pos": "gk",
      "title": "Marian",
      "title_es": "Marian"
    },
    {
      "name": "Ivan Runje",
      "pos": "def",
      "title": "Ivan",
      "title_es": "Ivan"
    },
    {
      "name": "Taras Romanczuk",
      "pos": "mid",
      "title": "Taras",
      "title_es": "Taras"
    },
    {
      "name": "Tomasz Frankowski",
      "pos": "st",
      "title": "Franek",
      "title_es": "Franek"
    }
  ],
  "Wisła Kraków": [
    {
      "name": "Radosław Majdan",
      "pos": "gk",
      "title": "Radek",
      "title_es": "Radek"
    },
    {
      "name": "Arkadiusz Głowacki",
      "pos": "def",
      "title": "Głowa",
      "title_es": "Głowa"
    },
    {
      "name": "Jakub Błaszczykowski",
      "pos": "mid",
      "title": "Kuba",
      "title_es": "Kuba"
    },
    {
      "name": "Maciej Żurawski",
      "pos": "st",
      "title": "Żuraw",
      "title_es": "Żuraw"
    }
  ],
  "Pogoń Szczecin": [
    {
      "name": "Radosław Janukiewicz",
      "pos": "gk",
      "title": "Radek",
      "title_es": "Radek"
    },
    {
      "name": "Mariusz Malec",
      "pos": "def",
      "title": "Mariusz",
      "title_es": "Mariusz"
    },
    {
      "name": "Kamil Drygas",
      "pos": "mid",
      "title": "Kamil",
      "title_es": "Kamil"
    },
    {
      "name": "Adam Frączczak",
      "pos": "st",
      "title": "Adam",
      "title_es": "Adam"
    }
  ],
  "Górnik Zabrze": [
    {
      "name": "Hubert Kostka",
      "pos": "gk",
      "title": "Hubert",
      "title_es": "Hubert"
    },
    {
      "name": "Stanisław Oślizło",
      "pos": "def",
      "title": "Stanisław",
      "title_es": "Stanisław"
    },
    {
      "name": "Jan Urban",
      "pos": "mid",
      "title": "Jan",
      "title_es": "Jan"
    },
    {
      "name": "Włodzimierz Lubański",
      "pos": "st",
      "title": "Włodek",
      "title_es": "Włodek"
    }
  ],
  "Cracovia": [
    {
      "name": "Michal Peškovič",
      "pos": "gk",
      "title": "Michal",
      "title_es": "Michal"
    },
    {
      "name": "Cornel Râpă",
      "pos": "def",
      "title": "Cornel",
      "title_es": "Cornel"
    },
    {
      "name": "Mateusz Wdowiak",
      "pos": "mid",
      "title": "Mateusz",
      "title_es": "Mateusz"
    },
    {
      "name": "Krzysztof Piątek",
      "pos": "st",
      "title": "Il Pistolero",
      "title_es": "Il Pistolero"
    }
  ],
  "Piast Gliwice": [
    {
      "name": "Jakub Szmatuła",
      "pos": "gk",
      "title": "Jakub",
      "title_es": "Jakub"
    },
    {
      "name": "Uroš Korun",
      "pos": "def",
      "title": "Uroš",
      "title_es": "Uroš"
    },
    {
      "name": "Gerard Badía",
      "pos": "mid",
      "title": "Gerard",
      "title_es": "Gerard"
    },
    {
      "name": "Jorge Félix",
      "pos": "st",
      "title": "Jorge",
      "title_es": "Jorge"
    }
  ],
  "Widzew Łódź": [
    {
      "name": "Józef Młynarczyk",
      "pos": "gk",
      "title": "Józef",
      "title_es": "Józef"
    },
    {
      "name": "Władysław Żmuda",
      "pos": "def",
      "title": "Władysław",
      "title_es": "Władysław"
    },
    {
      "name": "Zbigniew Boniek",
      "pos": "mid",
      "title": "Zibi",
      "title_es": "Zibi"
    },
    {
      "name": "Włodzimierz Smolarek",
      "pos": "st",
      "title": "Włodzimierz",
      "title_es": "Włodzimierz"
    }
  ],
  "Zagłębie Lubin": [
    {
      "name": "Michał Gliwa",
      "pos": "gk",
      "title": "Michał",
      "title_es": "Michał"
    },
    {
      "name": "Ľubomír Guldan",
      "pos": "def",
      "title": "Ľubomír",
      "title_es": "Ľubomír"
    },
    {
      "name": "Filip Starzyński",
      "pos": "mid",
      "title": "Filip",
      "title_es": "Filip"
    },
    {
      "name": "Arkadiusz Piech",
      "pos": "st",
      "title": "Arkadiusz",
      "title_es": "Arkadiusz"
    }
  ],
  "Radomiak Radom": [
    {
      "name": "Filip Majchrowicz",
      "pos": "gk",
      "title": "Filip",
      "title_es": "Filip"
    },
    {
      "name": "Mateusz Cichocki",
      "pos": "def",
      "title": "Mateusz",
      "title_es": "Mateusz"
    },
    {
      "name": "Leandro",
      "pos": "mid",
      "title": "Leandro",
      "title_es": "Leandro"
    },
    {
      "name": "Maurides",
      "pos": "st",
      "title": "Maurides",
      "title_es": "Maurides"
    }
  ],
  "Stal Mielec": [
    {
      "name": "Rafał Strączek",
      "pos": "gk",
      "title": "Rafał",
      "title_es": "Rafał"
    },
    {
      "name": "Krystian Getinger",
      "pos": "def",
      "title": "Krystian",
      "title_es": "Krystian"
    },
    {
      "name": "Henryk Kasperczak",
      "pos": "mid",
      "title": "Henryk",
      "title_es": "Henryk"
    },
    {
      "name": "Grzegorz Lato",
      "pos": "st",
      "title": "Grzegorz",
      "title_es": "Grzegorz"
    }
  ],
  "Korona Kielce": [
    {
      "name": "Zbigniew Małkowski",
      "pos": "gk",
      "title": "Zbigniew",
      "title_es": "Zbigniew"
    },
    {
      "name": "Adnan Kovačević",
      "pos": "def",
      "title": "Adnan",
      "title_es": "Adnan"
    },
    {
      "name": "Jacek Kiełb",
      "pos": "mid",
      "title": "Ryba",
      "title_es": "Ryba"
    },
    {
      "name": "Maciej Korzym",
      "pos": "st",
      "title": "Maciej",
      "title_es": "Maciej"
    }
  ],
  "Motor Lublin": [
    {
      "name": "Dariusz Opolski",
      "pos": "gk",
      "title": "Dariusz",
      "title_es": "Dariusz"
    },
    {
      "name": "Modest Boguszewski",
      "pos": "def",
      "title": "Modest",
      "title_es": "Modest"
    },
    {
      "name": "Ryszard Kuźma",
      "pos": "mid",
      "title": "Ryszard",
      "title_es": "Ryszard"
    },
    {
      "name": "Leszek Iwanicki",
      "pos": "st",
      "title": "Leszek",
      "title_es": "Leszek"
    }
  ],
  "GKS Katowice": [
    {
      "name": "Janusz Jojko",
      "pos": "gk",
      "title": "Janusz",
      "title_es": "Janusz"
    },
    {
      "name": "Marek Wleciałowski",
      "pos": "def",
      "title": "Marek",
      "title_es": "Marek"
    },
    {
      "name": "Mirosław Widuch",
      "pos": "mid",
      "title": "Mirosław",
      "title_es": "Mirosław"
    },
    {
      "name": "Jan Furtok",
      "pos": "st",
      "title": "Jan",
      "title_es": "Jan"
    }
  ],
  "Red Star Belgrade": [
    {
      "name": "Vladimir Beara",
      "pos": "gk",
      "title": "Veliki Vladimir",
      "title_es": "Gran Vladimir"
    },
    {
      "name": "Nemanja Vidić",
      "pos": "def",
      "title": "Nemanja",
      "title_es": "Nemanja"
    },
    {
      "name": "Dragan Stojković",
      "pos": "mid",
      "title": "Piksi",
      "title_es": "Piksi"
    },
    {
      "name": "Darko Pančev",
      "pos": "st",
      "title": "Kobra",
      "title_es": "Kobra"
    }
  ],
  "Partizan": [
    {
      "name": "Milutin Šoškić",
      "pos": "gk",
      "title": "Milutin",
      "title_es": "Milutin"
    },
    {
      "name": "Velibor Vasović",
      "pos": "def",
      "title": "Vaske",
      "title_es": "Vaske"
    },
    {
      "name": "Saša Ilić",
      "pos": "mid",
      "title": "Sale",
      "title_es": "Sale"
    },
    {
      "name": "Stjepan Bobek",
      "pos": "st",
      "title": "Štef",
      "title_es": "Štef"
    }
  ],
  "TSC": [
    {
      "name": "Nenad Filipović",
      "pos": "gk",
      "title": "Nenad",
      "title_es": "Nenad"
    },
    {
      "name": "Goran Antonić",
      "pos": "def",
      "title": "Goran",
      "title_es": "Goran"
    },
    {
      "name": "Janko Tumbasević",
      "pos": "mid",
      "title": "Janko",
      "title_es": "Janko"
    },
    {
      "name": "Vladimir Silađi",
      "pos": "st",
      "title": "Vladimir",
      "title_es": "Vladimir"
    }
  ],
  "Vojvodina": [
    {
      "name": "Ilija Pantelić",
      "pos": "gk",
      "title": "Ilija",
      "title_es": "Ilija"
    },
    {
      "name": "Vujadin Boškov",
      "pos": "def",
      "title": "Vujke",
      "title_es": "Vujke"
    },
    {
      "name": "Dušan Tadić",
      "pos": "mid",
      "title": "Dušan",
      "title_es": "Dušan"
    },
    {
      "name": "Todor Veselinović",
      "pos": "st",
      "title": "Toza",
      "title_es": "Toza"
    }
  ],
  "Čukarički": [
    {
      "name": "Nemanja Stevanović",
      "pos": "gk",
      "title": "Nemanja",
      "title_es": "Nemanja"
    },
    {
      "name": "Stefan Šapić",
      "pos": "def",
      "title": "Stefan",
      "title_es": "Stefan"
    },
    {
      "name": "Petar Bojić",
      "pos": "mid",
      "title": "Petar",
      "title_es": "Petar"
    },
    {
      "name": "Ognjen Mudrinski",
      "pos": "st",
      "title": "Ognjen",
      "title_es": "Ognjen"
    }
  ],
  "OFK Beograd": [
    {
      "name": "Petar Borota",
      "pos": "gk",
      "title": "Petar",
      "title_es": "Petar"
    },
    {
      "name": "Branislav Ivanović",
      "pos": "def",
      "title": "Bane",
      "title_es": "Bane"
    },
    {
      "name": "Ilija Petković",
      "pos": "mid",
      "title": "Petko",
      "title_es": "Petko"
    },
    {
      "name": "Slobodan Santrač",
      "pos": "st",
      "title": "Sani",
      "title_es": "Sani"
    }
  ],
  "Radnički Niš": [
    {
      "name": "Dragan Pantelić",
      "pos": "gk",
      "title": "Panta",
      "title_es": "Panta"
    },
    {
      "name": "Milovan Obradović",
      "pos": "def",
      "title": "Milovan",
      "title_es": "Milovan"
    },
    {
      "name": "Dragan Stojković",
      "pos": "mid",
      "title": "Piksi",
      "title_es": "Piksi"
    },
    {
      "name": "Dušan Mitošević",
      "pos": "st",
      "title": "Dušan",
      "title_es": "Dušan"
    }
  ],
  "Spartak Subotica": [
    {
      "name": "Branimir Aleksić",
      "pos": "gk",
      "title": "Branimir",
      "title_es": "Branimir"
    },
    {
      "name": "Vidak Bratić",
      "pos": "def",
      "title": "Vidak",
      "title_es": "Vidak"
    },
    {
      "name": "Vladimir Torbica",
      "pos": "mid",
      "title": "Vladimir",
      "title_es": "Vladimir"
    },
    {
      "name": "Nemanja Nikolić",
      "pos": "st",
      "title": "Nemanja",
      "title_es": "Nemanja"
    }
  ],
  "Novi Pazar": [
    {
      "name": "Miljan Vujanac",
      "pos": "gk",
      "title": "Miljan",
      "title_es": "Miljan"
    },
    {
      "name": "Denis Biševac",
      "pos": "def",
      "title": "Denis",
      "title_es": "Denis"
    },
    {
      "name": "Sead Islamović",
      "pos": "mid",
      "title": "Sead",
      "title_es": "Sead"
    },
    {
      "name": "Admir Kecap",
      "pos": "st",
      "title": "Admir",
      "title_es": "Admir"
    }
  ],
  "Napredak": [
    {
      "name": "Nikola Petrić",
      "pos": "gk",
      "title": "Nikola",
      "title_es": "Nikola"
    },
    {
      "name": "Nemanja Tubić",
      "pos": "def",
      "title": "Nemanja",
      "title_es": "Nemanja"
    },
    {
      "name": "Nenad Gavrić",
      "pos": "mid",
      "title": "Nenad",
      "title_es": "Nenad"
    },
    {
      "name": "Ibrahima N'Diaye",
      "pos": "st",
      "title": "Ibrahima",
      "title_es": "Ibrahima"
    }
  ],
  "Železničar": [
    {
      "name": "Aleksandar Kirovski",
      "pos": "gk",
      "title": "Aleksandar",
      "title_es": "Aleksandar"
    },
    {
      "name": "Marko Jovanović",
      "pos": "def",
      "title": "Marko",
      "title_es": "Marko"
    },
    {
      "name": "Stefan Hajdin",
      "pos": "mid",
      "title": "Stefan",
      "title_es": "Stefan"
    },
    {
      "name": "Đorđe Šušnjar",
      "pos": "st",
      "title": "Đorđe",
      "title_es": "Đorđe"
    }
  ],
  "Mladost Lučani": [
    {
      "name": "Dragan Rosić",
      "pos": "gk",
      "title": "Dragan",
      "title_es": "Dragan"
    },
    {
      "name": "Ivan Milošević",
      "pos": "def",
      "title": "Ivan",
      "title_es": "Ivan"
    },
    {
      "name": "Radomir Milosavljević",
      "pos": "mid",
      "title": "Radomir",
      "title_es": "Radomir"
    },
    {
      "name": "Milan Bojović",
      "pos": "st",
      "title": "Milan",
      "title_es": "Milan"
    }
  ],
  "Bodø/Glimt": [
    {
      "name": "Nikita Haikin",
      "pos": "gk",
      "title": "Nikita",
      "title_es": "Nikita"
    },
    {
      "name": "Brede Moe",
      "pos": "def",
      "title": "Brede",
      "title_es": "Brede"
    },
    {
      "name": "Ulrik Saltnes",
      "pos": "mid",
      "title": "Ulrik",
      "title_es": "Ulrik"
    },
    {
      "name": "Amahl Pellegrino",
      "pos": "st",
      "title": "Amahl",
      "title_es": "Amahl"
    }
  ],
  "Molde": [
    {
      "name": "Espen Bugge Pettersen",
      "pos": "gk",
      "title": "Espen",
      "title_es": "Espen"
    },
    {
      "name": "Vegard Forren",
      "pos": "def",
      "title": "Vegard",
      "title_es": "Vegard"
    },
    {
      "name": "Daniel Berg Hestad",
      "pos": "mid",
      "title": "Daniel",
      "title_es": "Daniel"
    },
    {
      "name": "Ole Gunnar Solskjær",
      "pos": "st",
      "title": "Baby-Faced Assassin",
      "title_es": "Asesino con Cara de Niño"
    }
  ],
  "Brann": [
    {
      "name": "Håkon Opdal",
      "pos": "gk",
      "title": "Håkon",
      "title_es": "Håkon"
    },
    {
      "name": "Roy Wassberg",
      "pos": "def",
      "title": "Roy",
      "title_es": "Roy"
    },
    {
      "name": "Martin Andresen",
      "pos": "mid",
      "title": "Martin",
      "title_es": "Martin"
    },
    {
      "name": "Thorstein Helstad",
      "pos": "st",
      "title": "Thorstein",
      "title_es": "Thorstein"
    }
  ],
  "Rosenborg": [
    {
      "name": "Jørn Jamtfall",
      "pos": "gk",
      "title": "Jørn",
      "title_es": "Jørn"
    },
    {
      "name": "Erik Hoftun",
      "pos": "def",
      "title": "Erik",
      "title_es": "Erik"
    },
    {
      "name": "Roar Strand",
      "pos": "mid",
      "title": "Roar",
      "title_es": "Roar"
    },
    {
      "name": "Harald Martin Brattbakk",
      "pos": "st",
      "title": "Harald",
      "title_es": "Harald"
    }
  ],
  "Viking": [
    {
      "name": "Erik Thorstvedt",
      "pos": "gk",
      "title": "Erik",
      "title_es": "Erik"
    },
    {
      "name": "Brede Hangeland",
      "pos": "def",
      "title": "Brede",
      "title_es": "Brede"
    },
    {
      "name": "Bjarte Lunde Aarsheim",
      "pos": "mid",
      "title": "Bjarte",
      "title_es": "Bjarte"
    },
    {
      "name": "Egil Østenstad",
      "pos": "st",
      "title": "Egil",
      "title_es": "Egil"
    }
  ],
  "Tromsø": [
    {
      "name": "Jacob Karlstrøm",
      "pos": "gk",
      "title": "Jacob",
      "title_es": "Jacob"
    },
    {
      "name": "Miika Koppinen",
      "pos": "def",
      "title": "Miika",
      "title_es": "Miika"
    },
    {
      "name": "Morten Gamst Pedersen",
      "pos": "mid",
      "title": "Morten",
      "title_es": "Morten"
    },
    {
      "name": "Sigurd Rushfeldt",
      "pos": "st",
      "title": "Sigurd",
      "title_es": "Sigurd"
    }
  ],
  "Fredrikstad": [
    {
      "name": "Jon Knudsen",
      "pos": "gk",
      "title": "Jon",
      "title_es": "Jon"
    },
    {
      "name": "Per Egil Ahlsen",
      "pos": "def",
      "title": "Per Egil",
      "title_es": "Per Egil"
    },
    {
      "name": "Raymond Kvisvik",
      "pos": "mid",
      "title": "Raymond",
      "title_es": "Raymond"
    },
    {
      "name": "Tarik Elyounoussi",
      "pos": "st",
      "title": "Tarik",
      "title_es": "Tarik"
    }
  ],
  "Vålerenga": [
    {
      "name": "Árni Gautur Arason",
      "pos": "gk",
      "title": "Árni",
      "title_es": "Árni"
    },
    {
      "name": "Kjetil Wæhler",
      "pos": "def",
      "title": "Kjetil",
      "title_es": "Kjetil"
    },
    {
      "name": "Christian Grindheim",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Vidar Örn Kjartansson",
      "pos": "st",
      "title": "Vidar",
      "title_es": "Vidar"
    }
  ],
  "Lillestrøm": [
    {
      "name": "Frode Grodås",
      "pos": "gk",
      "title": "Frode",
      "title_es": "Frode"
    },
    {
      "name": "Frode Kippe",
      "pos": "def",
      "title": "Frode",
      "title_es": "Frode"
    },
    {
      "name": "Bjørn Helge Riise",
      "pos": "mid",
      "title": "Bjørn",
      "title_es": "Bjørn"
    },
    {
      "name": "Tom Lund",
      "pos": "st",
      "title": "Tommy",
      "title_es": "Tommy"
    }
  ],
  "Sarpsborg 08": [
    {
      "name": "Aslak Falch",
      "pos": "gk",
      "title": "Aslak",
      "title_es": "Aslak"
    },
    {
      "name": "Joachim Thomassen",
      "pos": "def",
      "title": "Joachim",
      "title_es": "Joachim"
    },
    {
      "name": "Kristoffer Zachariassen",
      "pos": "mid",
      "title": "Kristoffer",
      "title_es": "Kristoffer"
    },
    {
      "name": "Patrick Mortensen",
      "pos": "st",
      "title": "Patrick",
      "title_es": "Patrick"
    }
  ],
  "Strømsgodset": [
    {
      "name": "Adam Larsen Kwarasey",
      "pos": "gk",
      "title": "Adam",
      "title_es": "Adam"
    },
    {
      "name": "Alexander Aas",
      "pos": "def",
      "title": "Alexander",
      "title_es": "Alexander"
    },
    {
      "name": "Martin Ødegaard",
      "pos": "mid",
      "title": "Martin",
      "title_es": "Martin"
    },
    {
      "name": "Marcus Pedersen",
      "pos": "st",
      "title": "Marcus",
      "title_es": "Marcus"
    }
  ],
  "Haugesund": [
    {
      "name": "Per Morten Kristiansen",
      "pos": "gk",
      "title": "Per",
      "title_es": "Per"
    },
    {
      "name": "William Troost-Ekong",
      "pos": "def",
      "title": "William",
      "title_es": "William"
    },
    {
      "name": "Christian Grindheim",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Christian Gytkjær",
      "pos": "st",
      "title": "Christian",
      "title_es": "Christian"
    }
  ],
  "Kristiansund": [
    {
      "name": "Sean McDermott",
      "pos": "gk",
      "title": "Sean",
      "title_es": "Sean"
    },
    {
      "name": "Dan Peter Ulvestad",
      "pos": "def",
      "title": "Dan Peter",
      "title_es": "Dan Peter"
    },
    {
      "name": "Liridon Kalludra",
      "pos": "mid",
      "title": "Liridon",
      "title_es": "Liridon"
    },
    {
      "name": "Daouda Bamba",
      "pos": "st",
      "title": "Daouda",
      "title_es": "Daouda"
    }
  ],
  "HamKam": [
    {
      "name": "Ivar Rønningen",
      "pos": "gk",
      "title": "Ivar",
      "title_es": "Ivar"
    },
    {
      "name": "Vegar Bjerke",
      "pos": "def",
      "title": "Vegar",
      "title_es": "Vegar"
    },
    {
      "name": "Jan Michaelsen",
      "pos": "mid",
      "title": "Jan",
      "title_es": "Jan"
    },
    {
      "name": "Roman Kienast",
      "pos": "st",
      "title": "Roman",
      "title_es": "Roman"
    }
  ],
  "Al Ahly": [
    {
      "name": "Essam El Hadary",
      "pos": "gk",
      "title": "High Dam",
      "title_es": "Presa Alta"
    },
    {
      "name": "Wael Gomaa",
      "pos": "def",
      "title": "The Rock",
      "title_es": "La Roca"
    },
    {
      "name": "Mohamed Aboutrika",
      "pos": "mid",
      "title": "El Magico",
      "title_es": "El Mágico"
    },
    {
      "name": "Mahmoud El Khatib",
      "pos": "st",
      "title": "Bibo",
      "title_es": "Bibo"
    }
  ],
  "Pyramids": [
    {
      "name": "Ahmed El Shenawy",
      "pos": "gk",
      "title": "Shenawy",
      "title_es": "Shenawy"
    },
    {
      "name": "Ali Gabr",
      "pos": "def",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Abdallah El Said",
      "pos": "mid",
      "title": "Abdallah",
      "title_es": "Abdallah"
    },
    {
      "name": "Ramadan Sobhi",
      "pos": "st",
      "title": "Ramadona",
      "title_es": "Ramadona"
    }
  ],
  "Zamalek": [
    {
      "name": "Abdel Wahed El Sayed",
      "pos": "gk",
      "title": "Abdel",
      "title_es": "Abdel"
    },
    {
      "name": "Mahmoud Saad",
      "pos": "def",
      "title": "Saad",
      "title_es": "Saad"
    },
    {
      "name": "Shikabala",
      "pos": "mid",
      "title": "Shika",
      "title_es": "Shika"
    },
    {
      "name": "Hossam Hassan",
      "pos": "st",
      "title": "Hossam",
      "title_es": "Hossam"
    }
  ],
  "Ismaily": [
    {
      "name": "Mohamed Sobhy",
      "pos": "gk",
      "title": "Sobhy",
      "title_es": "Sobhy"
    },
    {
      "name": "Emad El Nahhas",
      "pos": "def",
      "title": "Emad",
      "title_es": "Emad"
    },
    {
      "name": "Hosny Abd Rabo",
      "pos": "mid",
      "title": "Hosny",
      "title_es": "Hosny"
    },
    {
      "name": "Ali Abo Greisha",
      "pos": "st",
      "title": "Ali",
      "title_es": "Ali"
    }
  ],
  "Al Masry": [
    {
      "name": "Ahmed Masoud",
      "pos": "gk",
      "title": "Masoud",
      "title_es": "Masoud"
    },
    {
      "name": "Karim El Eraki",
      "pos": "def",
      "title": "Karim",
      "title_es": "Karim"
    },
    {
      "name": "Tarek Yehia",
      "pos": "mid",
      "title": "Tarek",
      "title_es": "Tarek"
    },
    {
      "name": "El Sayed El Dhizui",
      "pos": "st",
      "title": "El Dhizui",
      "title_es": "El Dhizui"
    }
  ],
  "Future FC": [
    {
      "name": "Mahmoud Genesh",
      "pos": "gk",
      "title": "Genesh",
      "title_es": "Genesh"
    },
    {
      "name": "Saad Samir",
      "pos": "def",
      "title": "Saad",
      "title_es": "Saad"
    },
    {
      "name": "Nasser Maher",
      "pos": "mid",
      "title": "Nasser",
      "title_es": "Nasser"
    },
    {
      "name": "Ahmed Atef",
      "pos": "st",
      "title": "Atef",
      "title_es": "Atef"
    }
  ],
  "Ceramica Cleopatra": [
    {
      "name": "Mohamed Bassam",
      "pos": "gk",
      "title": "Bassam",
      "title_es": "Bassam"
    },
    {
      "name": "Ragab Nabil",
      "pos": "def",
      "title": "Ragab",
      "title_es": "Ragab"
    },
    {
      "name": "Mohamed Ibrahim",
      "pos": "mid",
      "title": "Mohamed",
      "title_es": "Mohamed"
    },
    {
      "name": "Shady Hussein",
      "pos": "st",
      "title": "Shady",
      "title_es": "Shady"
    }
  ],
  "ZED FC": [
    {
      "name": "Ali Lotfi",
      "pos": "gk",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Mohamed Samir",
      "pos": "def",
      "title": "Samir",
      "title_es": "Samir"
    },
    {
      "name": "Mostafa Ziko",
      "pos": "mid",
      "title": "Ziko",
      "title_es": "Ziko"
    },
    {
      "name": "Shady Hussein",
      "pos": "st",
      "title": "Shady",
      "title_es": "Shady"
    }
  ],
  "Smouha": [
    {
      "name": "El Hany Soliman",
      "pos": "gk",
      "title": "El Hany",
      "title_es": "El Hany"
    },
    {
      "name": "Yasser Ibrahim",
      "pos": "def",
      "title": "Yasser",
      "title_es": "Yasser"
    },
    {
      "name": "Tarek Hamed",
      "pos": "mid",
      "title": "Tarek",
      "title_es": "Tarek"
    },
    {
      "name": "Hossam Hassan",
      "pos": "st",
      "title": "Hossam",
      "title_es": "Hossam"
    }
  ],
  "ENPPI": [
    {
      "name": "Abdelaziz El Balouti",
      "pos": "gk",
      "title": "El Balouti",
      "title_es": "El Balouti"
    },
    {
      "name": "Ramy Sabry",
      "pos": "def",
      "title": "Ramy",
      "title_es": "Ramy"
    },
    {
      "name": "Salah Ashour",
      "pos": "mid",
      "title": "Salah",
      "title_es": "Salah"
    },
    {
      "name": "Ahmed Raouf",
      "pos": "st",
      "title": "Raouf",
      "title_es": "Raouf"
    }
  ],
  "Talaea El Gaish": [
    {
      "name": "Emad El Sayed",
      "pos": "gk",
      "title": "Emad",
      "title_es": "Emad"
    },
    {
      "name": "Ali El Fil",
      "pos": "def",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Amr El Sisi",
      "pos": "mid",
      "title": "Amr",
      "title_es": "Amr"
    },
    {
      "name": "Talaat Moharam",
      "pos": "st",
      "title": "Talaat",
      "title_es": "Talaat"
    }
  ],
  "National Bank": [
    {
      "name": "Mohamed Abou Gabal",
      "pos": "gk",
      "title": "Gabaski",
      "title_es": "Gabaski"
    },
    {
      "name": "Ayman Ashraf",
      "pos": "def",
      "title": "Ayman",
      "title_es": "Ayman"
    },
    {
      "name": "Mahmoud Sayed",
      "pos": "mid",
      "title": "Mahmoud",
      "title_es": "Mahmoud"
    },
    {
      "name": "Karim Bambo",
      "pos": "st",
      "title": "Karim",
      "title_es": "Karim"
    }
  ],
  "Pharco": [
    {
      "name": "Mohamed Shika",
      "pos": "gk",
      "title": "Shika",
      "title_es": "Shika"
    },
    {
      "name": "Ramy Sabry",
      "pos": "def",
      "title": "Ramy",
      "title_es": "Ramy"
    },
    {
      "name": "Kingsley Sokari",
      "pos": "mid",
      "title": "Kingsley",
      "title_es": "Kingsley"
    },
    {
      "name": "Shoukry Naguib",
      "pos": "st",
      "title": "Shoukry",
      "title_es": "Shoukry"
    }
  ],
  "Ghazl El Mahalla": [
    {
      "name": "Amr Shaaban",
      "pos": "gk",
      "title": "Amr",
      "title_es": "Amr"
    },
    {
      "name": "Mahmoud Fathallah",
      "pos": "def",
      "title": "Mahmoud",
      "title_es": "Mahmoud"
    },
    {
      "name": "Shawky Ghareeb",
      "pos": "mid",
      "title": "Shawky",
      "title_es": "Shawky"
    },
    {
      "name": "Khaled Eid",
      "pos": "st",
      "title": "Khaled",
      "title_es": "Khaled"
    }
  ],
  "CR Belouizdad": [
    {
      "name": "Abderrahmane Boubekeur",
      "pos": "gk",
      "title": "Boubekeur",
      "title_es": "Boubekeur"
    },
    {
      "name": "Miloud Hadefi",
      "pos": "def",
      "title": "Miloud",
      "title_es": "Miloud"
    },
    {
      "name": "Hacène Lalmas",
      "pos": "mid",
      "title": "El Kebaïli",
      "title_es": "El Kebaïli"
    },
    {
      "name": "Islam Slimani",
      "pos": "st",
      "title": "Super Slim",
      "title_es": "Súper Slim"
    }
  ],
  "MC Alger": [
    {
      "name": "Fawzi Chaouchi",
      "pos": "gk",
      "title": "Fawzi",
      "title_es": "Fawzi"
    },
    {
      "name": "Abderahmane Hachoud",
      "pos": "def",
      "title": "Hachoud",
      "title_es": "Hachoud"
    },
    {
      "name": "Ali Bencheikh",
      "pos": "mid",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Omar Betrouni",
      "pos": "st",
      "title": "Omar",
      "title_es": "Omar"
    }
  ],
  "USM Alger": [
    {
      "name": "Lamine Zemmamouche",
      "pos": "gk",
      "title": "Zemma",
      "title_es": "Zemma"
    },
    {
      "name": "Farouk Chafaï",
      "pos": "def",
      "title": "Farouk",
      "title_es": "Farouk"
    },
    {
      "name": "Billel Dziri",
      "pos": "mid",
      "title": "Billel",
      "title_es": "Billel"
    },
    {
      "name": "Tarek Hadj Adlane",
      "pos": "st",
      "title": "Tarek",
      "title_es": "Tarek"
    }
  ],
  "JS Kabylie": [
    {
      "name": "Lounès Gaouaoui",
      "pos": "gk",
      "title": "Lounès",
      "title_es": "Lounès"
    },
    {
      "name": "Lyes Bahbouh",
      "pos": "def",
      "title": "Lyes",
      "title_es": "Lyes"
    },
    {
      "name": "Ali Fergani",
      "pos": "mid",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Hamid Berguiga",
      "pos": "st",
      "title": "Hamid",
      "title_es": "Hamid"
    }
  ],
  "ES Sétif": [
    {
      "name": "Samir Hadjaoui",
      "pos": "gk",
      "title": "Samir",
      "title_es": "Samir"
    },
    {
      "name": "Farid Mellouli",
      "pos": "def",
      "title": "Farid",
      "title_es": "Farid"
    },
    {
      "name": "Lazhar Hadj Aïssa",
      "pos": "mid",
      "title": "Baggio",
      "title_es": "Baggio"
    },
    {
      "name": "Abdelmalek Ziaya",
      "pos": "st",
      "title": "Ziaya",
      "title_es": "Ziaya"
    }
  ],
  "CS Constantine": [
    {
      "name": "Chamseddine Rahmani",
      "pos": "gk",
      "title": "Rahmani",
      "title_es": "Rahmani"
    },
    {
      "name": "Hocine Benayada",
      "pos": "def",
      "title": "Hocine",
      "title_es": "Hocine"
    },
    {
      "name": "Yacine Bezzaz",
      "pos": "mid",
      "title": "Yacine",
      "title_es": "Yacine"
    },
    {
      "name": "Abdenour Belkheir",
      "pos": "st",
      "title": "Abdenour",
      "title_es": "Abdenour"
    }
  ],
  "JS Saoura": [
    {
      "name": "Abderrahmane Boultif",
      "pos": "gk",
      "title": "Boultif",
      "title_es": "Boultif"
    },
    {
      "name": "Nasr Eddine Khoualed",
      "pos": "def",
      "title": "Khoualed",
      "title_es": "Khoualed"
    },
    {
      "name": "Kaddour Beldjilali",
      "pos": "mid",
      "title": "Kaddour",
      "title_es": "Kaddour"
    },
    {
      "name": "Moustapha Djallit",
      "pos": "st",
      "title": "Djallit",
      "title_es": "Djallit"
    }
  ],
  "Paradou": [
    {
      "name": "Farid Chaâl",
      "pos": "gk",
      "title": "Chaâl",
      "title_es": "Chaâl"
    },
    {
      "name": "Ramy Bensebaini",
      "pos": "def",
      "title": "Ramy",
      "title_es": "Ramy"
    },
    {
      "name": "Hicham Boudaoui",
      "pos": "mid",
      "title": "Hicham",
      "title_es": "Hicham"
    },
    {
      "name": "Farid El Melali",
      "pos": "st",
      "title": "Farid",
      "title_es": "Farid"
    }
  ],
  "ASO Chlef": [
    {
      "name": "Mohamed Ghalem",
      "pos": "gk",
      "title": "Ghalem",
      "title_es": "Ghalem"
    },
    {
      "name": "Samir Zazou",
      "pos": "def",
      "title": "Samir",
      "title_es": "Samir"
    },
    {
      "name": "Kheireddine Merzougui",
      "pos": "mid",
      "title": "Merzougui",
      "title_es": "Merzougui"
    },
    {
      "name": "Noureddine Daham",
      "pos": "st",
      "title": "Daham",
      "title_es": "Daham"
    }
  ],
  "NC Magra": [
    {
      "name": "Cherif Zakaria",
      "pos": "gk",
      "title": "Zakaria",
      "title_es": "Zakaria"
    },
    {
      "name": "Hamza Ziad",
      "pos": "def",
      "title": "Hamza",
      "title_es": "Hamza"
    },
    {
      "name": "Akram Demane",
      "pos": "mid",
      "title": "Akram",
      "title_es": "Akram"
    },
    {
      "name": "Boubacar Soumana",
      "pos": "st",
      "title": "Boubacar",
      "title_es": "Boubacar"
    }
  ],
  "USM Khenchela": [
    {
      "name": "Oussama Litim",
      "pos": "gk",
      "title": "Oussama",
      "title_es": "Oussama"
    },
    {
      "name": "Abdelhak Sameur",
      "pos": "def",
      "title": "Abdelhak",
      "title_es": "Abdelhak"
    },
    {
      "name": "Maxwell Baakoh",
      "pos": "mid",
      "title": "Maxwell",
      "title_es": "Maxwell"
    },
    {
      "name": "Sofiane Bayazid",
      "pos": "st",
      "title": "Sofiane",
      "title_es": "Sofiane"
    }
  ],
  "Olympique Akbou": [
    {
      "name": "Benaouda",
      "pos": "gk",
      "title": "Benaouda",
      "title_es": "Benaouda"
    },
    {
      "name": "Adrar",
      "pos": "def",
      "title": "Adrar",
      "title_es": "Adrar"
    },
    {
      "name": "Ziani",
      "pos": "mid",
      "title": "Ziani",
      "title_es": "Ziani"
    },
    {
      "name": "Mebarakou",
      "pos": "st",
      "title": "Mebarakou",
      "title_es": "Mebarakou"
    }
  ],
  "MC El Bayadh": [
    {
      "name": "Bouziani",
      "pos": "gk",
      "title": "Bouziani",
      "title_es": "Bouziani"
    },
    {
      "name": "Belalem",
      "pos": "def",
      "title": "Belalem",
      "title_es": "Belalem"
    },
    {
      "name": "Bounaâs",
      "pos": "mid",
      "title": "Bounaâs",
      "title_es": "Bounaâs"
    },
    {
      "name": "Ghenam",
      "pos": "st",
      "title": "Ghenam",
      "title_es": "Ghenam"
    }
  ],
  "RC Kouba": [
    {
      "name": "Mehdi Cerbah",
      "pos": "gk",
      "title": "Mehdi",
      "title_es": "Mehdi"
    },
    {
      "name": "Safsafi",
      "pos": "def",
      "title": "Safsafi",
      "title_es": "Safsafi"
    },
    {
      "name": "Salah Assad",
      "pos": "mid",
      "title": "Salah",
      "title_es": "Salah"
    },
    {
      "name": "Boualem Amirouche",
      "pos": "st",
      "title": "Boualem",
      "title_es": "Boualem"
    }
  ],
  "Persepolis": [
    {
      "name": "Ahmad Reza Abedzadeh",
      "pos": "gk",
      "title": "Eagle of Asia",
      "title_es": "Águila de Asia"
    },
    {
      "name": "Yahya Golmohammadi",
      "pos": "def",
      "title": "Yahya",
      "title_es": "Yahya"
    },
    {
      "name": "Ali Karimi",
      "pos": "mid",
      "title": "Magician",
      "title_es": "Mago"
    },
    {
      "name": "Ali Daei",
      "pos": "st",
      "title": "Shahriar",
      "title_es": "Shahriar"
    }
  ],
  "Esteghlal": [
    {
      "name": "Nasser Hejazi",
      "pos": "gk",
      "title": "Nasser",
      "title_es": "Nasser"
    },
    {
      "name": "Pejman Montazeri",
      "pos": "def",
      "title": "Pejman",
      "title_es": "Pejman"
    },
    {
      "name": "Javad Nekounam",
      "pos": "mid",
      "title": "Javad",
      "title_es": "Javad"
    },
    {
      "name": "Farhad Majidi",
      "pos": "st",
      "title": "Farhad",
      "title_es": "Farhad"
    }
  ],
  "Sepahan": [
    {
      "name": "Rahman Ahmadi",
      "pos": "gk",
      "title": "Rahman",
      "title_es": "Rahman"
    },
    {
      "name": "Hadi Aghily",
      "pos": "def",
      "title": "Hadi",
      "title_es": "Hadi"
    },
    {
      "name": "Moharram Navidkia",
      "pos": "mid",
      "title": "Moharram",
      "title_es": "Moharram"
    },
    {
      "name": "Edmond Bezik",
      "pos": "st",
      "title": "Edmond",
      "title_es": "Edmond"
    }
  ],
  "Tractor": [
    {
      "name": "Mohammad Reza Akhbari",
      "pos": "gk",
      "title": "Akhbari",
      "title_es": "Akhbari"
    },
    {
      "name": "Mohammad Nosrati",
      "pos": "def",
      "title": "Nosrati",
      "title_es": "Nosrati"
    },
    {
      "name": "Masoud Shojaei",
      "pos": "mid",
      "title": "Masoud",
      "title_es": "Masoud"
    },
    {
      "name": "Karim Ansarifard",
      "pos": "st",
      "title": "Karim",
      "title_es": "Karim"
    }
  ],
  "Foolad": [
    {
      "name": "Alireza Salimi",
      "pos": "gk",
      "title": "Alireza",
      "title_es": "Alireza"
    },
    {
      "name": "Jalal Kameli Mofrad",
      "pos": "def",
      "title": "Jalal",
      "title_es": "Jalal"
    },
    {
      "name": "Bakhtiar Rahmani",
      "pos": "mid",
      "title": "Bakhtiar",
      "title_es": "Bakhtiar"
    },
    {
      "name": "Reza Norouzi",
      "pos": "st",
      "title": "Reza",
      "title_es": "Reza"
    }
  ],
  "Gol Gohar": [
    {
      "name": "Mohsen Forouzan",
      "pos": "gk",
      "title": "Mohsen",
      "title_es": "Mohsen"
    },
    {
      "name": "Armin Sohrabian",
      "pos": "def",
      "title": "Armin",
      "title_es": "Armin"
    },
    {
      "name": "Saeid Sadeghi",
      "pos": "mid",
      "title": "Saeid",
      "title_es": "Saeid"
    },
    {
      "name": "Godwin Mensha",
      "pos": "st",
      "title": "Godwin",
      "title_es": "Godwin"
    }
  ],
  "Zob Ahan": [
    {
      "name": "Mohammad Bagher Sadeghi",
      "pos": "gk",
      "title": "Sadeghi",
      "title_es": "Sadeghi"
    },
    {
      "name": "Ali Ahmadi",
      "pos": "def",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Ghasem Haddadifar",
      "pos": "mid",
      "title": "Ghasem",
      "title_es": "Ghasem"
    },
    {
      "name": "Mehdi Rajabzadeh",
      "pos": "st",
      "title": "Mehdi",
      "title_es": "Mehdi"
    }
  ],
  "Mes Rafsanjan": [
    {
      "name": "Dawood Noushi Sofiani",
      "pos": "gk",
      "title": "Dawood",
      "title_es": "Dawood"
    },
    {
      "name": "Shahin Tavakoli",
      "pos": "def",
      "title": "Shahin",
      "title_es": "Shahin"
    },
    {
      "name": "Mohsen Azarbad",
      "pos": "mid",
      "title": "Mohsen",
      "title_es": "Mohsen"
    },
    {
      "name": "Godwin Mensha",
      "pos": "st",
      "title": "Godwin",
      "title_es": "Godwin"
    }
  ],
  "Malavan": [
    {
      "name": "Sosha Makani",
      "pos": "gk",
      "title": "Sosha",
      "title_es": "Sosha"
    },
    {
      "name": "Maziar Zare",
      "pos": "def",
      "title": "Maziar",
      "title_es": "Maziar"
    },
    {
      "name": "Sirous Ghayeghran",
      "pos": "mid",
      "title": "Sirous",
      "title_es": "Sirous"
    },
    {
      "name": "Jalal Rafkhaei",
      "pos": "st",
      "title": "Jalal",
      "title_es": "Jalal"
    }
  ],
  "Aluminium Arak": [
    {
      "name": "Hossein Pourhamidi",
      "pos": "gk",
      "title": "Hossein",
      "title_es": "Hossein"
    },
    {
      "name": "Amir Houshmand",
      "pos": "def",
      "title": "Amir",
      "title_es": "Amir"
    },
    {
      "name": "Mahmoud Ghaed Rahmati",
      "pos": "mid",
      "title": "Mahmoud",
      "title_es": "Mahmoud"
    },
    {
      "name": "Hamed Pakdel",
      "pos": "st",
      "title": "Hamed",
      "title_es": "Hamed"
    }
  ],
  "Nassaji": [
    {
      "name": "Alireza Haghighi",
      "pos": "gk",
      "title": "Alireza",
      "title_es": "Alireza"
    },
    {
      "name": "Hamed Shiri",
      "pos": "def",
      "title": "Hamed",
      "title_es": "Hamed"
    },
    {
      "name": "Ayoub Kalantari",
      "pos": "mid",
      "title": "Ayoub",
      "title_es": "Ayoub"
    },
    {
      "name": "Karim Eslami",
      "pos": "st",
      "title": "Karim",
      "title_es": "Karim"
    }
  ],
  "Shams Azar": [
    {
      "name": "Alireza Jafarpour",
      "pos": "gk",
      "title": "Alireza",
      "title_es": "Alireza"
    },
    {
      "name": "Mohsen Tarhani",
      "pos": "def",
      "title": "Mohsen",
      "title_es": "Mohsen"
    },
    {
      "name": "Ali Asghar Arabi",
      "pos": "mid",
      "title": "Arabi",
      "title_es": "Arabi"
    },
    {
      "name": "Rahmad Abadi",
      "pos": "st",
      "title": "Rahmad",
      "title_es": "Rahmad"
    }
  ],
  "Havadar": [
    {
      "name": "Mehrdad Tahmasbi",
      "pos": "gk",
      "title": "Mehrdad",
      "title_es": "Mehrdad"
    },
    {
      "name": "Mehdi Abdi",
      "pos": "def",
      "title": "Mehdi",
      "title_es": "Mehdi"
    },
    {
      "name": "Dariush Shojaeian",
      "pos": "mid",
      "title": "Dariush",
      "title_es": "Dariush"
    },
    {
      "name": "Babak Moradi",
      "pos": "st",
      "title": "Babak",
      "title_es": "Babak"
    }
  ],
  "Paykan": [
    {
      "name": "Payam Niazmand",
      "pos": "gk",
      "title": "Payam",
      "title_es": "Payam"
    },
    {
      "name": "Amir Hossein Sadeghi",
      "pos": "def",
      "title": "Amir Hossein",
      "title_es": "Amir Hossein"
    },
    {
      "name": "Mohammad Nouri",
      "pos": "mid",
      "title": "Mohammad",
      "title_es": "Mohammad"
    },
    {
      "name": "Ibrahim Touré",
      "pos": "st",
      "title": "Ibrahima",
      "title_es": "Ibrahima"
    }
  ],
  "Enyimba": [
    {
      "name": "Vincent Enyeama",
      "pos": "gk",
      "title": "Vincent",
      "title_es": "Vincent"
    },
    {
      "name": "Obinna Nwaneri",
      "pos": "def",
      "title": "Obinna",
      "title_es": "Obinna"
    },
    {
      "name": "Mutiu Adegoke",
      "pos": "mid",
      "title": "Mutiu",
      "title_es": "Mutiu"
    },
    {
      "name": "Victor Ezeji",
      "pos": "st",
      "title": "Victor",
      "title_es": "Victor"
    }
  ],
  "Rivers United": [
    {
      "name": "Sunday Rotimi",
      "pos": "gk",
      "title": "Sunday",
      "title_es": "Sunday"
    },
    {
      "name": "Festus Austin",
      "pos": "def",
      "title": "Festus",
      "title_es": "Festus"
    },
    {
      "name": "Bernard Ovoke",
      "pos": "mid",
      "title": "Bernard",
      "title_es": "Bernard"
    },
    {
      "name": "Nyima Nwagua",
      "pos": "st",
      "title": "Nyima",
      "title_es": "Nyima"
    }
  ],
  "Remo Stars": [
    {
      "name": "Kayode Bankole",
      "pos": "gk",
      "title": "Kayode",
      "title_es": "Kayode"
    },
    {
      "name": "Nduka Junior",
      "pos": "def",
      "title": "Nduka",
      "title_es": "Nduka"
    },
    {
      "name": "Dayo Ojo",
      "pos": "mid",
      "title": "Dayo",
      "title_es": "Dayo"
    },
    {
      "name": "Sikiru Alimi",
      "pos": "st",
      "title": "Sikiru",
      "title_es": "Sikiru"
    }
  ],
  "Kano Pillars": [
    {
      "name": "Theophilus Afelokhai",
      "pos": "gk",
      "title": "Theophilus",
      "title_es": "Theophilus"
    },
    {
      "name": "Chinedu Udoji",
      "pos": "def",
      "title": "Chinedu",
      "title_es": "Chinedu"
    },
    {
      "name": "Rabiu Ali",
      "pos": "mid",
      "title": "Pele",
      "title_es": "Pelé"
    },
    {
      "name": "Ahmed Musa",
      "pos": "st",
      "title": "Ahmed",
      "title_es": "Ahmed"
    }
  ],
  "Shooting Stars": [
    {
      "name": "Zion Ogunfeyimi",
      "pos": "gk",
      "title": "Zion",
      "title_es": "Zion"
    },
    {
      "name": "Samuel Ojebode",
      "pos": "def",
      "title": "Samuel",
      "title_es": "Samuel"
    },
    {
      "name": "Mutiu Adepoju",
      "pos": "mid",
      "title": "Headmaster",
      "title_es": "Headmaster"
    },
    {
      "name": "Rashidi Yekini",
      "pos": "st",
      "title": "Goalsfather",
      "title_es": "Goalsfather"
    }
  ],
  "Plateau United": [
    {
      "name": "Dele Ajiboye",
      "pos": "gk",
      "title": "Dele",
      "title_es": "Dele"
    },
    {
      "name": "Elisha Golbe",
      "pos": "def",
      "title": "Elisha",
      "title_es": "Elisha"
    },
    {
      "name": "Raphael Ayagwa",
      "pos": "mid",
      "title": "Raphael",
      "title_es": "Raphael"
    },
    {
      "name": "Joshua Obaje",
      "pos": "st",
      "title": "Joshua",
      "title_es": "Joshua"
    }
  ],
  "Bendel Insurance": [
    {
      "name": "Peter Rufai",
      "pos": "gk",
      "title": "Dodo Mayana",
      "title_es": "Dodo Mayana"
    },
    {
      "name": "Austin Eguavoen",
      "pos": "def",
      "title": "Cerezo",
      "title_es": "Cerezo"
    },
    {
      "name": "Osaze Odemwingie",
      "pos": "mid",
      "title": "Osaze",
      "title_es": "Osaze"
    },
    {
      "name": "Julius Aghahowa",
      "pos": "st",
      "title": "Aghahowa",
      "title_es": "Aghahowa"
    }
  ],
  "Rangers International": [
    {
      "name": "Emmanuel Okala",
      "pos": "gk",
      "title": "Tallest",
      "title_es": "Tallest"
    },
    {
      "name": "Christian Chukwu",
      "pos": "def",
      "title": "Chairman",
      "title_es": "Chairman"
    },
    {
      "name": "Jay-Jay Okocha",
      "pos": "mid",
      "title": "Jay-Jay",
      "title_es": "Jay-Jay"
    },
    {
      "name": "Ifeanyi George",
      "pos": "st",
      "title": "Ifeanyi",
      "title_es": "Ifeanyi"
    }
  ],
  "Kwara United": [
    {
      "name": "Dele Aiyenugba",
      "pos": "gk",
      "title": "Dele",
      "title_es": "Dele"
    },
    {
      "name": "Akeem Onigbinde",
      "pos": "def",
      "title": "Akeem",
      "title_es": "Akeem"
    },
    {
      "name": "Segun Alebiosu",
      "pos": "mid",
      "title": "Segun",
      "title_es": "Segun"
    },
    {
      "name": "Stephen Jude",
      "pos": "st",
      "title": "Stephen",
      "title_es": "Stephen"
    }
  ],
  "Abia Warriors": [
    {
      "name": "Chinedu Anozie",
      "pos": "gk",
      "title": "Chinedu",
      "title_es": "Chinedu"
    },
    {
      "name": "Austin Obaroakpo",
      "pos": "def",
      "title": "Austin",
      "title_es": "Austin"
    },
    {
      "name": "Ndifreke Effiong",
      "pos": "mid",
      "title": "Ndifreke",
      "title_es": "Ndifreke"
    },
    {
      "name": "Chisom Chikatara",
      "pos": "st",
      "title": "Kolanut Boy",
      "title_es": "Chico de Kola"
    }
  ],
  "Nasarawa United": [
    {
      "name": "Suraj Ayeleso",
      "pos": "gk",
      "title": "Suraj",
      "title_es": "Suraj"
    },
    {
      "name": "Seun Sogbeso",
      "pos": "def",
      "title": "Seun",
      "title_es": "Seun"
    },
    {
      "name": "Esosa Igbinoba",
      "pos": "mid",
      "title": "Esosa",
      "title_es": "Esosa"
    },
    {
      "name": "Silas Nwankwo",
      "pos": "st",
      "title": "Silas",
      "title_es": "Silas"
    }
  ],
  "Akwa United": [
    {
      "name": "Olorunleke Ojo",
      "pos": "gk",
      "title": "Olorunleke",
      "title_es": "Olorunleke"
    },
    {
      "name": "Olisa Ndah",
      "pos": "def",
      "title": "Olisa",
      "title_es": "Olisa"
    },
    {
      "name": "Afeez Aremu",
      "pos": "mid",
      "title": "Afeez",
      "title_es": "Afeez"
    },
    {
      "name": "Mfon Udoh",
      "pos": "st",
      "title": "Mfon",
      "title_es": "Mfon"
    }
  ],
  "Wikki Tourists": [
    {
      "name": "Haliru Sani",
      "pos": "gk",
      "title": "Haliru",
      "title_es": "Haliru"
    },
    {
      "name": "Mustapha Ibrahim",
      "pos": "def",
      "title": "Mustapha",
      "title_es": "Mustapha"
    },
    {
      "name": "Idris Guda",
      "pos": "mid",
      "title": "Idris",
      "title_es": "Idris"
    },
    {
      "name": "Godwin Obaje",
      "pos": "st",
      "title": "Godwin",
      "title_es": "Godwin"
    }
  ],
  "Niger Tornadoes": [
    {
      "name": "Mustapha Salisu",
      "pos": "gk",
      "title": "Mustapha",
      "title_es": "Mustapha"
    },
    {
      "name": "Reuben Ogbonnaya",
      "pos": "def",
      "title": "Reuben",
      "title_es": "Reuben"
    },
    {
      "name": "Gabriel Wassa",
      "pos": "mid",
      "title": "Gabriel",
      "title_es": "Gabriel"
    },
    {
      "name": "Sibi Gwar",
      "pos": "st",
      "title": "Sibi",
      "title_es": "Sibi"
    }
  ],
  "Ikorodu City": [
    {
      "name": "Aina",
      "pos": "gk",
      "title": "Aina",
      "title_es": "Aina"
    },
    {
      "name": "Harrison",
      "pos": "def",
      "title": "Harrison",
      "title_es": "Harrison"
    },
    {
      "name": "Tosin",
      "pos": "mid",
      "title": "Tosin",
      "title_es": "Tosin"
    },
    {
      "name": "Salami",
      "pos": "st",
      "title": "Salami",
      "title_es": "Salami"
    }
  ],
  "ASEC Mimosas": [
    {
      "name": "Alain Gouaméné",
      "pos": "gk",
      "title": "Alain",
      "title_es": "Alain"
    },
    {
      "name": "Kolo Touré",
      "pos": "def",
      "title": "Kolo",
      "title_es": "Kolo"
    },
    {
      "name": "Yaya Touré",
      "pos": "mid",
      "title": "Yaya",
      "title_es": "Yaya"
    },
    {
      "name": "Laurent Pokou",
      "pos": "st",
      "title": "L'Empereur Baoulé",
      "title_es": "El Emperador"
    }
  ],
  "San Pedro": [
    {
      "name": "Ira Eliezer Tapé",
      "pos": "gk",
      "title": "Tapé",
      "title_es": "Tapé"
    },
    {
      "name": "Jimoh Sherif",
      "pos": "def",
      "title": "Jimoh",
      "title_es": "Jimoh"
    },
    {
      "name": "Wayou Constant",
      "pos": "mid",
      "title": "Wayou",
      "title_es": "Wayou"
    },
    {
      "name": "Richard Zumah",
      "pos": "st",
      "title": "Richard",
      "title_es": "Richard"
    }
  ],
  "Africa Sports": [
    {
      "name": "Jean-Jacques Tizié",
      "pos": "gk",
      "title": "Jean-Jacques",
      "title_es": "Jean-Jacques"
    },
    {
      "name": "Rufin Lué",
      "pos": "def",
      "title": "Rufin",
      "title_es": "Rufin"
    },
    {
      "name": "Serge Maguy",
      "pos": "mid",
      "title": "Serge",
      "title_es": "Serge"
    },
    {
      "name": "Ahmed Ouattara",
      "pos": "st",
      "title": "Ahmed",
      "title_es": "Ahmed"
    }
  ],
  "Stade d'Abidjan": [
    {
      "name": "Drissa Bamba",
      "pos": "gk",
      "title": "Drissa",
      "title_es": "Drissa"
    },
    {
      "name": "Henri Konan",
      "pos": "def",
      "title": "Henri",
      "title_es": "Henri"
    },
    {
      "name": "Oumar Ben Salah",
      "pos": "mid",
      "title": "Oumar",
      "title_es": "Oumar"
    },
    {
      "name": "Maurice Déhi",
      "pos": "st",
      "title": "Maurice",
      "title_es": "Maurice"
    }
  ],
  "SOL FC": [
    {
      "name": "Youssouf Oumarou",
      "pos": "gk",
      "title": "Youssouf",
      "title_es": "Youssouf"
    },
    {
      "name": "Abdoul Kader Diarrassouba",
      "pos": "def",
      "title": "Abdoul",
      "title_es": "Abdoul"
    },
    {
      "name": "Christian Brou",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Kassoum Doumbia",
      "pos": "st",
      "title": "Kassoum",
      "title_es": "Kassoum"
    }
  ],
  "Racing d'Abidjan": [
    {
      "name": "Charles Folly",
      "pos": "gk",
      "title": "Charles",
      "title_es": "Charles"
    },
    {
      "name": "Ibrahim Doumbia",
      "pos": "def",
      "title": "Ibrahim",
      "title_es": "Ibrahim"
    },
    {
      "name": "N'Guessan Jean",
      "pos": "mid",
      "title": "Jean",
      "title_es": "Jean"
    },
    {
      "name": "Seydou Traoré",
      "pos": "st",
      "title": "Seydou",
      "title_es": "Seydou"
    }
  ],
  "SO Armée": [
    {
      "name": "Abdoul Karim Cissé",
      "pos": "gk",
      "title": "Karim",
      "title_es": "Karim"
    },
    {
      "name": "Souleymane Coulibaly",
      "pos": "def",
      "title": "Souleymane",
      "title_es": "Souleymane"
    },
    {
      "name": "Essis Aka",
      "pos": "mid",
      "title": "Essis",
      "title_es": "Essis"
    },
    {
      "name": "Oussou Konan",
      "pos": "st",
      "title": "Oussou",
      "title_es": "Oussou"
    }
  ],
  "Sporting Gagnoa": [
    {
      "name": "Zongo Baba",
      "pos": "gk",
      "title": "Zongo",
      "title_es": "Zongo"
    },
    {
      "name": "Marc Goua",
      "pos": "def",
      "title": "Marc",
      "title_es": "Marc"
    },
    {
      "name": "Sylla Banfa",
      "pos": "mid",
      "title": "Sylla",
      "title_es": "Sylla"
    },
    {
      "name": "Salif Bagaté",
      "pos": "st",
      "title": "Salif",
      "title_es": "Salif"
    }
  ],
  "AS Denguelé": [
    {
      "name": "El Hadj Danté",
      "pos": "gk",
      "title": "El Hadj",
      "title_es": "El Hadj"
    },
    {
      "name": "Ibrahim Touré",
      "pos": "def",
      "title": "Ibrahim",
      "title_es": "Ibrahim"
    },
    {
      "name": "Sékou Sanogo",
      "pos": "mid",
      "title": "Sékou",
      "title_es": "Sékou"
    },
    {
      "name": "Seydou Doumbia",
      "pos": "st",
      "title": "Seydou",
      "title_es": "Seydou"
    }
  ],
  "Bouaké FC": [
    {
      "name": "Ali Sangaré",
      "pos": "gk",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Issa Diarrassouba",
      "pos": "def",
      "title": "Issa",
      "title_es": "Issa"
    },
    {
      "name": "Ibrahima Diaby",
      "pos": "mid",
      "title": "Ibrahima",
      "title_es": "Ibrahima"
    },
    {
      "name": "Mohamed Bamba",
      "pos": "st",
      "title": "Mohamed",
      "title_es": "Mohamed"
    }
  ],
  "Olympiacos": [
    {
      "name": "Antonis Nikopolidis",
      "pos": "gk",
      "title": "Antonis",
      "title_es": "Antonis"
    },
    {
      "name": "Olof Mellberg",
      "pos": "def",
      "title": "Olof",
      "title_es": "Olof"
    },
    {
      "name": "Predrag Đorđević",
      "pos": "mid",
      "title": "Djole",
      "title_es": "Djole"
    },
    {
      "name": "Giovanni",
      "pos": "st",
      "title": "Giovanni",
      "title_es": "Giovanni"
    }
  ],
  "PAOK": [
    {
      "name": "Mladen Furtula",
      "pos": "gk",
      "title": "Mladen",
      "title_es": "Mladen"
    },
    {
      "name": "Konstantinos Iosifidis",
      "pos": "def",
      "title": "Konstantinos",
      "title_es": "Konstantinos"
    },
    {
      "name": "Theodoros Zagorakis",
      "pos": "mid",
      "title": "Theo",
      "title_es": "Theo"
    },
    {
      "name": "Giorgos Koudas",
      "pos": "st",
      "title": "Alexander the Great",
      "title_es": "Alejandro Magno"
    }
  ],
  "Panathinaikos": [
    {
      "name": "Józef Wandzik",
      "pos": "gk",
      "title": "Józef",
      "title_es": "Józef"
    },
    {
      "name": "Giannis Goumas",
      "pos": "def",
      "title": "Giannis",
      "title_es": "Giannis"
    },
    {
      "name": "Giorgos Karagounis",
      "pos": "mid",
      "title": "Typhoon",
      "title_es": "Tifón"
    },
    {
      "name": "Krzysztof Warzycha",
      "pos": "st",
      "title": "Krzysztof",
      "title_es": "Krzysztof"
    }
  ],
  "AEK": [
    {
      "name": "Ilias Atmatsidis",
      "pos": "gk",
      "title": "Ilias",
      "title_es": "Ilias"
    },
    {
      "name": "Stelios Manolas",
      "pos": "def",
      "title": "Stelios",
      "title_es": "Stelios"
    },
    {
      "name": "Vassilios Tsiartas",
      "pos": "mid",
      "title": "El Mago",
      "title_es": "El Mago"
    },
    {
      "name": "Thomas Mavros",
      "pos": "st",
      "title": "Thomas",
      "title_es": "Thomas"
    }
  ],
  "Aris": [
    {
      "name": "Nikos Christidis",
      "pos": "gk",
      "title": "Nikos",
      "title_es": "Nikos"
    },
    {
      "name": "Theodoros Pallas",
      "pos": "def",
      "title": "Theodoros",
      "title_es": "Theodoros"
    },
    {
      "name": "Dinos Kouis",
      "pos": "mid",
      "title": "Dinos",
      "title_es": "Dinos"
    },
    {
      "name": "Alekos Alexiadis",
      "pos": "st",
      "title": "Alekos",
      "title_es": "Alekos"
    }
  ],
  "Asteras Tripolis": [
    {
      "name": "Giorgos Bantis",
      "pos": "gk",
      "title": "Giorgos",
      "title_es": "Giorgos"
    },
    {
      "name": "Khalifa Sankaré",
      "pos": "def",
      "title": "Khalifa",
      "title_es": "Khalifa"
    },
    {
      "name": "Fernando Usero",
      "pos": "mid",
      "title": "Fernando",
      "title_es": "Fernando"
    },
    {
      "name": "Jerónimo Barrales",
      "pos": "st",
      "title": "Jerónimo",
      "title_es": "Jerónimo"
    }
  ],
  "OFI Crete": [
    {
      "name": "Kostas Chaniotakis",
      "pos": "gk",
      "title": "Kostas",
      "title_es": "Kostas"
    },
    {
      "name": "Stefanos Borbokis",
      "pos": "def",
      "title": "Stefanos",
      "title_es": "Stefanos"
    },
    {
      "name": "Nikos Nioplias",
      "pos": "mid",
      "title": "Nikos",
      "title_es": "Nikos"
    },
    {
      "name": "Nikos Machlas",
      "pos": "st",
      "title": "Nikos",
      "title_es": "Nikos"
    }
  ],
  "Atromitos": [
    {
      "name": "Velimir Radman",
      "pos": "gk",
      "title": "Velimir",
      "title_es": "Velimir"
    },
    {
      "name": "Sokratis Fytanidis",
      "pos": "def",
      "title": "Sokratis",
      "title_es": "Sokratis"
    },
    {
      "name": "Eduardo Brito",
      "pos": "mid",
      "title": "Eduardo",
      "title_es": "Eduardo"
    },
    {
      "name": "Stefano Napoleoni",
      "pos": "st",
      "title": "Stefano",
      "title_es": "Stefano"
    }
  ],
  "Panetolikos": [
    {
      "name": "Dimitrios Kyriakidis",
      "pos": "gk",
      "title": "Dimitrios",
      "title_es": "Dimitrios"
    },
    {
      "name": "Georgios Kousas",
      "pos": "def",
      "title": "Georgios",
      "title_es": "Georgios"
    },
    {
      "name": "Lucas Villafáñez",
      "pos": "mid",
      "title": "Lucas",
      "title_es": "Lucas"
    },
    {
      "name": "Henri Camara",
      "pos": "st",
      "title": "Henri",
      "title_es": "Henri"
    }
  ],
  "Volos": [
    {
      "name": "Boris Kleyman",
      "pos": "gk",
      "title": "Boris",
      "title_es": "Boris"
    },
    {
      "name": "Franco Ferrari",
      "pos": "def",
      "title": "Franco",
      "title_es": "Franco"
    },
    {
      "name": "Jean Barrientos",
      "pos": "mid",
      "title": "Jean",
      "title_es": "Jean"
    },
    {
      "name": "Tom van Weert",
      "pos": "st",
      "title": "Tom",
      "title_es": "Tom"
    }
  ],
  "Panserraikos": [
    {
      "name": "Dimitrios Gounaris",
      "pos": "gk",
      "title": "Dimitrios",
      "title_es": "Dimitrios"
    },
    {
      "name": "Pance Kumbev",
      "pos": "def",
      "title": "Pance",
      "title_es": "Pance"
    },
    {
      "name": "Georgios Tsifoutis",
      "pos": "mid",
      "title": "Georgios",
      "title_es": "Georgios"
    },
    {
      "name": "Bozhidar Iskrenov",
      "pos": "st",
      "title": "Bozhidar",
      "title_es": "Bozhidar"
    }
  ],
  "Levadiakos": [
    {
      "name": "Panagiotis Tsintotas",
      "pos": "gk",
      "title": "Panagiotis",
      "title_es": "Panagiotis"
    },
    {
      "name": "Giorgos Zisopoulos",
      "pos": "def",
      "title": "Giorgos",
      "title_es": "Giorgos"
    },
    {
      "name": "Chumbinho",
      "pos": "mid",
      "title": "Chumbinho",
      "title_es": "Chumbinho"
    },
    {
      "name": "Vangelis Mantzios",
      "pos": "st",
      "title": "Vangelis",
      "title_es": "Vangelis"
    }
  ],
  "Lamia": [
    {
      "name": "Nikos Papadopoulos",
      "pos": "gk",
      "title": "Nikos",
      "title_es": "Nikos"
    },
    {
      "name": "Anestis Anastasiadis",
      "pos": "def",
      "title": "Anestis",
      "title_es": "Anestis"
    },
    {
      "name": "Piti",
      "pos": "mid",
      "title": "Piti",
      "title_es": "Piti"
    },
    {
      "name": "Bachana Arabuli",
      "pos": "st",
      "title": "Bachana",
      "title_es": "Bachana"
    }
  ],
  "Kifisia": [
    {
      "name": "Alexandros Anagnostopoulos",
      "pos": "gk",
      "title": "Alexandros",
      "title_es": "Alexandros"
    },
    {
      "name": "Giannis Masouras",
      "pos": "def",
      "title": "Giannis",
      "title_es": "Giannis"
    },
    {
      "name": "Panagiotis Pritsas",
      "pos": "mid",
      "title": "Panagiotis",
      "title_es": "Panagiotis"
    },
    {
      "name": "Ognjen Ožegović",
      "pos": "st",
      "title": "Ognjen",
      "title_es": "Ognjen"
    }
  ],
  "Espérance": [
    {
      "name": "Chokri El Ouaer",
      "pos": "gk",
      "title": "Chokri",
      "title_es": "Chokri"
    },
    {
      "name": "Khaled Badra",
      "pos": "def",
      "title": "Khaled",
      "title_es": "Khaled"
    },
    {
      "name": "Tarak Dhiab",
      "pos": "mid",
      "title": "Emperor",
      "title_es": "Emperador"
    },
    {
      "name": "Michael Eneramo",
      "pos": "st",
      "title": "Michael",
      "title_es": "Michael"
    }
  ],
  "Étoile du Sahel": [
    {
      "name": "Aymen Mathlouthi",
      "pos": "gk",
      "title": "Balbouli",
      "title_es": "Balbouli"
    },
    {
      "name": "Radhi Jaïdi",
      "pos": "def",
      "title": "Radhi",
      "title_es": "Radhi"
    },
    {
      "name": "Zoubeir Baya",
      "pos": "mid",
      "title": "Zoubeir",
      "title_es": "Zoubeir"
    },
    {
      "name": "Francileudo Santos",
      "pos": "st",
      "title": "Santos",
      "title_es": "Santos"
    }
  ],
  "Club Africain": [
    {
      "name": "Sadok Sassi",
      "pos": "gk",
      "title": "Attouga",
      "title_es": "Attouga"
    },
    {
      "name": "Mahjoub Oueslati",
      "pos": "def",
      "title": "Mahjoub",
      "title_es": "Mahjoub"
    },
    {
      "name": "Lassaad Ouertani",
      "pos": "mid",
      "title": "Zgaw",
      "title_es": "Zgaw"
    },
    {
      "name": "Hédi Bayari",
      "pos": "st",
      "title": "Hédi",
      "title_es": "Hédi"
    }
  ],
  "CS Sfaxien": [
    {
      "name": "Rami Jridi",
      "pos": "gk",
      "title": "Rami",
      "title_es": "Rami"
    },
    {
      "name": "Hatem Trabelsi",
      "pos": "def",
      "title": "Hatem",
      "title_es": "Hatem"
    },
    {
      "name": "Hammadi Agrebi",
      "pos": "mid",
      "title": "Magician",
      "title_es": "Mago"
    },
    {
      "name": "Fakhreddine Ben Youssef",
      "pos": "st",
      "title": "Rouge",
      "title_es": "Rouge"
    }
  ],
  "US Monastir": [
    {
      "name": "Makram Bdiri",
      "pos": "gk",
      "title": "Makram",
      "title_es": "Makram"
    },
    {
      "name": "Zied Machmoum",
      "pos": "def",
      "title": "Zied",
      "title_es": "Zied"
    },
    {
      "name": "Elyes Jlassi",
      "pos": "mid",
      "title": "Elyes",
      "title_es": "Elyes"
    },
    {
      "name": "Anthony Okpotu",
      "pos": "st",
      "title": "Anthony",
      "title_es": "Anthony"
    }
  ],
  "Stade Tunisien": [
    {
      "name": "Hassen Bejaoui",
      "pos": "gk",
      "title": "Hassen",
      "title_es": "Hassen"
    },
    {
      "name": "Hamdi Marzouki",
      "pos": "def",
      "title": "Hamdi",
      "title_es": "Hamdi"
    },
    {
      "name": "Oussama Sellami",
      "pos": "mid",
      "title": "Oussama",
      "title_es": "Oussama"
    },
    {
      "name": "Tenema N'Diaye",
      "pos": "st",
      "title": "Tenema",
      "title_es": "Tenema"
    }
  ],
  "Olympique Béja": [
    {
      "name": "Ali Ayari",
      "pos": "gk",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Nabil Becha",
      "pos": "def",
      "title": "Nabil",
      "title_es": "Nabil"
    },
    {
      "name": "Skander Cheikh",
      "pos": "mid",
      "title": "Skander",
      "title_es": "Skander"
    },
    {
      "name": "Nabil Missaoui",
      "pos": "st",
      "title": "Nabil",
      "title_es": "Nabil"
    }
  ],
  "CA Bizertin": [
    {
      "name": "Farouk Ben Mustapha",
      "pos": "gk",
      "title": "Farouk",
      "title_es": "Farouk"
    },
    {
      "name": "Ali Machani",
      "pos": "def",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Youssoupha Mbengue",
      "pos": "mid",
      "title": "Youssoupha",
      "title_es": "Youssoupha"
    },
    {
      "name": "Houssine Dimassi",
      "pos": "st",
      "title": "Houssine",
      "title_es": "Houssine"
    }
  ],
  "AS Marsa": [
    {
      "name": "Sofiène Khabir",
      "pos": "gk",
      "title": "Sofiène",
      "title_es": "Sofiène"
    },
    {
      "name": "Mohamed Ali Mahjoubi",
      "pos": "def",
      "title": "Mohamed Ali",
      "title_es": "Mohamed Ali"
    },
    {
      "name": "Amine Ltaïef",
      "pos": "mid",
      "title": "Amine",
      "title_es": "Amine"
    },
    {
      "name": "Sabri Jaballah",
      "pos": "st",
      "title": "Sabri",
      "title_es": "Sabri"
    }
  ],
  "US Ben Guerdane": [
    {
      "name": "Seifeddine Charfi",
      "pos": "gk",
      "title": "Seifeddine",
      "title_es": "Seifeddine"
    },
    {
      "name": "Gil Bahia",
      "pos": "def",
      "title": "Gil",
      "title_es": "Gil"
    },
    {
      "name": "Lassaad Jaziri",
      "pos": "mid",
      "title": "Lassaad",
      "title_es": "Lassaad"
    },
    {
      "name": "Bahaeddine Sellami",
      "pos": "st",
      "title": "Bahaeddine",
      "title_es": "Bahaeddine"
    }
  ],
  "JS Omrane": [
    {
      "name": "Hassen",
      "pos": "gk",
      "title": "Hassen",
      "title_es": "Hassen"
    },
    {
      "name": "Mehdi",
      "pos": "def",
      "title": "Mehdi",
      "title_es": "Mehdi"
    },
    {
      "name": "Amine",
      "pos": "mid",
      "title": "Amine",
      "title_es": "Amine"
    },
    {
      "name": "Youssef",
      "pos": "st",
      "title": "Youssef",
      "title_es": "Youssef"
    }
  ],
  "EGS Gafsa": [
    {
      "name": "Atef Dkhili",
      "pos": "gk",
      "title": "Atef",
      "title_es": "Atef"
    },
    {
      "name": "Amine Abbès",
      "pos": "def",
      "title": "Amine",
      "title_es": "Amine"
    },
    {
      "name": "Hamza Ladab",
      "pos": "mid",
      "title": "Hamza",
      "title_es": "Hamza"
    },
    {
      "name": "Nabil Missaoui",
      "pos": "st",
      "title": "Nabil",
      "title_es": "Nabil"
    }
  ],
  "Celtic": [
    {
      "name": "Ronnie Simpson",
      "pos": "gk",
      "title": "Faither",
      "title_es": "Faither"
    },
    {
      "name": "Billy McNeill",
      "pos": "def",
      "title": "Cesar",
      "title_es": "César"
    },
    {
      "name": "Jimmy Johnstone",
      "pos": "mid",
      "title": "Jinky",
      "title_es": "Jinky"
    },
    {
      "name": "Henrik Larsson",
      "pos": "st",
      "title": "King of Kings",
      "title_es": "Rey de Reyes"
    }
  ],
  "Rangers": [
    {
      "name": "Andy Goram",
      "pos": "gk",
      "title": "The Goalie",
      "title_es": "El Arquero"
    },
    {
      "name": "John Greig",
      "pos": "def",
      "title": "Greatest Ever Ranger",
      "title_es": "El Más Grande"
    },
    {
      "name": "Paul Gascoigne",
      "pos": "mid",
      "title": "Gazza",
      "title_es": "Gazza"
    },
    {
      "name": "Ally McCoist",
      "pos": "st",
      "title": "Super Ally",
      "title_es": "Súper Ally"
    }
  ],
  "Aberdeen": [
    {
      "name": "Jim Leighton",
      "pos": "gk",
      "title": "Jim",
      "title_es": "Jim"
    },
    {
      "name": "Willie Miller",
      "pos": "def",
      "title": "Willie",
      "title_es": "Willie"
    },
    {
      "name": "Gordon Strachan",
      "pos": "mid",
      "title": "Gordon",
      "title_es": "Gordon"
    },
    {
      "name": "Joe Harper",
      "pos": "st",
      "title": "King Joey",
      "title_es": "Rey Joey"
    }
  ],
  "Hearts": [
    {
      "name": "Craig Gordon",
      "pos": "gk",
      "title": "Craig",
      "title_es": "Craig"
    },
    {
      "name": "Steven Pressley",
      "pos": "def",
      "title": "Elvis",
      "title_es": "Elvis"
    },
    {
      "name": "Rudi Skácel",
      "pos": "mid",
      "title": "Rudi",
      "title_es": "Rudi"
    },
    {
      "name": "John Robertson",
      "pos": "st",
      "title": "Robbo",
      "title_es": "Robbo"
    }
  ],
  "Hibernian": [
    {
      "name": "Jim McArthur",
      "pos": "gk",
      "title": "Jim",
      "title_es": "Jim"
    },
    {
      "name": "Pat Stanton",
      "pos": "def",
      "title": "Pat",
      "title_es": "Pat"
    },
    {
      "name": "Franck Sauzée",
      "pos": "mid",
      "title": "Le God",
      "title_es": "Le God"
    },
    {
      "name": "Lawrie Reilly",
      "pos": "st",
      "title": "Last-minute Lawrie",
      "title_es": "Lawrie"
    }
  ],
  "Kilmarnock": [
    {
      "name": "Alan Robertson",
      "pos": "gk",
      "title": "Alan",
      "title_es": "Alan"
    },
    {
      "name": "Ray Montgomerie",
      "pos": "def",
      "title": "Ray",
      "title_es": "Ray"
    },
    {
      "name": "Tommy Burns",
      "pos": "mid",
      "title": "Tommy",
      "title_es": "Tommy"
    },
    {
      "name": "Kris Boyd",
      "pos": "st",
      "title": "Boydy",
      "title_es": "Boydy"
    }
  ],
  "St Mirren": [
    {
      "name": "Campbell Money",
      "pos": "gk",
      "title": "Campbell",
      "title_es": "Campbell"
    },
    {
      "name": "Tony Fitzpatrick",
      "pos": "def",
      "title": "Tony",
      "title_es": "Tony"
    },
    {
      "name": "Hugh Murray",
      "pos": "mid",
      "title": "Shug",
      "title_es": "Shug"
    },
    {
      "name": "Steven Thompson",
      "pos": "st",
      "title": "Thommo",
      "title_es": "Thommo"
    }
  ],
  "Dundee United": [
    {
      "name": "Hamish McAlpine",
      "pos": "gk",
      "title": "Hamish",
      "title_es": "Hamish"
    },
    {
      "name": "David Narey",
      "pos": "def",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Eamonn Bannon",
      "pos": "mid",
      "title": "Eamonn",
      "title_es": "Eamonn"
    },
    {
      "name": "Paul Sturrock",
      "pos": "st",
      "title": "Luggy",
      "title_es": "Luggy"
    }
  ],
  "Motherwell": [
    {
      "name": "Darren Randolph",
      "pos": "gk",
      "title": "Darren",
      "title_es": "Darren"
    },
    {
      "name": "Stephen Craigan",
      "pos": "def",
      "title": "Stephen",
      "title_es": "Stephen"
    },
    {
      "name": "Phil O'Donnell",
      "pos": "mid",
      "title": "Uncle Phil",
      "title_es": "Tío Phil"
    },
    {
      "name": "James McFadden",
      "pos": "st",
      "title": "Faddy",
      "title_es": "Faddy"
    }
  ],
  "St Johnstone": [
    {
      "name": "Alan Main",
      "pos": "gk",
      "title": "Alan",
      "title_es": "Alan"
    },
    {
      "name": "Dave Mackay",
      "pos": "def",
      "title": "Dave",
      "title_es": "Dave"
    },
    {
      "name": "Chris Millar",
      "pos": "mid",
      "title": "Chris",
      "title_es": "Chris"
    },
    {
      "name": "Stevie May",
      "pos": "st",
      "title": "Stevie",
      "title_es": "Stevie"
    }
  ],
  "Ross County": [
    {
      "name": "Michael Fraser",
      "pos": "gk",
      "title": "Michael",
      "title_es": "Michael"
    },
    {
      "name": "Marcus Fraser",
      "pos": "def",
      "title": "Marcus",
      "title_es": "Marcus"
    },
    {
      "name": "Richard Brittain",
      "pos": "mid",
      "title": "Richard",
      "title_es": "Richard"
    },
    {
      "name": "Liam Boyce",
      "pos": "st",
      "title": "Boycey",
      "title_es": "Boycey"
    }
  ],
  "Livingston": [
    {
      "name": "Roddy McKenzie",
      "pos": "gk",
      "title": "Roddy",
      "title_es": "Roddy"
    },
    {
      "name": "Alan Lithgow",
      "pos": "def",
      "title": "Alan",
      "title_es": "Alan"
    },
    {
      "name": "Marvin Bartley",
      "pos": "mid",
      "title": "Marvin",
      "title_es": "Marvin"
    },
    {
      "name": "David Fernandez",
      "pos": "st",
      "title": "David",
      "title_es": "David"
    }
  ],
  "Olimpia": [
    {
      "name": "Éver Hugo Almeida",
      "pos": "gk",
      "title": "Éver",
      "title_es": "Éver"
    },
    {
      "name": "Rogelio Delgado",
      "pos": "def",
      "title": "Rogelio",
      "title_es": "Rogelio"
    },
    {
      "name": "Carlos Humberto Paredes",
      "pos": "mid",
      "title": "El Señor de la Mediacancha",
      "title_es": "El Señor"
    },
    {
      "name": "Roque Santa Cruz",
      "pos": "st",
      "title": "Roque",
      "title_es": "Roque"
    }
  ],
  "Cerro Porteño": [
    {
      "name": "Roberto Fernández",
      "pos": "gk",
      "title": "Gatito",
      "title_es": "Gatito"
    },
    {
      "name": "Francisco Arce",
      "pos": "def",
      "title": "Chiqui",
      "title_es": "Chiqui"
    },
    {
      "name": "Saturnino Arrúa",
      "pos": "mid",
      "title": "Nino",
      "title_es": "Nino"
    },
    {
      "name": "Virgilio Ferreira",
      "pos": "st",
      "title": "Virgilio",
      "title_es": "Virgilio"
    }
  ],
  "Libertad": [
    {
      "name": "Martín Silva",
      "pos": "gk",
      "title": "Martín",
      "title_es": "Martín"
    },
    {
      "name": "Pedro Sarabia",
      "pos": "def",
      "title": "Cabo",
      "title_es": "Cabo"
    },
    {
      "name": "Sergio Aquino",
      "pos": "mid",
      "title": "Patito",
      "title_es": "Patito"
    },
    {
      "name": "Óscar Cardozo",
      "pos": "st",
      "title": "Tacuara",
      "title_es": "Tacuara"
    }
  ],
  "Guaraní": [
    {
      "name": "Alfredo Aguilar",
      "pos": "gk",
      "title": "Alfredo",
      "title_es": "Alfredo"
    },
    {
      "name": "Julio César Cáceres",
      "pos": "def",
      "title": "El Emperador",
      "title_es": "El Emperador"
    },
    {
      "name": "Aureliano Torres",
      "pos": "mid",
      "title": "Aureliano",
      "title_es": "Aureliano"
    },
    {
      "name": "Fernando Fernández",
      "pos": "st",
      "title": "La Fiera",
      "title_es": "La Fiera"
    }
  ],
  "Nacional Asunción": [
    {
      "name": "Ignacio Don",
      "pos": "gk",
      "title": "Nacho",
      "title_es": "Nacho"
    },
    {
      "name": "Denis Caniza",
      "pos": "def",
      "title": "Denis",
      "title_es": "Denis"
    },
    {
      "name": "Marcos Riveros",
      "pos": "mid",
      "title": "Marcos",
      "title_es": "Marcos"
    },
    {
      "name": "Arsenio Erico",
      "pos": "st",
      "title": "El Saltarín Rojo",
      "title_es": "El Saltarín Rojo"
    }
  ],
  "Sportivo Luqueño": [
    {
      "name": "José Luis Chilavert",
      "pos": "gk",
      "title": "Chila",
      "title_es": "Chila"
    },
    {
      "name": "Pablo Aguilar",
      "pos": "def",
      "title": "Pablo",
      "title_es": "Pablo"
    },
    {
      "name": "Julio César Romero",
      "pos": "mid",
      "title": "Romerito",
      "title_es": "Romerito"
    },
    {
      "name": "Marcelo Ferreira",
      "pos": "st",
      "title": "Marcelo",
      "title_es": "Marcelo"
    }
  ],
  "Sportivo Ameliano": [
    {
      "name": "Víctor López",
      "pos": "gk",
      "title": "Víctor",
      "title_es": "Víctor"
    },
    {
      "name": "Walter Cabrera",
      "pos": "def",
      "title": "Walter",
      "title_es": "Walter"
    },
    {
      "name": "Edgar Zaracho",
      "pos": "mid",
      "title": "Edgar",
      "title_es": "Edgar"
    },
    {
      "name": "Alex Arce",
      "pos": "st",
      "title": "Alex",
      "title_es": "Alex"
    }
  ],
  "2 de Mayo": [
    {
      "name": "Enrique García",
      "pos": "gk",
      "title": "Enrique",
      "title_es": "Enrique"
    },
    {
      "name": "Richard Álvarez",
      "pos": "def",
      "title": "Richard",
      "title_es": "Richard"
    },
    {
      "name": "Jesús Araujo",
      "pos": "mid",
      "title": "Jesús",
      "title_es": "Jesús"
    },
    {
      "name": "Antonio Maidana",
      "pos": "st",
      "title": "Antonio",
      "title_es": "Antonio"
    }
  ],
  "General Caballero": [
    {
      "name": "Gustavo Arévalos",
      "pos": "gk",
      "title": "Gustavo",
      "title_es": "Gustavo"
    },
    {
      "name": "Tomás Lezcano",
      "pos": "def",
      "title": "Tomás",
      "title_es": "Tomás"
    },
    {
      "name": "Guillermo Hauché",
      "pos": "mid",
      "title": "Guillermo",
      "title_es": "Guillermo"
    },
    {
      "name": "Clementino González",
      "pos": "st",
      "title": "Clementino",
      "title_es": "Clementino"
    }
  ],
  "Deportivo Recoleta": [
    {
      "name": "Luis Franco",
      "pos": "gk",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Pedro Díaz",
      "pos": "def",
      "title": "Pedro",
      "title_es": "Pedro"
    },
    {
      "name": "Marcos Gamarra",
      "pos": "mid",
      "title": "Marcos",
      "title_es": "Marcos"
    },
    {
      "name": "Carlos González",
      "pos": "st",
      "title": "Carlos",
      "title_es": "Carlos"
    }
  ],
  "Atlético Tembetary": [
    {
      "name": "Ricardo Martínez",
      "pos": "gk",
      "title": "Ricardo",
      "title_es": "Ricardo"
    },
    {
      "name": "Juan Giménez",
      "pos": "def",
      "title": "Juan",
      "title_es": "Juan"
    },
    {
      "name": "Nelson Cuevas",
      "pos": "mid",
      "title": "Pipino",
      "title_es": "Pipino"
    },
    {
      "name": "Nelson Haedo Valdez",
      "pos": "st",
      "title": "León Guaraní",
      "title_es": "León Guaraní"
    }
  ],
  "Colo-Colo": [
    {
      "name": "Roberto Rojas",
      "pos": "gk",
      "title": "Cóndor",
      "title_es": "Cóndor"
    },
    {
      "name": "Elías Figueroa",
      "pos": "def",
      "title": "Don Elías",
      "title_es": "Don Elías"
    },
    {
      "name": "Francisco Valdés",
      "pos": "mid",
      "title": "Chamaco",
      "title_es": "Chamaco"
    },
    {
      "name": "Carlos Caszely",
      "pos": "st",
      "title": "El Rey del Metro Cuadrado",
      "title_es": "El Rey"
    }
  ],
  "Universidad de Chile": [
    {
      "name": "Sergio Vargas",
      "pos": "gk",
      "title": "Superman",
      "title_es": "Superman"
    },
    {
      "name": "Luis Eyzaguirre",
      "pos": "def",
      "title": "Fifo",
      "title_es": "Fifo"
    },
    {
      "name": "Leonel Sánchez",
      "pos": "mid",
      "title": "Leonel",
      "title_es": "Leonel"
    },
    {
      "name": "Marcelo Salas",
      "pos": "st",
      "title": "El Matador",
      "title_es": "El Matador"
    }
  ],
  "Universidad Católica": [
    {
      "name": "Sergio Livingstone",
      "pos": "gk",
      "title": "Sapo",
      "title_es": "Sapo"
    },
    {
      "name": "Raimundo Tupper",
      "pos": "def",
      "title": "Mumo",
      "title_es": "Mumo"
    },
    {
      "name": "Ignacio Prieto",
      "pos": "mid",
      "title": "Ignacio",
      "title_es": "Ignacio"
    },
    {
      "name": "Alberto Fouillioux",
      "pos": "st",
      "title": "Tito",
      "title_es": "Tito"
    }
  ],
  "Unión Española": [
    {
      "name": "Hernán Fernández",
      "pos": "gk",
      "title": "Nano",
      "title_es": "Nano"
    },
    {
      "name": "Atilio Cremaschi",
      "pos": "def",
      "title": "Atilio",
      "title_es": "Atilio"
    },
    {
      "name": "José Luis Sierra",
      "pos": "mid",
      "title": "Coto",
      "title_es": "Coto"
    },
    {
      "name": "Honorino Landa",
      "pos": "st",
      "title": "Nino",
      "title_es": "Nino"
    }
  ],
  "Palestino": [
    {
      "name": "Darío Melo",
      "pos": "gk",
      "title": "Darío",
      "title_es": "Darío"
    },
    {
      "name": "Elías Figueroa",
      "pos": "def",
      "title": "Don Elías",
      "title_es": "Don Elías"
    },
    {
      "name": "Luis Jiménez",
      "pos": "mid",
      "title": "Mago",
      "title_es": "Mago"
    },
    {
      "name": "Óscar Fabbiani",
      "pos": "st",
      "title": "Óscar",
      "title_es": "Óscar"
    }
  ],
  "Huachipato": [
    {
      "name": "Cristián Muñoz",
      "pos": "gk",
      "title": "Tigre",
      "title_es": "Tigre"
    },
    {
      "name": "Omar Merlo",
      "pos": "def",
      "title": "Omar",
      "title_es": "Omar"
    },
    {
      "name": "Lorenzo Reyes",
      "pos": "mid",
      "title": "Lolo",
      "title_es": "Lolo"
    },
    {
      "name": "Braian Rodríguez",
      "pos": "st",
      "title": "Braian",
      "title_es": "Braian"
    }
  ],
  "Coquimbo Unido": [
    {
      "name": "Matías Cano",
      "pos": "gk",
      "title": "Matías",
      "title_es": "Matías"
    },
    {
      "name": "Alí Manouchehri",
      "pos": "def",
      "title": "Alí",
      "title_es": "Alí"
    },
    {
      "name": "Carlos Carmona",
      "pos": "mid",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Mauricio Pinilla",
      "pos": "st",
      "title": "Pinigol",
      "title_es": "Pinigol"
    }
  ],
  "Audax Italiano": [
    {
      "name": "Nicolás Peric",
      "pos": "gk",
      "title": "Loco",
      "title_es": "Loco"
    },
    {
      "name": "Carlos Labrín",
      "pos": "def",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Carlos Villanueva",
      "pos": "mid",
      "title": "Piña",
      "title_es": "Piña"
    },
    {
      "name": "Humberto Suazo",
      "pos": "st",
      "title": "Chupete",
      "title_es": "Chupete"
    }
  ],
  "O'Higgins": [
    {
      "name": "Paulo Garcés",
      "pos": "gk",
      "title": "Halcón",
      "title_es": "Halcón"
    },
    {
      "name": "Albert Acevedo",
      "pos": "def",
      "title": "Albert",
      "title_es": "Albert"
    },
    {
      "name": "Braulio Leal",
      "pos": "mid",
      "title": "Braulio",
      "title_es": "Braulio"
    },
    {
      "name": "Pablo Calandria",
      "pos": "st",
      "title": "Pablo",
      "title_es": "Pablo"
    }
  ],
  "Ñublense": [
    {
      "name": "Nicola Pérez",
      "pos": "gk",
      "title": "Nicola",
      "title_es": "Nicola"
    },
    {
      "name": "Jovany Campusano",
      "pos": "def",
      "title": "Jovany",
      "title_es": "Jovany"
    },
    {
      "name": "Federico Mateos",
      "pos": "mid",
      "title": "Federico",
      "title_es": "Federico"
    },
    {
      "name": "Patricio Rubio",
      "pos": "st",
      "title": "Pato",
      "title_es": "Pato"
    }
  ],
  "Cobresal": [
    {
      "name": "Leandro Requena",
      "pos": "gk",
      "title": "Leandro",
      "title_es": "Leandro"
    },
    {
      "name": "Víctor Osorio",
      "pos": "def",
      "title": "Víctor",
      "title_es": "Víctor"
    },
    {
      "name": "Charles Aránguiz",
      "pos": "mid",
      "title": "Príncipe",
      "title_es": "Príncipe"
    },
    {
      "name": "Iván Zamorano",
      "pos": "st",
      "title": "Bam Bam",
      "title_es": "Bam Bam"
    }
  ],
  "Everton Viña": [
    {
      "name": "Gustavo Dalsasso",
      "pos": "gk",
      "title": "Gustavo",
      "title_es": "Gustavo"
    },
    {
      "name": "Marcos Velásquez",
      "pos": "def",
      "title": "Marcos",
      "title_es": "Marcos"
    },
    {
      "name": "Maximiliano Cerato",
      "pos": "mid",
      "title": "Maxi",
      "title_es": "Maxi"
    },
    {
      "name": "Ezequiel Miralles",
      "pos": "st",
      "title": "Ezequiel",
      "title_es": "Ezequiel"
    }
  ],
  "Deportes Iquique": [
    {
      "name": "Rodrigo Naranjo",
      "pos": "gk",
      "title": "Rodrigo",
      "title_es": "Rodrigo"
    },
    {
      "name": "Mauricio Zenteno",
      "pos": "def",
      "title": "Mauricio",
      "title_es": "Mauricio"
    },
    {
      "name": "Rafael Caroca",
      "pos": "mid",
      "title": "Rafa",
      "title_es": "Rafa"
    },
    {
      "name": "Edson Puch",
      "pos": "st",
      "title": "Edson",
      "title_es": "Edson"
    }
  ],
  "La Serena": [
    {
      "name": "Gastón Losa",
      "pos": "gk",
      "title": "Gastón",
      "title_es": "Gastón"
    },
    {
      "name": "Rodrigo Brito",
      "pos": "def",
      "title": "Rodrigo",
      "title_es": "Rodrigo"
    },
    {
      "name": "Jaime Valdés",
      "pos": "mid",
      "title": "Pajarito",
      "title_es": "Pajarito"
    },
    {
      "name": "Mauricio Salazar",
      "pos": "st",
      "title": "Ingeniero",
      "title_es": "Ingeniero"
    }
  ],
  "Universitario": [
    {
      "name": "Óscar Ibáñez",
      "pos": "gk",
      "title": "Óscar",
      "title_es": "Óscar"
    },
    {
      "name": "Héctor Chumpitaz",
      "pos": "def",
      "title": "Capitán de América",
      "title_es": "Capitán de América"
    },
    {
      "name": "Roberto Challe",
      "pos": "mid",
      "title": "Niño Terrible",
      "title_es": "Niño Terrible"
    },
    {
      "name": "Teodoro Fernández",
      "pos": "st",
      "title": "Lolo",
      "title_es": "Lolo"
    }
  ],
  "Sporting Cristal": [
    {
      "name": "Julio César Balerio",
      "pos": "gk",
      "title": "Viejo",
      "title_es": "Viejo"
    },
    {
      "name": "Orlando la Torre",
      "pos": "def",
      "title": "Chito",
      "title_es": "Chito"
    },
    {
      "name": "Roberto Palacios",
      "pos": "mid",
      "title": "Chorri",
      "title_es": "Chorri"
    },
    {
      "name": "Alberto Gallardo",
      "pos": "st",
      "title": "Jet",
      "title_es": "Jet"
    }
  ],
  "Alianza Lima": [
    {
      "name": "Leao Butrón",
      "pos": "gk",
      "title": "Leao",
      "title_es": "Leao"
    },
    {
      "name": "Jaime Duarte",
      "pos": "def",
      "title": "Jaime",
      "title_es": "Jaime"
    },
    {
      "name": "Teófilo Cubillas",
      "pos": "mid",
      "title": "Nene",
      "title_es": "Nene"
    },
    {
      "name": "Alejandro Villanueva",
      "pos": "st",
      "title": "Manguera",
      "title_es": "Manguera"
    }
  ],
  "Melgar": [
    {
      "name": "Carlos Cáceda",
      "pos": "gk",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Leonel Galeano",
      "pos": "def",
      "title": "Leonel",
      "title_es": "Leonel"
    },
    {
      "name": "Alexis Arias",
      "pos": "mid",
      "title": "Chaka",
      "title_es": "Chaka"
    },
    {
      "name": "Bernardo Cuesta",
      "pos": "st",
      "title": "Bernie",
      "title_es": "Bernie"
    }
  ],
  "Cienciano": [
    {
      "name": "Jesús Cisneros",
      "pos": "gk",
      "title": "Jesús",
      "title_es": "Jesús"
    },
    {
      "name": "Carlos Lugo",
      "pos": "def",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Julio García",
      "pos": "mid",
      "title": "Pincel",
      "title_es": "Pincel"
    },
    {
      "name": "Germán Carty",
      "pos": "st",
      "title": "Avestruz",
      "title_es": "Avestruz"
    }
  ],
  "Cusco FC": [
    {
      "name": "Diego Penny",
      "pos": "gk",
      "title": "Diego",
      "title_es": "Diego"
    },
    {
      "name": "Leandro Fleitas",
      "pos": "def",
      "title": "La Máquina",
      "title_es": "La Máquina"
    },
    {
      "name": "Alfredo Ramúa",
      "pos": "mid",
      "title": "Chapu",
      "title_es": "Chapu"
    },
    {
      "name": "Danilo Carando",
      "pos": "st",
      "title": "Danilo",
      "title_es": "Danilo"
    }
  ],
  "ADT": [
    {
      "name": "Ignacio Barrios",
      "pos": "gk",
      "title": "Ignacio",
      "title_es": "Ignacio"
    },
    {
      "name": "Gu-Rum Min",
      "pos": "def",
      "title": "Gu-Rum",
      "title_es": "Gu-Rum"
    },
    {
      "name": "Kevin Serna",
      "pos": "mid",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "Janio Pósito",
      "pos": "st",
      "title": "Janio",
      "title_es": "Janio"
    }
  ],
  "Sport Huancayo": [
    {
      "name": "Joel Pinto",
      "pos": "gk",
      "title": "Gato",
      "title_es": "Gato"
    },
    {
      "name": "Víctor Balta",
      "pos": "def",
      "title": "Víctor",
      "title_es": "Víctor"
    },
    {
      "name": "Marcos Lliuya",
      "pos": "mid",
      "title": "Marcos",
      "title_es": "Marcos"
    },
    {
      "name": "Carlos Neumann",
      "pos": "st",
      "title": "Carlos",
      "title_es": "Carlos"
    }
  ],
  "Atlético Grau": [
    {
      "name": "Ronald Ruiz",
      "pos": "gk",
      "title": "Banana",
      "title_es": "Banana"
    },
    {
      "name": "Marcelo Gaona",
      "pos": "def",
      "title": "Marcelo",
      "title_es": "Marcelo"
    },
    {
      "name": "Reimond Manco",
      "pos": "mid",
      "title": "Reimond",
      "title_es": "Reimond"
    },
    {
      "name": "Jeferson Collazos",
      "pos": "st",
      "title": "Jeferson",
      "title_es": "Jeferson"
    }
  ],
  "Deportivo Garcilaso": [
    {
      "name": "Miguel Vargas",
      "pos": "gk",
      "title": "Miguel",
      "title_es": "Miguel"
    },
    {
      "name": "Juan Diego Lojas",
      "pos": "def",
      "title": "Juan Diego",
      "title_es": "Juan Diego"
    },
    {
      "name": "Joao Rojas",
      "pos": "mid",
      "title": "Joao",
      "title_es": "Joao"
    },
    {
      "name": "Santiago Giordana",
      "pos": "st",
      "title": "Santiago",
      "title_es": "Santiago"
    }
  ],
  "Comerciantes Unidos": [
    {
      "name": "Exar Rosales",
      "pos": "gk",
      "title": "Exar",
      "title_es": "Exar"
    },
    {
      "name": "Christian Laura",
      "pos": "def",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Carlos Flores",
      "pos": "mid",
      "title": "Kukín",
      "title_es": "Kukín"
    },
    {
      "name": "Carlos Pérez",
      "pos": "st",
      "title": "Carlos",
      "title_es": "Carlos"
    }
  ],
  "Juan Pablo II": [
    {
      "name": "Matías Vega",
      "pos": "gk",
      "title": "Matías",
      "title_es": "Matías"
    },
    {
      "name": "Luis Trujillo",
      "pos": "def",
      "title": "Talara",
      "title_es": "Talara"
    },
    {
      "name": "Jack Safra",
      "pos": "mid",
      "title": "Jack",
      "title_es": "Jack"
    },
    {
      "name": "Nahuel Rodríguez",
      "pos": "st",
      "title": "Nahuel",
      "title_es": "Nahuel"
    }
  ],
  "Deportivo Táchira": [
    {
      "name": "Rafael Romo",
      "pos": "gk",
      "title": "Rafael",
      "title_es": "Rafael"
    },
    {
      "name": "Gerzon Chacón",
      "pos": "def",
      "title": "Gerzon",
      "title_es": "Gerzon"
    },
    {
      "name": "Tomás Rincón",
      "pos": "mid",
      "title": "El General",
      "title_es": "El General"
    },
    {
      "name": "Giancarlo Maldonado",
      "pos": "st",
      "title": "Giancarlo",
      "title_es": "Giancarlo"
    }
  ],
  "Caracas": [
    {
      "name": "Renny Vega",
      "pos": "gk",
      "title": "Renny",
      "title_es": "Renny"
    },
    {
      "name": "José Manuel Rey",
      "pos": "def",
      "title": "Tetero",
      "title_es": "Tetero"
    },
    {
      "name": "Ronald Vargas",
      "pos": "mid",
      "title": "Ronita",
      "title_es": "Ronita"
    },
    {
      "name": "Josef Martínez",
      "pos": "st",
      "title": "Josef",
      "title_es": "Josef"
    }
  ],
  "Metropolitanos": [
    {
      "name": "Tito Rojas",
      "pos": "gk",
      "title": "Tito",
      "title_es": "Tito"
    },
    {
      "name": "Steven Pabón",
      "pos": "def",
      "title": "Steven",
      "title_es": "Steven"
    },
    {
      "name": "Christian Larotonda",
      "pos": "mid",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Charlis Ortiz",
      "pos": "st",
      "title": "Charlis",
      "title_es": "Charlis"
    }
  ],
  "Estudiantes de Mérida": [
    {
      "name": "Alejandro Araque",
      "pos": "gk",
      "title": "Alejandro",
      "title_es": "Alejandro"
    },
    {
      "name": "William Díaz",
      "pos": "def",
      "title": "William",
      "title_es": "William"
    },
    {
      "name": "Jesús Gómez",
      "pos": "mid",
      "title": "La Pulga",
      "title_es": "La Pulga"
    },
    {
      "name": "Armando Araque",
      "pos": "st",
      "title": "Armando",
      "title_es": "Armando"
    }
  ],
  "Carabobo": [
    {
      "name": "Leo Morales",
      "pos": "gk",
      "title": "Leo",
      "title_es": "Leo"
    },
    {
      "name": "Carlos Rivero",
      "pos": "def",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Aquiles Ocanto",
      "pos": "mid",
      "title": "Aquiles",
      "title_es": "Aquiles"
    },
    {
      "name": "Tommy Tobar",
      "pos": "st",
      "title": "Tommy",
      "title_es": "Tommy"
    }
  ],
  "Monagas": [
    {
      "name": "Nicolás Caprio",
      "pos": "gk",
      "title": "Nicolás",
      "title_es": "Nicolás"
    },
    {
      "name": "Óscar González",
      "pos": "def",
      "title": "Óscar",
      "title_es": "Óscar"
    },
    {
      "name": "Vicente Rodríguez",
      "pos": "mid",
      "title": "Vicente",
      "title_es": "Vicente"
    },
    {
      "name": "Anthony Blondell",
      "pos": "st",
      "title": "Anthony",
      "title_es": "Anthony"
    }
  ],
  "Portuguesa": [
    {
      "name": "Yonathann Yustiz",
      "pos": "gk",
      "title": "Yonathann",
      "title_es": "Yonathann"
    },
    {
      "name": "Leandro Lugarzo",
      "pos": "def",
      "title": "Leandro",
      "title_es": "Leandro"
    },
    {
      "name": "Bernaldo Manzano",
      "pos": "mid",
      "title": "Bernaldo",
      "title_es": "Bernaldo"
    },
    {
      "name": "Richard Blanco",
      "pos": "st",
      "title": "Avioncito",
      "title_es": "Avioncito"
    }
  ],
  "Zamora": [
    {
      "name": "Carlos Salazar",
      "pos": "gk",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Ignacio González",
      "pos": "def",
      "title": "Ignacio",
      "title_es": "Ignacio"
    },
    {
      "name": "Pedro Ramírez",
      "pos": "mid",
      "title": "Pedro",
      "title_es": "Pedro"
    },
    {
      "name": "Gabriel Torres",
      "pos": "st",
      "title": "Gaby",
      "title_es": "Gaby"
    }
  ],
  "Academia Puerto Cabello": [
    {
      "name": "Luis Romero",
      "pos": "gk",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Edwin Peraza",
      "pos": "def",
      "title": "Edwin",
      "title_es": "Edwin"
    },
    {
      "name": "Samuel Sosa",
      "pos": "mid",
      "title": "Samuel",
      "title_es": "Samuel"
    },
    {
      "name": "Luifer Hernández",
      "pos": "st",
      "title": "Luifer",
      "title_es": "Luifer"
    }
  ],
  "Deportivo La Guaira": [
    {
      "name": "Carlos Olses",
      "pos": "gk",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Jon Aramburu",
      "pos": "def",
      "title": "Jon",
      "title_es": "Jon"
    },
    {
      "name": "Arles Flores",
      "pos": "mid",
      "title": "Arles",
      "title_es": "Arles"
    },
    {
      "name": "José Balza",
      "pos": "st",
      "title": "José",
      "title_es": "José"
    }
  ],
  "Rayo Zuliano": [
    {
      "name": "Luis Corredor",
      "pos": "gk",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Hermes Rodríguez",
      "pos": "def",
      "title": "Hermes",
      "title_es": "Hermes"
    },
    {
      "name": "Jesús Meza",
      "pos": "mid",
      "title": "Chiki",
      "title_es": "Chiki"
    },
    {
      "name": "Saimon Ramírez",
      "pos": "st",
      "title": "Saimon",
      "title_es": "Saimon"
    }
  ],
  "Yaracuyanos": [
    {
      "name": "Alexis Angulo",
      "pos": "gk",
      "title": "Alexis",
      "title_es": "Alexis"
    },
    {
      "name": "Jhonny González",
      "pos": "def",
      "title": "Jhonny",
      "title_es": "Jhonny"
    },
    {
      "name": "Javier Guillén",
      "pos": "mid",
      "title": "Javier",
      "title_es": "Javier"
    },
    {
      "name": "Elioscar Lizardo",
      "pos": "st",
      "title": "Elioscar",
      "title_es": "Elioscar"
    }
  ],
  "Toronto FC": [
    {
      "name": "Stefan Frei",
      "pos": "gk",
      "title": "Stefan",
      "title_es": "Stefan"
    },
    {
      "name": "Drew Moor",
      "pos": "def",
      "title": "Drew",
      "title_es": "Drew"
    },
    {
      "name": "Michael Bradley",
      "pos": "mid",
      "title": "The General",
      "title_es": "El General"
    },
    {
      "name": "Sebastian Giovinco",
      "pos": "st",
      "title": "Atomic Ant",
      "title_es": "Hormiga Atómica"
    }
  ],
  "Vancouver Whitecaps": [
    {
      "name": "David Ousted",
      "pos": "gk",
      "title": "David",
      "title_es": "David"
    },
    {
      "name": "Kendall Waston",
      "pos": "def",
      "title": "Towering Tico",
      "title_es": "Tico"
    },
    {
      "name": "Pedro Morales",
      "pos": "mid",
      "title": "Pedro",
      "title_es": "Pedro"
    },
    {
      "name": "Camilo Sanvezzo",
      "pos": "st",
      "title": "Camilo",
      "title_es": "Camilo"
    }
  ],
  "CF Montréal": [
    {
      "name": "Evan Bush",
      "pos": "gk",
      "title": "Evan",
      "title_es": "Evan"
    },
    {
      "name": "Laurent Ciman",
      "pos": "def",
      "title": "The General",
      "title_es": "El General"
    },
    {
      "name": "Ignacio Piatti",
      "pos": "mid",
      "title": "Nacho",
      "title_es": "Nacho"
    },
    {
      "name": "Marco Di Vaio",
      "pos": "st",
      "title": "Marco",
      "title_es": "Marco"
    }
  ],
  "Forge FC": [
    {
      "name": "Triston Henry",
      "pos": "gk",
      "title": "Triston",
      "title_es": "Triston"
    },
    {
      "name": "Alexander Achinioti-Jönsson",
      "pos": "def",
      "title": "Alex",
      "title_es": "Alex"
    },
    {
      "name": "Kyle Bekker",
      "pos": "mid",
      "title": "Kyle",
      "title_es": "Kyle"
    },
    {
      "name": "Tristan Borges",
      "pos": "st",
      "title": "Tristan",
      "title_es": "Tristan"
    }
  ],
  "Cavalry FC": [
    {
      "name": "Marco Carducci",
      "pos": "gk",
      "title": "Marco",
      "title_es": "Marco"
    },
    {
      "name": "Dominick Zator",
      "pos": "def",
      "title": "Dominick",
      "title_es": "Dominick"
    },
    {
      "name": "Sergio Camargo",
      "pos": "mid",
      "title": "Sergio",
      "title_es": "Sergio"
    },
    {
      "name": "Myer Bevan",
      "pos": "st",
      "title": "Myer",
      "title_es": "Myer"
    }
  ],
  "Atlético Ottawa": [
    {
      "name": "Nathan Ingham",
      "pos": "gk",
      "title": "Nathan",
      "title_es": "Nathan"
    },
    {
      "name": "Drew Beckie",
      "pos": "def",
      "title": "Drew",
      "title_es": "Drew"
    },
    {
      "name": "Ollie Bassett",
      "pos": "mid",
      "title": "Ollie",
      "title_es": "Ollie"
    },
    {
      "name": "Malcolm Shaw",
      "pos": "st",
      "title": "Malcolm",
      "title_es": "Malcolm"
    }
  ],
  "Pacific FC": [
    {
      "name": "Callum Irving",
      "pos": "gk",
      "title": "Callum",
      "title_es": "Callum"
    },
    {
      "name": "Thomas Meilleur-Giguère",
      "pos": "def",
      "title": "Thomas",
      "title_es": "Thomas"
    },
    {
      "name": "Marco Bustos",
      "pos": "mid",
      "title": "Marco",
      "title_es": "Marco"
    },
    {
      "name": "Terran Campbell",
      "pos": "st",
      "title": "Terran",
      "title_es": "Terran"
    }
  ],
  "HFX Wanderers": [
    {
      "name": "Christian Oxner",
      "pos": "gk",
      "title": "Christian",
      "title_es": "Christian"
    },
    {
      "name": "Peter Schaale",
      "pos": "def",
      "title": "Peter",
      "title_es": "Peter"
    },
    {
      "name": "Andre Rampersad",
      "pos": "mid",
      "title": "Andre",
      "title_es": "Andre"
    },
    {
      "name": "Akeem Garcia",
      "pos": "st",
      "title": "Akeem",
      "title_es": "Akeem"
    }
  ],
  "Valour FC": [
    {
      "name": "Jonathan Sirois",
      "pos": "gk",
      "title": "Jonathan",
      "title_es": "Jonathan"
    },
    {
      "name": "Andrew Jean-Baptiste",
      "pos": "def",
      "title": "Andrew",
      "title_es": "Andrew"
    },
    {
      "name": "Diego Gutiérrez",
      "pos": "mid",
      "title": "Diego",
      "title_es": "Diego"
    },
    {
      "name": "Moses Dyer",
      "pos": "st",
      "title": "Moses",
      "title_es": "Moses"
    }
  ],
  "York United": [
    {
      "name": "Niko Giantsopoulos",
      "pos": "gk",
      "title": "Niko",
      "title_es": "Niko"
    },
    {
      "name": "Roger Thompson",
      "pos": "def",
      "title": "Roger",
      "title_es": "Roger"
    },
    {
      "name": "Michael Petrasso",
      "pos": "mid",
      "title": "Michael",
      "title_es": "Michael"
    },
    {
      "name": "Osaze De Rosario",
      "pos": "st",
      "title": "Osaze",
      "title_es": "Osaze"
    }
  ],
  "Al-Sadd": [
    {
      "name": "Saad Al Sheeb",
      "pos": "gk",
      "title": "Saad",
      "title_es": "Saad"
    },
    {
      "name": "Abdelkarim Hassan",
      "pos": "def",
      "title": "Kimo",
      "title_es": "Kimo"
    },
    {
      "name": "Xavi",
      "pos": "mid",
      "title": "El Maestro",
      "title_es": "El Maestro"
    },
    {
      "name": "Baghdad Bounedjah",
      "pos": "st",
      "title": "Baghdad",
      "title_es": "Baghdad"
    }
  ],
  "Al-Duhail": [
    {
      "name": "Amine Lecomte",
      "pos": "gk",
      "title": "Amine",
      "title_es": "Amine"
    },
    {
      "name": "Lucas Mendes",
      "pos": "def",
      "title": "Lucas",
      "title_es": "Lucas"
    },
    {
      "name": "Nam Tae-hee",
      "pos": "mid",
      "title": "Nam",
      "title_es": "Nam"
    },
    {
      "name": "Youssef El-Arabi",
      "pos": "st",
      "title": "Youssef",
      "title_es": "Youssef"
    }
  ],
  "Al-Rayyan": [
    {
      "name": "Omar Barry",
      "pos": "gk",
      "title": "Omar",
      "title_es": "Omar"
    },
    {
      "name": "Nathan Ribeiro",
      "pos": "def",
      "title": "Nathan",
      "title_es": "Nathan"
    },
    {
      "name": "Rodrigo Tabata",
      "pos": "mid",
      "title": "Tabata",
      "title_es": "Tabata"
    },
    {
      "name": "Sebastián Soria",
      "pos": "st",
      "title": "Sebastián",
      "title_es": "Sebastián"
    }
  ],
  "Al-Arabi": [
    {
      "name": "Masoud Zarei",
      "pos": "gk",
      "title": "Masoud",
      "title_es": "Masoud"
    },
    {
      "name": "Boualem Khoukhi",
      "pos": "def",
      "title": "Boualem",
      "title_es": "Boualem"
    },
    {
      "name": "Ashkan Dejagah",
      "pos": "mid",
      "title": "Ashkan",
      "title_es": "Ashkan"
    },
    {
      "name": "Gabriel Batistuta",
      "pos": "st",
      "title": "Batigol",
      "title_es": "Batigol"
    }
  ],
  "Al-Gharafa": [
    {
      "name": "Qasem Burhan",
      "pos": "gk",
      "title": "Qasem",
      "title_es": "Qasem"
    },
    {
      "name": "Bilal Mohammed",
      "pos": "def",
      "title": "Bilal",
      "title_es": "Bilal"
    },
    {
      "name": "Juninho Pernambucano",
      "pos": "mid",
      "title": "Juninho",
      "title_es": "Juninho"
    },
    {
      "name": "Younis Mahmoud",
      "pos": "st",
      "title": "Younis",
      "title_es": "Younis"
    }
  ],
  "Al-Wakrah": [
    {
      "name": "Hassan Idrees",
      "pos": "gk",
      "title": "Hassan",
      "title_es": "Hassan"
    },
    {
      "name": "Ali Rehema",
      "pos": "def",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Ahmed Fadhil",
      "pos": "mid",
      "title": "Ahmed",
      "title_es": "Ahmed"
    },
    {
      "name": "Mansour Muftah",
      "pos": "st",
      "title": "Mansour",
      "title_es": "Mansour"
    }
  ],
  "Qatar SC": [
    {
      "name": "Hussain Al-Romaihi",
      "pos": "gk",
      "title": "Hussain",
      "title_es": "Hussain"
    },
    {
      "name": "Khalid Saleh",
      "pos": "def",
      "title": "Khalid",
      "title_es": "Khalid"
    },
    {
      "name": "Jay-Jay Okocha",
      "pos": "mid",
      "title": "Jay-Jay",
      "title_es": "Jay-Jay"
    },
    {
      "name": "Samuel Eto'o",
      "pos": "st",
      "title": "Samuel",
      "title_es": "Samuel"
    }
  ],
  "Umm Salal": [
    {
      "name": "Baba Malick",
      "pos": "gk",
      "title": "Baba",
      "title_es": "Baba"
    },
    {
      "name": "Jawad Ahannach",
      "pos": "def",
      "title": "Jawad",
      "title_es": "Jawad"
    },
    {
      "name": "Fábio César",
      "pos": "mid",
      "title": "Fábio",
      "title_es": "Fábio"
    },
    {
      "name": "Magno Alves",
      "pos": "st",
      "title": "Magno",
      "title_es": "Magno"
    }
  ],
  "Al-Shahania": [
    {
      "name": "Khalifa Al-Dosari",
      "pos": "gk",
      "title": "Khalifa",
      "title_es": "Khalifa"
    },
    {
      "name": "Álvaro Mejía",
      "pos": "def",
      "title": "Álvaro",
      "title_es": "Álvaro"
    },
    {
      "name": "Nigel de Jong",
      "pos": "mid",
      "title": "Nigel",
      "title_es": "Nigel"
    },
    {
      "name": "Kalu Uche",
      "pos": "st",
      "title": "Kalu",
      "title_es": "Kalu"
    }
  ],
  "Al-Khor": [
    {
      "name": "Baba Jibril",
      "pos": "gk",
      "title": "Baba",
      "title_es": "Baba"
    },
    {
      "name": "Mustafa Jalal",
      "pos": "def",
      "title": "Mustafa",
      "title_es": "Mustafa"
    },
    {
      "name": "Madson",
      "pos": "mid",
      "title": "Madson",
      "title_es": "Madson"
    },
    {
      "name": "Julio Cesar",
      "pos": "st",
      "title": "Julio",
      "title_es": "Julio"
    }
  ],
  "Al-Sailiya": [
    {
      "name": "Gregory Gomis",
      "pos": "gk",
      "title": "Gregory",
      "title_es": "Gregory"
    },
    {
      "name": "Mustafa Hafeth",
      "pos": "def",
      "title": "Mustafa",
      "title_es": "Mustafa"
    },
    {
      "name": "Nadir Belhadj",
      "pos": "mid",
      "title": "Nadir",
      "title_es": "Nadir"
    },
    {
      "name": "Moumouni Dagano",
      "pos": "st",
      "title": "Moumouni",
      "title_es": "Moumouni"
    }
  ],
  "Al-Shamal": [
    {
      "name": "Marwan Badreldin",
      "pos": "gk",
      "title": "Marwan",
      "title_es": "Marwan"
    },
    {
      "name": "Matias Nani",
      "pos": "def",
      "title": "Matias",
      "title_es": "Matias"
    },
    {
      "name": "Ali Olwan",
      "pos": "mid",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Yannick Sagbo",
      "pos": "st",
      "title": "Yannick",
      "title_es": "Yannick"
    }
  ],
  "Al-Hilal": [
    {
      "name": "Mohamed Al-Deayea",
      "pos": "gk",
      "title": "The Octopus",
      "title_es": "El Pulpo"
    },
    {
      "name": "Saleh Al-Nu'eimah",
      "pos": "def",
      "title": "Saleh",
      "title_es": "Saleh"
    },
    {
      "name": "Nawaf Al-Temyat",
      "pos": "mid",
      "title": "Nawaf",
      "title_es": "Nawaf"
    },
    {
      "name": "Sami Al-Jaber",
      "pos": "st",
      "title": "Sami",
      "title_es": "Sami"
    }
  ],
  "Al-Nassr": [
    {
      "name": "Salem Marwan",
      "pos": "gk",
      "title": "Salem",
      "title_es": "Salem"
    },
    {
      "name": "Hussein Abdulghani",
      "pos": "def",
      "title": "Hussein",
      "title_es": "Hussein"
    },
    {
      "name": "Fahd Al-Herafy",
      "pos": "mid",
      "title": "Fahd",
      "title_es": "Fahd"
    },
    {
      "name": "Majed Abdullah",
      "pos": "st",
      "title": "Pelé of the Desert",
      "title_es": "Pelé del Desierto"
    }
  ],
  "Al-Ittihad": [
    {
      "name": "Mabrouk Zaid",
      "pos": "gk",
      "title": "Mabrouk",
      "title_es": "Mabrouk"
    },
    {
      "name": "Ahmed Jamil",
      "pos": "def",
      "title": "Ahmed",
      "title_es": "Ahmed"
    },
    {
      "name": "Mohammed Noor",
      "pos": "mid",
      "title": "Noor",
      "title_es": "Noor"
    },
    {
      "name": "Hamzah Idris",
      "pos": "st",
      "title": "Hamzah",
      "title_es": "Hamzah"
    }
  ],
  "Al-Ahli": [
    {
      "name": "Yasser Al-Mosailem",
      "pos": "gk",
      "title": "Yasser",
      "title_es": "Yasser"
    },
    {
      "name": "Hussein Sulaimani",
      "pos": "def",
      "title": "Hussein",
      "title_es": "Hussein"
    },
    {
      "name": "Taisir Al-Jassim",
      "pos": "mid",
      "title": "Taisir",
      "title_es": "Taisir"
    },
    {
      "name": "Omar Al Somah",
      "pos": "st",
      "title": "Al Somah",
      "title_es": "Al Somah"
    }
  ],
  "Al-Ettifaq": [
    {
      "name": "Fayez Al-Subeaei",
      "pos": "gk",
      "title": "Fayez",
      "title_es": "Fayez"
    },
    {
      "name": "Jamaan Al-Dossari",
      "pos": "def",
      "title": "Jamaan",
      "title_es": "Jamaan"
    },
    {
      "name": "Yahya Al-Shehri",
      "pos": "mid",
      "title": "Yahya",
      "title_es": "Yahya"
    },
    {
      "name": "Saleh Bashir",
      "pos": "st",
      "title": "Saleh",
      "title_es": "Saleh"
    }
  ],
  "Al-Shabab": [
    {
      "name": "Waleed Abdullah",
      "pos": "gk",
      "title": "Waleed",
      "title_es": "Waleed"
    },
    {
      "name": "Hassan Muath",
      "pos": "def",
      "title": "Hassan",
      "title_es": "Hassan"
    },
    {
      "name": "Ahmed Otaif",
      "pos": "mid",
      "title": "Ahmed",
      "title_es": "Ahmed"
    },
    {
      "name": "Saeed Al-Owairan",
      "pos": "st",
      "title": "Maradona of the Arabs",
      "title_es": "El Maradona de los Árabes"
    }
  ],
  "Al-Taawoun": [
    {
      "name": "Cassio",
      "pos": "gk",
      "title": "Cassio",
      "title_es": "Cassio"
    },
    {
      "name": "Talal Al-Absi",
      "pos": "def",
      "title": "Talal",
      "title_es": "Talal"
    },
    {
      "name": "Sandro Manoel",
      "pos": "mid",
      "title": "Sandro",
      "title_es": "Sandro"
    },
    {
      "name": "Leandre Tawamba",
      "pos": "st",
      "title": "Leandre",
      "title_es": "Leandre"
    }
  ],
  "Al-Fateh": [
    {
      "name": "Maksym Koval",
      "pos": "gk",
      "title": "Maksym",
      "title_es": "Maksym"
    },
    {
      "name": "Ali Al-Bulaihi",
      "pos": "def",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Elton José",
      "pos": "mid",
      "title": "Elton",
      "title_es": "Elton"
    },
    {
      "name": "Doris Fuakumputu",
      "pos": "st",
      "title": "Doris",
      "title_es": "Doris"
    }
  ],
  "Al-Khaleej": [
    {
      "name": "Muslim Al-Freej",
      "pos": "gk",
      "title": "Muslim",
      "title_es": "Muslim"
    },
    {
      "name": "Pedro Rebocho",
      "pos": "def",
      "title": "Pedro",
      "title_es": "Pedro"
    },
    {
      "name": "Fábio Martins",
      "pos": "mid",
      "title": "Fábio",
      "title_es": "Fábio"
    },
    {
      "name": "Mohamed Sherif",
      "pos": "st",
      "title": "Mohamed",
      "title_es": "Mohamed"
    }
  ],
  "Al-Raed": [
    {
      "name": "Azzedine Doukha",
      "pos": "gk",
      "title": "Azzedine",
      "title_es": "Azzedine"
    },
    {
      "name": "Yahya Al-Musalem",
      "pos": "def",
      "title": "Yahya",
      "title_es": "Yahya"
    },
    {
      "name": "Sultan Al-Sawadi",
      "pos": "mid",
      "title": "Sultan",
      "title_es": "Sultan"
    },
    {
      "name": "Ismael Bangoura",
      "pos": "st",
      "title": "Ismael",
      "title_es": "Ismael"
    }
  ],
  "Al-Fayha": [
    {
      "name": "Vladimir Stojković",
      "pos": "gk",
      "title": "Vladimir",
      "title_es": "Vladimir"
    },
    {
      "name": "Sami Al-Khaibari",
      "pos": "def",
      "title": "Sami",
      "title_es": "Sami"
    },
    {
      "name": "Panagiotis Tachtsidis",
      "pos": "mid",
      "title": "Panagiotis",
      "title_es": "Panagiotis"
    },
    {
      "name": "Danilo Asprilla",
      "pos": "st",
      "title": "Danilo",
      "title_es": "Danilo"
    }
  ],
  "Damac": [
    {
      "name": "Moustapha Zeghba",
      "pos": "gk",
      "title": "Moustapha",
      "title_es": "Moustapha"
    },
    {
      "name": "Farouk Chafaï",
      "pos": "def",
      "title": "Farouk",
      "title_es": "Farouk"
    },
    {
      "name": "Domagoj Antolić",
      "pos": "mid",
      "title": "Domagoj",
      "title_es": "Domagoj"
    },
    {
      "name": "Emilio Zelaya",
      "pos": "st",
      "title": "Emilio",
      "title_es": "Emilio"
    }
  ],
  "Neom SC": [
    {
      "name": "Mustafa Zaid",
      "pos": "gk",
      "title": "Mustafa",
      "title_es": "Mustafa"
    },
    {
      "name": "Ahmed Al-Johani",
      "pos": "def",
      "title": "Ahmed",
      "title_es": "Ahmed"
    },
    {
      "name": "Salman Al-Faraj",
      "pos": "mid",
      "title": "Salman",
      "title_es": "Salman"
    },
    {
      "name": "Romarinho",
      "pos": "st",
      "title": "Romarinho",
      "title_es": "Romarinho"
    }
  ],
  "Al-Okhdood": [
    {
      "name": "Paulo Vítor",
      "pos": "gk",
      "title": "Paulo",
      "title_es": "Paulo"
    },
    {
      "name": "Solomon Kvirkvelia",
      "pos": "def",
      "title": "Solomon",
      "title_es": "Solomon"
    },
    {
      "name": "Florin Tănase",
      "pos": "mid",
      "title": "Florin",
      "title_es": "Florin"
    },
    {
      "name": "Léandre Tawamba",
      "pos": "st",
      "title": "Léandre",
      "title_es": "Léandre"
    }
  ],
  "Al-Riyadh": [
    {
      "name": "Martin Campaña",
      "pos": "gk",
      "title": "Martin",
      "title_es": "Martin"
    },
    {
      "name": "Mohammed Al-Shwirekh",
      "pos": "def",
      "title": "Mohammed",
      "title_es": "Mohammed"
    },
    {
      "name": "Knowledge Musona",
      "pos": "mid",
      "title": "Knowledge",
      "title_es": "Knowledge"
    },
    {
      "name": "Andre Gray",
      "pos": "st",
      "title": "Andre",
      "title_es": "Andre"
    }
  ],
  "Al-Najma": [
    {
      "name": "Mansour Al-Nujaimi",
      "pos": "gk",
      "title": "Mansour",
      "title_es": "Mansour"
    },
    {
      "name": "Sami Al-Khaibari",
      "pos": "def",
      "title": "Sami",
      "title_es": "Sami"
    },
    {
      "name": "Fahad Al-Bishi",
      "pos": "mid",
      "title": "Fahad",
      "title_es": "Fahad"
    },
    {
      "name": "Ousmane Barry",
      "pos": "st",
      "title": "Ousmane",
      "title_es": "Ousmane"
    }
  ],
  "Mamelodi Sundowns": [
    {
      "name": "Denis Onyango",
      "pos": "gk",
      "title": "Denis",
      "title_es": "Denis"
    },
    {
      "name": "Wayne Arendse",
      "pos": "def",
      "title": "Wayne",
      "title_es": "Wayne"
    },
    {
      "name": "Hlompho Kekana",
      "pos": "mid",
      "title": "Hlompho",
      "title_es": "Hlompho"
    },
    {
      "name": "Peter Shalulile",
      "pos": "st",
      "title": "Peter",
      "title_es": "Peter"
    }
  ],
  "Orlando Pirates": [
    {
      "name": "Senzo Meyiwa",
      "pos": "gk",
      "title": "Senzo",
      "title_es": "Senzo"
    },
    {
      "name": "Happy Jele",
      "pos": "def",
      "title": "Happy",
      "title_es": "Happy"
    },
    {
      "name": "Oupa Manyisa",
      "pos": "mid",
      "title": "Ace",
      "title_es": "Ace"
    },
    {
      "name": "Benni McCarthy",
      "pos": "st",
      "title": "Benni",
      "title_es": "Benni"
    }
  ],
  "Kaizer Chiefs": [
    {
      "name": "Itumeleng Khune",
      "pos": "gk",
      "title": "Spider-Man",
      "title_es": "Spider-Man"
    },
    {
      "name": "Tefu Mashamaite",
      "pos": "def",
      "title": "Masha",
      "title_es": "Masha"
    },
    {
      "name": "Siphiwe Tshabalala",
      "pos": "mid",
      "title": "Shabba",
      "title_es": "Shabba"
    },
    {
      "name": "Bernard Parker",
      "pos": "st",
      "title": "Hounds",
      "title_es": "Hounds"
    }
  ],
  "SuperSport United": [
    {
      "name": "Ronwen Williams",
      "pos": "gk",
      "title": "Ronwen",
      "title_es": "Ronwen"
    },
    {
      "name": "Morgan Gould",
      "pos": "def",
      "title": "Morgan",
      "title_es": "Morgan"
    },
    {
      "name": "Dean Furman",
      "pos": "mid",
      "title": "Dean",
      "title_es": "Dean"
    },
    {
      "name": "Bradley Grobler",
      "pos": "st",
      "title": "Bradley",
      "title_es": "Bradley"
    }
  ],
  "Stellenbosch": [
    {
      "name": "Sage Stephens",
      "pos": "gk",
      "title": "Sage",
      "title_es": "Sage"
    },
    {
      "name": "Robyn Johannes",
      "pos": "def",
      "title": "Robyn",
      "title_es": "Robyn"
    },
    {
      "name": "Jayden Adams",
      "pos": "mid",
      "title": "Jayden",
      "title_es": "Jayden"
    },
    {
      "name": "Iqraam Rayners",
      "pos": "st",
      "title": "Iqraam",
      "title_es": "Iqraam"
    }
  ],
  "Cape Town City": [
    {
      "name": "Peter Leeuwenburgh",
      "pos": "gk",
      "title": "Peter",
      "title_es": "Peter"
    },
    {
      "name": "Thamsanqa Mkhize",
      "pos": "def",
      "title": "Thami",
      "title_es": "Thami"
    },
    {
      "name": "Thabo Nodada",
      "pos": "mid",
      "title": "Thabo",
      "title_es": "Thabo"
    },
    {
      "name": "Lebogang Manyama",
      "pos": "st",
      "title": "Lebo",
      "title_es": "Lebo"
    }
  ],
  "AmaZulu": [
    {
      "name": "Veli Mothwa",
      "pos": "gk",
      "title": "Veli",
      "title_es": "Veli"
    },
    {
      "name": "Tapelo Xoki",
      "pos": "def",
      "title": "Tapelo",
      "title_es": "Tapelo"
    },
    {
      "name": "Makhehlene Makhaula",
      "pos": "mid",
      "title": "Makhaula",
      "title_es": "Makhaula"
    },
    {
      "name": "Bongi Ntuli",
      "pos": "st",
      "title": "Bongi",
      "title_es": "Bongi"
    }
  ],
  "Sekhukhune United": [
    {
      "name": "Ali Sangaré",
      "pos": "gk",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Daniel Cardoso",
      "pos": "def",
      "title": "Daniel",
      "title_es": "Daniel"
    },
    {
      "name": "Yusuf Maart",
      "pos": "mid",
      "title": "Yusuf",
      "title_es": "Yusuf"
    },
    {
      "name": "Chibuike Ohizu",
      "pos": "st",
      "title": "Chibuike",
      "title_es": "Chibuike"
    }
  ],
  "Golden Arrows": [
    {
      "name": "Nkosingiphile Gumede",
      "pos": "gk",
      "title": "Nkosingiphile",
      "title_es": "Nkosingiphile"
    },
    {
      "name": "Nkanyiso Mngwengwe",
      "pos": "def",
      "title": "Nkanyiso",
      "title_es": "Nkanyiso"
    },
    {
      "name": "Nduduzo Sibiya",
      "pos": "mid",
      "title": "Nduduzo",
      "title_es": "Nduduzo"
    },
    {
      "name": "Knox Mutizwa",
      "pos": "st",
      "title": "Knox",
      "title_es": "Knox"
    }
  ],
  "TS Galaxy": [
    {
      "name": "Melusi Buthelezi",
      "pos": "gk",
      "title": "Melusi",
      "title_es": "Melusi"
    },
    {
      "name": "Given Msimango",
      "pos": "def",
      "title": "Given",
      "title_es": "Given"
    },
    {
      "name": "Bathusi Aubaas",
      "pos": "mid",
      "title": "Bathusi",
      "title_es": "Bathusi"
    },
    {
      "name": "Wayde Lekay",
      "pos": "st",
      "title": "Wayde",
      "title_es": "Wayde"
    }
  ],
  "Richards Bay": [
    {
      "name": "Salim Magoola",
      "pos": "gk",
      "title": "Salim",
      "title_es": "Salim"
    },
    {
      "name": "Katlego Maphathe",
      "pos": "def",
      "title": "Katlego",
      "title_es": "Katlego"
    },
    {
      "name": "Sanele Barns",
      "pos": "mid",
      "title": "Sanele",
      "title_es": "Sanele"
    },
    {
      "name": "Somila Ntsundwana",
      "pos": "st",
      "title": "Somila",
      "title_es": "Somila"
    }
  ],
  "Chippa United": [
    {
      "name": "Daniel Akpeyi",
      "pos": "gk",
      "title": "Daniel",
      "title_es": "Daniel"
    },
    {
      "name": "James Okwuosa",
      "pos": "def",
      "title": "James",
      "title_es": "James"
    },
    {
      "name": "Andile Mbenyane",
      "pos": "mid",
      "title": "Andile",
      "title_es": "Andile"
    },
    {
      "name": "Rhulani Manzini",
      "pos": "st",
      "title": "Rhulani",
      "title_es": "Rhulani"
    }
  ],
  "Polokwane City": [
    {
      "name": "George Chigova",
      "pos": "gk",
      "title": "George",
      "title_es": "George"
    },
    {
      "name": "Thapelo Tshilo",
      "pos": "def",
      "title": "Thapelo",
      "title_es": "Thapelo"
    },
    {
      "name": "Jabulani Maluleke",
      "pos": "mid",
      "title": "Jabulani",
      "title_es": "Jabulani"
    },
    {
      "name": "Rodney Ramagalela",
      "pos": "st",
      "title": "Rodney",
      "title_es": "Rodney"
    }
  ],
  "Marumo Gallants": [
    {
      "name": "Washington Arubi",
      "pos": "gk",
      "title": "Washington",
      "title_es": "Washington"
    },
    {
      "name": "Ayanda Nkili",
      "pos": "def",
      "title": "Ayanda",
      "title_es": "Ayanda"
    },
    {
      "name": "Ndabayithethwa Ndlondlo",
      "pos": "mid",
      "title": "Ndlondlo",
      "title_es": "Ndlondlo"
    },
    {
      "name": "Ranga Chivaviro",
      "pos": "st",
      "title": "Ranga",
      "title_es": "Ranga"
    }
  ],
  "Saprissa": [
    {
      "name": "Erick Lonnis",
      "pos": "gk",
      "title": "Erick",
      "title_es": "Erick"
    },
    {
      "name": "Jervis Drummond",
      "pos": "def",
      "title": "Jervis",
      "title_es": "Jervis"
    },
    {
      "name": "Walter Centeno",
      "pos": "mid",
      "title": "Paté",
      "title_es": "Paté"
    },
    {
      "name": "Rolando Fonseca",
      "pos": "st",
      "title": "El Principito",
      "title_es": "El Principito"
    }
  ],
  "Alajuelense": [
    {
      "name": "Álvaro Mesén",
      "pos": "gk",
      "title": "Álvaro",
      "title_es": "Álvaro"
    },
    {
      "name": "Luis Marín",
      "pos": "def",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Wilmer López",
      "pos": "mid",
      "title": "Pato",
      "title_es": "Pato"
    },
    {
      "name": "Bryan Ruiz",
      "pos": "st",
      "title": "Comadreja",
      "title_es": "Comadreja"
    }
  ],
  "Herediano": [
    {
      "name": "Leonel Moreira",
      "pos": "gk",
      "title": "Oso",
      "title_es": "Oso"
    },
    {
      "name": "Mauricio Wright",
      "pos": "def",
      "title": "Mauricio",
      "title_es": "Mauricio"
    },
    {
      "name": "Elías Aguilar",
      "pos": "mid",
      "title": "Profeta",
      "title_es": "Profeta"
    },
    {
      "name": "Yendrick Ruiz",
      "pos": "st",
      "title": "Yendrick",
      "title_es": "Yendrick"
    }
  ],
  "Cartaginés": [
    {
      "name": "Kevin Briceño",
      "pos": "gk",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "José Villalobos",
      "pos": "def",
      "title": "Chan",
      "title_es": "Chan"
    },
    {
      "name": "Danny Fonseca",
      "pos": "mid",
      "title": "Danny",
      "title_es": "Danny"
    },
    {
      "name": "Marcel Hernández",
      "pos": "st",
      "title": "Marcel",
      "title_es": "Marcel"
    }
  ],
  "San Carlos": [
    {
      "name": "Román Arrieta",
      "pos": "gk",
      "title": "Román",
      "title_es": "Román"
    },
    {
      "name": "Carlos Acosta",
      "pos": "def",
      "title": "Carlos",
      "title_es": "Carlos"
    },
    {
      "name": "Álvaro Sánchez",
      "pos": "mid",
      "title": "Álvaro",
      "title_es": "Álvaro"
    },
    {
      "name": "Álvaro Saborío",
      "pos": "st",
      "title": "Sabo",
      "title_es": "Sabo"
    }
  ],
  "Puntarenas": [
    {
      "name": "Kevin Ruiz",
      "pos": "gk",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "Roberto Wong",
      "pos": "def",
      "title": "Roberto",
      "title_es": "Roberto"
    },
    {
      "name": "Kevin Sancho",
      "pos": "mid",
      "title": "Kevin",
      "title_es": "Kevin"
    },
    {
      "name": "Daniel Quirós",
      "pos": "st",
      "title": "Daniel",
      "title_es": "Daniel"
    }
  ],
  "Sporting San José": [
    {
      "name": "Adonis Pineda",
      "pos": "gk",
      "title": "Adonis",
      "title_es": "Adonis"
    },
    {
      "name": "Dennis Castillo",
      "pos": "def",
      "title": "Dennis",
      "title_es": "Dennis"
    },
    {
      "name": "Luis Flores",
      "pos": "mid",
      "title": "Luis",
      "title_es": "Luis"
    },
    {
      "name": "Harry Rojas",
      "pos": "st",
      "title": "Harry",
      "title_es": "Harry"
    }
  ],
  "Pérez Zeledón": [
    {
      "name": "Dexter Lewis",
      "pos": "gk",
      "title": "Dexter",
      "title_es": "Dexter"
    },
    {
      "name": "Keilor Soto",
      "pos": "def",
      "title": "Keilor",
      "title_es": "Keilor"
    },
    {
      "name": "Luis Stwart Pérez",
      "pos": "mid",
      "title": "Luis Stwart",
      "title_es": "Luis Stwart"
    },
    {
      "name": "Lauro Cazal",
      "pos": "st",
      "title": "Lauro",
      "title_es": "Lauro"
    }
  ],
  "Santos de Guápiles": [
    {
      "name": "Douglas Forvis",
      "pos": "gk",
      "title": "Douglas",
      "title_es": "Douglas"
    },
    {
      "name": "Juan Diego Madrigal",
      "pos": "def",
      "title": "Juan Diego",
      "title_es": "Juan Diego"
    },
    {
      "name": "Osvaldo Rodríguez",
      "pos": "mid",
      "title": "Pato",
      "title_es": "Pato"
    },
    {
      "name": "Javon East",
      "pos": "st",
      "title": "Javon",
      "title_es": "Javon"
    }
  ],
  "Guanacasteca": [
    {
      "name": "Antonio Torres",
      "pos": "gk",
      "title": "Antonio",
      "title_es": "Antonio"
    },
    {
      "name": "Yeison Molina",
      "pos": "def",
      "title": "Yeison",
      "title_es": "Yeison"
    },
    {
      "name": "Josimar Olivero",
      "pos": "mid",
      "title": "Josimar",
      "title_es": "Josimar"
    },
    {
      "name": "Johan Condega",
      "pos": "st",
      "title": "Johan",
      "title_es": "Johan"
    }
  ],
  "Coton Sport": [
    {
      "name": "Daouda Kassaly",
      "pos": "gk",
      "title": "Daouda",
      "title_es": "Daouda"
    },
    {
      "name": "Bouba Aminou",
      "pos": "def",
      "title": "Bouba",
      "title_es": "Bouba"
    },
    {
      "name": "Kingue Mpondo",
      "pos": "mid",
      "title": "Kingue",
      "title_es": "Kingue"
    },
    {
      "name": "Kamilou Daouda",
      "pos": "st",
      "title": "Kamilou",
      "title_es": "Kamilou"
    }
  ],
  "Canon Yaoundé": [
    {
      "name": "Thomas N'Kono",
      "pos": "gk",
      "title": "Tommy",
      "title_es": "Tommy"
    },
    {
      "name": "Emmanuel Kundé",
      "pos": "def",
      "title": "Emmanuel",
      "title_es": "Emmanuel"
    },
    {
      "name": "Théophile Abega",
      "pos": "mid",
      "title": "Doctor",
      "title_es": "Doctor"
    },
    {
      "name": "Jean-Paul Akono",
      "pos": "st",
      "title": "Jean-Paul",
      "title_es": "Jean-Paul"
    }
  ],
  "Union Douala": [
    {
      "name": "Joseph-Antoine Bell",
      "pos": "gk",
      "title": "JoJo",
      "title_es": "JoJo"
    },
    {
      "name": "René N'Djeya",
      "pos": "def",
      "title": "René",
      "title_es": "René"
    },
    {
      "name": "Isaac Bassoua",
      "pos": "mid",
      "title": "Isaac",
      "title_es": "Isaac"
    },
    {
      "name": "Roger Milla",
      "pos": "st",
      "title": "Vieux Lion",
      "title_es": "Vieux Lion"
    }
  ],
  "Fovu Club": [
    {
      "name": "Alladoum Kolimba",
      "pos": "gk",
      "title": "Alladoum",
      "title_es": "Alladoum"
    },
    {
      "name": "Serge Branco",
      "pos": "def",
      "title": "Serge",
      "title_es": "Serge"
    },
    {
      "name": "Alain Roland N'Dongo",
      "pos": "mid",
      "title": "Alain",
      "title_es": "Alain"
    },
    {
      "name": "Kologni",
      "pos": "st",
      "title": "Kologni",
      "title_es": "Kologni"
    }
  ],
  "APEJES": [
    {
      "name": "Janvier Mbarga",
      "pos": "gk",
      "title": "Janvier",
      "title_es": "Janvier"
    },
    {
      "name": "Samuel Kotto",
      "pos": "def",
      "title": "Samuel",
      "title_es": "Samuel"
    },
    {
      "name": "Franck Boya",
      "pos": "mid",
      "title": "Franck",
      "title_es": "Franck"
    },
    {
      "name": "Frank Bagnack",
      "pos": "st",
      "title": "Frank",
      "title_es": "Frank"
    }
  ],
  "Astres Douala": [
    {
      "name": "Hugo Nyame",
      "pos": "gk",
      "title": "Hugo",
      "title_es": "Hugo"
    },
    {
      "name": "Ngwen",
      "pos": "def",
      "title": "Ngwen",
      "title_es": "Ngwen"
    },
    {
      "name": "Ebah",
      "pos": "mid",
      "title": "Ebah",
      "title_es": "Ebah"
    },
    {
      "name": "Rostand Kako",
      "pos": "st",
      "title": "Rostand",
      "title_es": "Rostand"
    }
  ],
  "Colombe": [
    {
      "name": "Idrissou",
      "pos": "gk",
      "title": "Idrissou",
      "title_es": "Idrissou"
    },
    {
      "name": "Mfegue",
      "pos": "def",
      "title": "Mfegue",
      "title_es": "Mfegue"
    },
    {
      "name": "Oumarou",
      "pos": "mid",
      "title": "Oumarou",
      "title_es": "Oumarou"
    },
    {
      "name": "Essono",
      "pos": "st",
      "title": "Essono",
      "title_es": "Essono"
    }
  ],
  "PWD Bamenda": [
    {
      "name": "Haschou Kerrido",
      "pos": "gk",
      "title": "Haschou",
      "title_es": "Haschou"
    },
    {
      "name": "Burinyuy",
      "pos": "def",
      "title": "Burinyuy",
      "title_es": "Burinyuy"
    },
    {
      "name": "Tchaoua",
      "pos": "mid",
      "title": "Tchaoua",
      "title_es": "Tchaoua"
    },
    {
      "name": "Leonel Ateba",
      "pos": "st",
      "title": "Leonel",
      "title_es": "Leonel"
    }
  ],
  "Stade Renard": [
    {
      "name": "Ndjomo",
      "pos": "gk",
      "title": "Ndjomo",
      "title_es": "Ndjomo"
    },
    {
      "name": "Tientcheu",
      "pos": "def",
      "title": "Tientcheu",
      "title_es": "Tientcheu"
    },
    {
      "name": "Kofana",
      "pos": "mid",
      "title": "Kofana",
      "title_es": "Kofana"
    },
    {
      "name": "Nchindo",
      "pos": "st",
      "title": "Nchindo",
      "title_es": "Nchindo"
    }
  ],
  "Young Sport Academy": [
    {
      "name": "Niba",
      "pos": "gk",
      "title": "Niba",
      "title_es": "Niba"
    },
    {
      "name": "Ndi",
      "pos": "def",
      "title": "Ndi",
      "title_es": "Ndi"
    },
    {
      "name": "Ngong",
      "pos": "mid",
      "title": "Ngong",
      "title_es": "Ngong"
    },
    {
      "name": "Awono",
      "pos": "st",
      "title": "Awono",
      "title_es": "Awono"
    }
  ],
  "Stade Malien": [
    {
      "name": "Soumbeïla Diakité",
      "pos": "gk",
      "title": "Soumbeïla",
      "title_es": "Soumbeïla"
    },
    {
      "name": "Abdoulaye Maïga",
      "pos": "def",
      "title": "Abdoulaye",
      "title_es": "Abdoulaye"
    },
    {
      "name": "Mamadou Diallo",
      "pos": "mid",
      "title": "Mamadou",
      "title_es": "Mamadou"
    },
    {
      "name": "Modibo Maïga",
      "pos": "st",
      "title": "Modibo",
      "title_es": "Modibo"
    }
  ],
  "Djoliba": [
    {
      "name": "Ali Yirango",
      "pos": "gk",
      "title": "Ali",
      "title_es": "Ali"
    },
    {
      "name": "Adama Tamboura",
      "pos": "def",
      "title": "Adama",
      "title_es": "Adama"
    },
    {
      "name": "Amadou Haidara",
      "pos": "mid",
      "title": "Amadou",
      "title_es": "Amadou"
    },
    {
      "name": "Cheick Fantamady Diarra",
      "pos": "st",
      "title": "Cheick",
      "title_es": "Cheick"
    }
  ],
  "Real Bamako": [
    {
      "name": "Almamy Sogoba",
      "pos": "gk",
      "title": "Almamy",
      "title_es": "Almamy"
    },
    {
      "name": "Mohamed Camara",
      "pos": "def",
      "title": "Mohamed",
      "title_es": "Mohamed"
    },
    {
      "name": "Yves Bissouma",
      "pos": "mid",
      "title": "Yves",
      "title_es": "Yves"
    },
    {
      "name": "Moussa Doumbia",
      "pos": "st",
      "title": "Moussa",
      "title_es": "Moussa"
    }
  ],
  "US Bougouba": [
    {
      "name": "Sylla",
      "pos": "gk",
      "title": "Sylla",
      "title_es": "Sylla"
    },
    {
      "name": "Coulibaly",
      "pos": "def",
      "title": "Coulibaly",
      "title_es": "Coulibaly"
    },
    {
      "name": "Traoré",
      "pos": "mid",
      "title": "Traoré",
      "title_es": "Traoré"
    },
    {
      "name": "Diarra",
      "pos": "st",
      "title": "Diarra",
      "title_es": "Diarra"
    }
  ],
  "AS Police": [
    {
      "name": "Keita",
      "pos": "gk",
      "title": "Keita",
      "title_es": "Keita"
    },
    {
      "name": "Sangaré",
      "pos": "def",
      "title": "Sangaré",
      "title_es": "Sangaré"
    },
    {
      "name": "Kanté",
      "pos": "mid",
      "title": "Kanté",
      "title_es": "Kanté"
    },
    {
      "name": "Sissoko",
      "pos": "st",
      "title": "Sissoko",
      "title_es": "Sissoko"
    }
  ],
  "Onze Créateurs": [
    {
      "name": "Germain Berthé",
      "pos": "gk",
      "title": "Germain",
      "title_es": "Germain"
    },
    {
      "name": "Marius Hamed Assoko",
      "pos": "def",
      "title": "Marius",
      "title_es": "Marius"
    },
    {
      "name": "Lamine Diawara",
      "pos": "mid",
      "title": "Lamine",
      "title_es": "Lamine"
    },
    {
      "name": "Hamidou Sinayoko",
      "pos": "st",
      "title": "Hamidou",
      "title_es": "Hamidou"
    }
  ],
  "Afrique Football Élite": [
    {
      "name": "Fofana",
      "pos": "gk",
      "title": "Fofana",
      "title_es": "Fofana"
    },
    {
      "name": "Kone",
      "pos": "def",
      "title": "Kone",
      "title_es": "Kone"
    },
    {
      "name": "Dembélé",
      "pos": "mid",
      "title": "Dembélé",
      "title_es": "Dembélé"
    },
    {
      "name": "Toure",
      "pos": "st",
      "title": "Toure",
      "title_es": "Toure"
    }
  ],
  "USC Kita": [
    {
      "name": "Cissé",
      "pos": "gk",
      "title": "Cissé",
      "title_es": "Cissé"
    },
    {
      "name": "Diallo",
      "pos": "def",
      "title": "Diallo",
      "title_es": "Diallo"
    },
    {
      "name": "Sacko",
      "pos": "mid",
      "title": "Sacko",
      "title_es": "Sacko"
    },
    {
      "name": "Samaké",
      "pos": "st",
      "title": "Samaké",
      "title_es": "Samaké"
    }
  ]
};

  const NAT_LEGENDS = {
    "AR": [
        {
            "name": "Franco Armani",
            "pos": "gk",
            "title": "The Wall of River",
            "title_es": "El Muro de River"
        },
        {
            "name": "Javier Zanetti",
            "pos": "def",
            "title": "The Tractor",
            "title_es": "El Tractor"
        },
        {
            "name": "Juan Román Riquelme",
            "pos": "mid",
            "title": "The Last Number Ten",
            "title_es": "El Último Diez"
        },
        {
            "name": "Lionel Messi",
            "pos": "st",
            "title": "The Flea",
            "title_es": "La Pulga"
        }
    ],
    "FR": [
        {
            "name": "Fabien Barthez",
            "pos": "gk",
            "title": "The Divine Bald",
            "title_es": "Le Divine Chauve"
        },
        {
            "name": "Lilian Thuram",
            "pos": "def",
            "title": "The Rock",
            "title_es": "La Roca"
        },
        {
            "name": "Zinedine Zidane",
            "pos": "mid",
            "title": "Zizou",
            "title_es": "Zizou"
        },
        {
            "name": "Thierry Henry",
            "pos": "st",
            "title": "Titi",
            "title_es": "Titi"
        }
    ],
    "ES": [
        {
            "name": "Iker Casillas",
            "pos": "gk",
            "title": "Saint Iker",
            "title_es": "San Iker"
        },
        {
            "name": "Sergio Ramos",
            "pos": "def",
            "title": "The 93rd Minute Captain",
            "title_es": "El Capitán del 93'"
        },
        {
            "name": "Andrés Iniesta",
            "pos": "mid",
            "title": "Don Andrés",
            "title_es": "Don Andrés"
        },
        {
            "name": "David Villa",
            "pos": "st",
            "title": "El Guaje",
            "title_es": "El Guaje"
        }
    ],
    "EN": [
        {
            "name": "David Seaman",
            "pos": "gk",
            "title": "Safe Hands",
            "title_es": "Manos Seguras"
        },
        {
            "name": "Rio Ferdinand",
            "pos": "def",
            "title": "The Rolls-Royce Defender",
            "title_es": "El Defensor Elegante"
        },
        {
            "name": "Steven Gerrard",
            "pos": "mid",
            "title": "Captain Fantastic",
            "title_es": "Capitán Fantástico"
        },
        {
            "name": "Wayne Rooney",
            "pos": "st",
            "title": "Wazza",
            "title_es": "Wazza"
        }
    ],
    "BR": [
        {
            "name": "Marcos",
            "pos": "gk",
            "title": "Saint Marcos",
            "title_es": "São Marcos"
        },
        {
            "name": "Cafu",
            "pos": "def",
            "title": "Captain of the Fifth Star",
            "title_es": "O Capitão do Penta"
        },
        {
            "name": "Ronaldinho",
            "pos": "mid",
            "title": "The Wizard",
            "title_es": "O Bruxo"
        },
        {
            "name": "Ronaldo Nazário",
            "pos": "st",
            "title": "The Phenomenon",
            "title_es": "O Fenômeno"
        }
    ],
    "PT": [
        {
            "name": "Vítor Baía",
            "pos": "gk",
            "title": "The Wall of Dragão",
            "title_es": "O Muro de Dragão"
        },
        {
            "name": "Pepe",
            "pos": "def",
            "title": "The Sheriff",
            "title_es": "O Xerife"
        },
        {
            "name": "Luís Figo",
            "pos": "mid",
            "title": "The Genius of Alvalade",
            "title_es": "O Genio de Alvalade"
        },
        {
            "name": "Cristiano Ronaldo",
            "pos": "st",
            "title": "CR7",
            "title_es": "CR7"
        }
    ],
    "NL": [
        {
            "name": "Edwin van der Sar",
            "pos": "gk",
            "title": "The Flying Dutchman",
            "title_es": "El Holandés Volador"
        },
        {
            "name": "Jaap Stam",
            "pos": "def",
            "title": "The Dutch Rock",
            "title_es": "La Roca Holandesa"
        },
        {
            "name": "Ruud Gullit",
            "pos": "mid",
            "title": "The Black Tulip",
            "title_es": "El Tulipán Negro"
        },
        {
            "name": "Marco van Basten",
            "pos": "st",
            "title": "The Swan of Utrecht",
            "title_es": "El Cisne de Utrecht"
        }
    ],
    "BE": [
        {
            "name": "Thibaut Courtois",
            "pos": "gk",
            "title": "The Belgian Wall",
            "title_es": "El Muro Belga"
        },
        {
            "name": "Vincent Kompany",
            "pos": "def",
            "title": "Captain Kompany",
            "title_es": "Capitán Kompany"
        },
        {
            "name": "Kevin De Bruyne",
            "pos": "mid",
            "title": "KDB",
            "title_es": "KDB"
        },
        {
            "name": "Romelu Lukaku",
            "pos": "st",
            "title": "Big Rom",
            "title_es": "Big Rom"
        }
    ],
    "IT": [
        {
            "name": "Gianluigi Buffon",
            "pos": "gk",
            "title": "Gigi",
            "title_es": "Gigi"
        },
        {
            "name": "Paolo Maldini",
            "pos": "def",
            "title": "The Captain",
            "title_es": "Il Capitano"
        },
        {
            "name": "Andrea Pirlo",
            "pos": "mid",
            "title": "The Maestro",
            "title_es": "Il Maestro"
        },
        {
            "name": "Alessandro Del Piero",
            "pos": "st",
            "title": "Pinturicchio",
            "title_es": "Pinturicchio"
        }
    ],
    "DE": [
        {
            "name": "Manuel Neuer",
            "pos": "gk",
            "title": "The Sweeper Keeper",
            "title_es": "El Portero Líbero"
        },
        {
            "name": "Philipp Lahm",
            "pos": "def",
            "title": "The Magic Dwarf",
            "title_es": "El Enano Mágico"
        },
        {
            "name": "Bastian Schweinsteiger",
            "pos": "mid",
            "title": "The Football God",
            "title_es": "Der Fußballgott"
        },
        {
            "name": "Thomas Müller",
            "pos": "st",
            "title": "The Space Interpreter",
            "title_es": "Der Raumdeuter"
        }
    ],
    "HR": [
        {
            "name": "Danijel Subašić",
            "pos": "gk",
            "title": "The World Cup Hero",
            "title_es": "El Héroe Mundialista"
        },
        {
            "name": "Vedran Ćorluka",
            "pos": "def",
            "title": "The Rock of Zagreb",
            "title_es": "La Roca de Zagreb"
        },
        {
            "name": "Luka Modrić",
            "pos": "mid",
            "title": "The Croatian Maestro",
            "title_es": "El Maestro Croata"
        },
        {
            "name": "Mario Mandžukić",
            "pos": "st",
            "title": "Super Mario",
            "title_es": "Súper Mario"
        }
    ],
    "MA": [
        {
            "name": "Yassine Bounou",
            "pos": "gk",
            "title": "Bono",
            "title_es": "Bono"
        },
        {
            "name": "Mehdi Benatia",
            "pos": "def",
            "title": "Captain of the Lions",
            "title_es": "El Capitán de los Leones"
        },
        {
            "name": "Hakim Ziyech",
            "pos": "mid",
            "title": "The Wizard",
            "title_es": "El Mago"
        },
        {
            "name": "Youssef En-Nesyri",
            "pos": "st",
            "title": "The Air Striker",
            "title_es": "El Delantero Volador"
        }
    ],
    "UY": [
        {
            "name": "Fernando Muslera",
            "pos": "gk",
            "title": "El Nene",
            "title_es": "El Nene"
        },
        {
            "name": "Diego Godín",
            "pos": "def",
            "title": "The Pharaoh",
            "title_es": "El Faraón"
        },
        {
            "name": "Enzo Francescoli",
            "pos": "mid",
            "title": "The Prince",
            "title_es": "El Príncipe"
        },
        {
            "name": "Luis Suárez",
            "pos": "st",
            "title": "The Gunman",
            "title_es": "El Pistolero"
        }
    ],
    "CO": [
        {
            "name": "René Higuita",
            "pos": "gk",
            "title": "El Loco",
            "title_es": "El Loco"
        },
        {
            "name": "Iván Córdoba",
            "pos": "def",
            "title": "The Wall",
            "title_es": "El Muralla"
        },
        {
            "name": "Carlos Valderrama",
            "pos": "mid",
            "title": "El Pibe",
            "title_es": "El Pibe"
        },
        {
            "name": "Radamel Falcao",
            "pos": "st",
            "title": "The Tiger",
            "title_es": "El Tigre"
        }
    ],
    "MX": [
        {
            "name": "Jorge Campos",
            "pos": "gk",
            "title": "The Immortal",
            "title_es": "El Inmortal"
        },
        {
            "name": "Rafael Márquez",
            "pos": "def",
            "title": "The Kaiser of Michoacán",
            "title_es": "El Káiser de Michoacán"
        },
        {
            "name": "Cuauhtémoc Blanco",
            "pos": "mid",
            "title": "El Cuau",
            "title_es": "El Cuau"
        },
        {
            "name": "Hugo Sánchez",
            "pos": "st",
            "title": "Pentapichi",
            "title_es": "Pentapichi"
        }
    ],
    "US": [
        {
            "name": "Tim Howard",
            "pos": "gk",
            "title": "The Secretary of Defense",
            "title_es": "El Secretario de Defensa"
        },
        {
            "name": "Carlos Bocanegra",
            "pos": "def",
            "title": "Captain America",
            "title_es": "Capitán América"
        },
        {
            "name": "Clint Dempsey",
            "pos": "mid",
            "title": "Deuce",
            "title_es": "Deuce"
        },
        {
            "name": "Landon Donovan",
            "pos": "st",
            "title": "Captain Landon",
            "title_es": "Capitán Landon"
        }
    ],
    "CH": [
        {
            "name": "Yann Sommer",
            "pos": "gk",
            "title": "The Swiss Stopper",
            "title_es": "El Guardián Suizo"
        },
        {
            "name": "Stephan Lichtsteiner",
            "pos": "def",
            "title": "Forrest Gump",
            "title_es": "Forrest Gump"
        },
        {
            "name": "Xherdan Shaqiri",
            "pos": "mid",
            "title": "The Alpine Messi",
            "title_es": "El Messi Alpino"
        },
        {
            "name": "Alexander Frei",
            "pos": "st",
            "title": "Top Scorer",
            "title_es": "Máximo Goleador"
        }
    ],
    "JP": [
        {
            "name": "Eiji Kawashima",
            "pos": "gk",
            "title": "The Blue Samurai Wall",
            "title_es": "El Muro Samurái"
        },
        {
            "name": "Yuto Nagatomo",
            "pos": "def",
            "title": "The Samurai Engine",
            "title_es": "El Motor Samurái"
        },
        {
            "name": "Hidetoshi Nakata",
            "pos": "mid",
            "title": "The Pioneer",
            "title_es": "El Pionero"
        },
        {
            "name": "Keisuke Honda",
            "pos": "st",
            "title": "The Emperor",
            "title_es": "El Emperador"
        }
    ],
    "SN": [
        {
            "name": "Édouard Mendy",
            "pos": "gk",
            "title": "The Champions League Winner",
            "title_es": "El Campeón de la Champions"
        },
        {
            "name": "Kalidou Koulibaly",
            "pos": "def",
            "title": "The Rock of Dakar",
            "title_es": "La Roca de Dakar"
        },
        {
            "name": "Idrissa Gueye",
            "pos": "mid",
            "title": "The Engine",
            "title_es": "El Motor"
        },
        {
            "name": "Sadio Mané",
            "pos": "st",
            "title": "The Lion of Teranga",
            "title_es": "El León de Teranga"
        }
    ],
    "DK": [
        {
            "name": "Kasper Schmeichel",
            "pos": "gk",
            "title": "The Miracle Keeper",
            "title_es": "El Portero Milagroso"
        },
        {
            "name": "Daniel Agger",
            "pos": "def",
            "title": "The Dagger",
            "title_es": "La Daga"
        },
        {
            "name": "Christian Eriksen",
            "pos": "mid",
            "title": "The Magician",
            "title_es": "El Mago"
        },
        {
            "name": "Jon Dahl Tomasson",
            "pos": "st",
            "title": "The Hunter",
            "title_es": "El Cazador"
        }
    ],
    "AT": [
        {
            "name": "Michael Consel",
            "pos": "gk",
            "title": "The Panther",
            "title_es": "El Pantera"
        },
        {
            "name": "David Alaba",
            "pos": "def",
            "title": "The Boss",
            "title_es": "El Jefe"
        },
        {
            "name": "Andreas Herzog",
            "pos": "mid",
            "title": "Andy",
            "title_es": "Andy"
        },
        {
            "name": "Toni Polster",
            "pos": "st",
            "title": "Toni Double",
            "title_es": "Toni Doppelpack"
        }
    ],
    "UA": [
        {
            "name": "Andriy Pyatov",
            "pos": "gk",
            "title": "The Ukrainian Wall",
            "title_es": "El Muro Ucraniano"
        },
        {
            "name": "Olexandr Zinchenko",
            "pos": "def",
            "title": "The Versatile Wall",
            "title_es": "El Lateral Polivalente"
        },
        {
            "name": "Ruslan Malinovskyi",
            "pos": "mid",
            "title": "The Cannon",
            "title_es": "El Cañón"
        },
        {
            "name": "Andriy Shevchenko",
            "pos": "st",
            "title": "The Ukrainian Express",
            "title_es": "El Expreso Ucraniano"
        }
    ],
    "KR": [
        {
            "name": "Lee Woon-jae",
            "pos": "gk",
            "title": "The 2002 Hero",
            "title_es": "El Héroe de 2002"
        },
        {
            "name": "Hong Myung-bo",
            "pos": "def",
            "title": "The Eternal Captain",
            "title_es": "El Capitán Eterno"
        },
        {
            "name": "Park Ji-sung",
            "pos": "mid",
            "title": "Three-Lungs Park",
            "title_es": "Park Tres Pulmones"
        },
        {
            "name": "Son Heung-min",
            "pos": "st",
            "title": "Sonny",
            "title_es": "Sonny"
        }
    ],
    "EC": [
        {
            "name": "Alexander Domínguez",
            "pos": "gk",
            "title": "Dida",
            "title_es": "Dida"
        },
        {
            "name": "Iván Hurtado",
            "pos": "def",
            "title": "El Bam Bam",
            "title_es": "El Bam Bam"
        },
        {
            "name": "Antonio Valencia",
            "pos": "mid",
            "title": "The Amazonian Train",
            "title_es": "El Tren Amazónico"
        },
        {
            "name": "Enner Valencia",
            "pos": "st",
            "title": "Superman",
            "title_es": "Superman"
        }
    ],
    "AU": [
        {
            "name": "Mark Schwarzer",
            "pos": "gk",
            "title": "The Aussie Giant",
            "title_es": "El Gigante Australiano"
        },
        {
            "name": "Lucas Neill",
            "pos": "def",
            "title": "Captain Lucas",
            "title_es": "Capitán Lucas"
        },
        {
            "name": "Tim Cahill",
            "pos": "mid",
            "title": "Corner Flag King",
            "title_es": "El Rey del Banderín"
        },
        {
            "name": "Mark Viduka",
            "pos": "st",
            "title": "V-Dux",
            "title_es": "V-Dux"
        }
    ],
    "TR": [
        {
            "name": "Rüştü Reçber",
            "pos": "gk",
            "title": "The War-Paint Keeper",
            "title_es": "El Portero Bélico"
        },
        {
            "name": "Alpay Özalan",
            "pos": "def",
            "title": "The Rock of Istanbul",
            "title_es": "La Roca de Estambul"
        },
        {
            "name": "Arda Turan",
            "pos": "mid",
            "title": "The Turkish Wizard",
            "title_es": "El Mago Turco"
        },
        {
            "name": "Burak Yılmaz",
            "pos": "st",
            "title": "Kral",
            "title_es": "Kral"
        }
    ],
    "SE": [
        {
            "name": "Andreas Isaksson",
            "pos": "gk",
            "title": "The Swedish Wall",
            "title_es": "El Muro Sueco"
        },
        {
            "name": "Olof Mellberg",
            "pos": "def",
            "title": "The Viking Beard",
            "title_es": "La Barba Vikinga"
        },
        {
            "name": "Freddie Ljungberg",
            "pos": "mid",
            "title": "The Red-Haired Wizard",
            "title_es": "El Mago Pelirrojo"
        },
        {
            "name": "Zlatan Ibrahimović",
            "pos": "st",
            "title": "King Zlatan",
            "title_es": "Rey Zlatan"
        }
    ],
    "WA": [
        {
            "name": "Wayne Hennessey",
            "pos": "gk",
            "title": "100-Cap Wall",
            "title_es": "El Muro Centenario"
        },
        {
            "name": "Ashley Williams",
            "pos": "def",
            "title": "Captain Ash",
            "title_es": "Capitán Ash"
        },
        {
            "name": "Aaron Ramsey",
            "pos": "mid",
            "title": "Rambo",
            "title_es": "Rambo"
        },
        {
            "name": "Gareth Bale",
            "pos": "st",
            "title": "The Dragon of Cardiff",
            "title_es": "El Dragón de Cardiff"
        }
    ],
    "PL": [
        {
            "name": "Jerzy Dudek",
            "pos": "gk",
            "title": "The Istanbul Hero",
            "title_es": "El Héroe de Estambul"
        },
        {
            "name": "Kamil Glik",
            "pos": "def",
            "title": "The Polish Rock",
            "title_es": "La Roca Polaca"
        },
        {
            "name": "Jakub Błaszczykowski",
            "pos": "mid",
            "title": "Kuba",
            "title_es": "Kuba"
        },
        {
            "name": "Robert Lewandowski",
            "pos": "st",
            "title": "Lewy",
            "title_es": "Lewy"
        }
    ],
    "RS": [
        {
            "name": "Marko Dmitrović",
            "pos": "gk",
            "title": "The Serbian Keeper",
            "title_es": "El Guardián Serbio"
        },
        {
            "name": "Branislav Ivanović",
            "pos": "def",
            "title": "Bane",
            "title_es": "Bane"
        },
        {
            "name": "Dejan Stanković",
            "pos": "mid",
            "title": "Deki",
            "title_es": "Deki"
        },
        {
            "name": "Aleksandar Mitrović",
            "pos": "st",
            "title": "Mitro",
            "title_es": "Mitro"
        }
    ],
    "NO": [
        {
            "name": "Rune Jarstein",
            "pos": "gk",
            "title": "The Viking Wall",
            "title_es": "El Muro Vikingo"
        },
        {
            "name": "Henning Berg",
            "pos": "def",
            "title": "The Premier League Champion",
            "title_es": "El Campeón de la Premier"
        },
        {
            "name": "Martin Ødegaard",
            "pos": "mid",
            "title": "The Norwegian Maestro",
            "title_es": "El Maestro Noruego"
        },
        {
            "name": "Erling Haaland",
            "pos": "st",
            "title": "The Robot",
            "title_es": "El Robot"
        }
    ],
    "EG": [
        {
            "name": "Essam El-Hadary",
            "pos": "gk",
            "title": "The High Dam",
            "title_es": "La Gran Presa"
        },
        {
            "name": "Wael Gomaa",
            "pos": "def",
            "title": "The Rock of Africa",
            "title_es": "La Roca de África"
        },
        {
            "name": "Mohamed Aboutrika",
            "pos": "mid",
            "title": "The Smiling Magician",
            "title_es": "El Mago Sonriente"
        },
        {
            "name": "Mohamed Salah",
            "pos": "st",
            "title": "The Pharaoh",
            "title_es": "El Faraón"
        }
    ],
    "DZ": [
        {
            "name": "Rais M'Bolhi",
            "pos": "gk",
            "title": "The World Cup Wall",
            "title_es": "El Muro Mundialista"
        },
        {
            "name": "Madjid Bougherra",
            "pos": "def",
            "title": "The Magic Fennec",
            "title_es": "El Zorro Mágico"
        },
        {
            "name": "Riyad Mahrez",
            "pos": "mid",
            "title": "The Fennec Wizard",
            "title_es": "El Mago Argelino"
        },
        {
            "name": "Islam Slimani",
            "pos": "st",
            "title": "The Super Fennec",
            "title_es": "El Súper Argelino"
        }
    ],
    "IR": [
        {
            "name": "Alireza Beiranvand",
            "pos": "gk",
            "title": "The Penalty King",
            "title_es": "El Rey de los Penaltis"
        },
        {
            "name": "Jalal Hosseini",
            "pos": "def",
            "title": "The Rock of Tehran",
            "title_es": "La Roca de Teherán"
        },
        {
            "name": "Javad Nekounam",
            "pos": "mid",
            "title": "Captain Nekounam",
            "title_es": "Capitán Nekounam"
        },
        {
            "name": "Mehdi Taremi",
            "pos": "st",
            "title": "The Persian Striker",
            "title_es": "El Delantero Persa"
        }
    ],
    "NG": [
        {
            "name": "Vincent Enyeama",
            "pos": "gk",
            "title": "The Cat of Calabar",
            "title_es": "El Gato de Calabar"
        },
        {
            "name": "Joseph Yobo",
            "pos": "def",
            "title": "Captain Yobo",
            "title_es": "Capitán Yobo"
        },
        {
            "name": "Jay-Jay Okocha",
            "pos": "mid",
            "title": "So Good They Named Him Twice",
            "title_es": "El Mago de las Gambetas"
        },
        {
            "name": "Nwankwo Kanu",
            "pos": "st",
            "title": "King Kanu",
            "title_es": "Rey Kanu"
        }
    ],
    "CI": [
        {
            "name": "Boubacar Barry",
            "pos": "gk",
            "title": "Copa",
            "title_es": "Copa"
        },
        {
            "name": "Kolo Touré",
            "pos": "def",
            "title": "King Kolo",
            "title_es": "Rey Kolo"
        },
        {
            "name": "Yaya Touré",
            "pos": "mid",
            "title": "The Machine",
            "title_es": "La Máquina"
        },
        {
            "name": "Didier Drogba",
            "pos": "st",
            "title": "King Didier",
            "title_es": "Rey Didier"
        }
    ],
    "GR": [
        {
            "name": "Antonis Nikopolidis",
            "pos": "gk",
            "title": "The 2004 Wall",
            "title_es": "El Muro de 2004"
        },
        {
            "name": "Traianos Dellas",
            "pos": "def",
            "title": "The Colossus of Rhodes",
            "title_es": "El Coloso de Rodas"
        },
        {
            "name": "Giorgos Karagounis",
            "pos": "mid",
            "title": "The 139-Cap Captain",
            "title_es": "El Capitán Griego"
        },
        {
            "name": "Angelos Charisteas",
            "pos": "st",
            "title": "The 2004 Winner",
            "title_es": "El Héroe de 2004"
        }
    ],
    "TN": [
        {
            "name": "Aymen Mathlouthi",
            "pos": "gk",
            "title": "Balbouli",
            "title_es": "Balbouli"
        },
        {
            "name": "Radhi Jaïdi",
            "pos": "def",
            "title": "The Rock of Tunis",
            "title_es": "La Roca de Túnez"
        },
        {
            "name": "Wahbi Khazri",
            "pos": "mid",
            "title": "The Tunisian Maestro",
            "title_es": "El Maestro Tunecino"
        },
        {
            "name": "Issam Jemâa",
            "pos": "st",
            "title": "All-Time Top Scorer",
            "title_es": "Máximo Goleador Histórico"
        }
    ],
    "SC": [
        {
            "name": "Craig Gordon",
            "pos": "gk",
            "title": "The Flying Scot",
            "title_es": "El Escocés Volador"
        },
        {
            "name": "Colin Hendry",
            "pos": "def",
            "title": "Braveheart",
            "title_es": "Corazón Valiente"
        },
        {
            "name": "Darren Fletcher",
            "pos": "mid",
            "title": "The Engine",
            "title_es": "El Motor Escocés"
        },
        {
            "name": "Kenny Miller",
            "pos": "st",
            "title": "The Old Firm Hero",
            "title_es": "El Héroe Escocés"
        }
    ],
    "PY": [
        {
            "name": "Justo Villar",
            "pos": "gk",
            "title": "Saint Villar",
            "title_es": "San Villar"
        },
        {
            "name": "Paulo da Silva",
            "pos": "def",
            "title": "The Great Captain",
            "title_es": "El Gran Capitán"
        },
        {
            "name": "Roberto Acuña",
            "pos": "mid",
            "title": "The Bull",
            "title_es": "El Toro"
        },
        {
            "name": "Roque Santa Cruz",
            "pos": "st",
            "title": "El Baby Gol",
            "title_es": "El Baby Gol"
        }
    ],
    "CL": [
        {
            "name": "Claudio Bravo",
            "pos": "gk",
            "title": "Captain America",
            "title_es": "Capitán América"
        },
        {
            "name": "Gary Medel",
            "pos": "def",
            "title": "The Pitbull",
            "title_es": "El Pitbull"
        },
        {
            "name": "Arturo Vidal",
            "pos": "mid",
            "title": "King Arturo",
            "title_es": "Rey Arturo"
        },
        {
            "name": "Alexis Sánchez",
            "pos": "st",
            "title": "Wonder Boy",
            "title_es": "El Niño Maravilla"
        }
    ],
    "PE": [
        {
            "name": "Pedro Gallese",
            "pos": "gk",
            "title": "The Octopus",
            "title_es": "El Pulpo"
        },
        {
            "name": "Alberto Rodríguez",
            "pos": "def",
            "title": "The Mute",
            "title_es": "El Mudo"
        },
        {
            "name": "Nolberto Solano",
            "pos": "mid",
            "title": "Nobby",
            "title_es": "Nobby"
        },
        {
            "name": "Paolo Guerrero",
            "pos": "st",
            "title": "The Predator",
            "title_es": "El Depredador"
        }
    ],
    "VE": [
        {
            "name": "Wuilker Faríñez",
            "pos": "gk",
            "title": "The Vinotinto Falcon",
            "title_es": "El Halcón Vinotinto"
        },
        {
            "name": "Oswaldo Vizcarrondo",
            "pos": "def",
            "title": "The Marshal",
            "title_es": "El Mariscal"
        },
        {
            "name": "Juan Arango",
            "pos": "mid",
            "title": "El Arangol",
            "title_es": "El Arangol"
        },
        {
            "name": "Salomón Rondón",
            "pos": "st",
            "title": "The Gladiator",
            "title_es": "El Gladiador"
        }
    ],
    "CA": [
        {
            "name": "Milan Borjan",
            "pos": "gk",
            "title": "The Sweatpants Keeper",
            "title_es": "El Portero Canadiense"
        },
        {
            "name": "Atiba Hutchinson",
            "pos": "def",
            "title": "The Canadian Ageless Legend",
            "title_es": "La Leyenda Incombustible"
        },
        {
            "name": "Alphonso Davies",
            "pos": "mid",
            "title": "Phonzie",
            "title_es": "Phonzie"
        },
        {
            "name": "Jonathan David",
            "pos": "st",
            "title": "The Iceman",
            "title_es": "El Hombre de Hielo"
        }
    ],
    "QA": [
        {
            "name": "Saad Al-Sheeb",
            "pos": "gk",
            "title": "The Asian Cup Wall",
            "title_es": "El Muro de la Copa de Asia"
        },
        {
            "name": "Abdelkarim Hassan",
            "pos": "def",
            "title": "Asian Player of the Year",
            "title_es": "Jugador del Año de Asia"
        },
        {
            "name": "Hassan Al-Haydos",
            "pos": "mid",
            "title": "Captain Hassan",
            "title_es": "Capitán Hassan"
        },
        {
            "name": "Almoez Ali",
            "pos": "st",
            "title": "Asian Cup Top Scorer",
            "title_es": "Máximo Goleador de la Copa de Asia"
        }
    ],
    "SA": [
        {
            "name": "Mohamed Al-Deayea",
            "pos": "gk",
            "title": "The Legend of the Desert",
            "title_es": "La Leyenda del Desierto"
        },
        {
            "name": "Osama Hawsawi",
            "pos": "def",
            "title": "The Green Wall",
            "title_es": "El Muro Verde"
        },
        {
            "name": "Nawaf Al-Temyat",
            "pos": "mid",
            "title": "The Desert Maestro",
            "title_es": "El Maestro del Desierto"
        },
        {
            "name": "Sami Al-Jaber",
            "pos": "st",
            "title": "The World Cup Legend",
            "title_es": "La Leyenda Mundialista"
        }
    ],
    "ZA": [
        {
            "name": "Itumeleng Khune",
            "pos": "gk",
            "title": "Spider-Kid",
            "title_es": "Spider-Kid"
        },
        {
            "name": "Lucas Radebe",
            "pos": "def",
            "title": "The Chief",
            "title_es": "El Jefe"
        },
        {
            "name": "Steven Pienaar",
            "pos": "mid",
            "title": "Schillo",
            "title_es": "Schillo"
        },
        {
            "name": "Benni McCarthy",
            "pos": "st",
            "title": "The Champions League Winner",
            "title_es": "El Campeón de la Champions"
        }
    ],
    "CR": [
        {
            "name": "Keylor Navas",
            "pos": "gk",
            "title": "The Falcon",
            "title_es": "El Halcón"
        },
        {
            "name": "Giancarlo González",
            "pos": "def",
            "title": "Pipo",
            "title_es": "Pipo"
        },
        {
            "name": "Bryan Ruiz",
            "pos": "mid",
            "title": "Captain Tico",
            "title_es": "El Capitán Tico"
        },
        {
            "name": "Paulo Wanchope",
            "pos": "st",
            "title": "The Tax Collector",
            "title_es": "El Cobrador"
        }
    ],
    "CM": [
        {
            "name": "Carlos Kameni",
            "pos": "gk",
            "title": "The Panther",
            "title_es": "El Pantera"
        },
        {
            "name": "Rigobert Song",
            "pos": "def",
            "title": "Big Chief",
            "title_es": "Gran Jefe"
        },
        {
            "name": "Alexandre Song",
            "pos": "mid",
            "title": "The Maestro",
            "title_es": "El Maestro"
        },
        {
            "name": "Samuel Eto'o",
            "pos": "st",
            "title": "The Indomitable Lion",
            "title_es": "El León Indomable"
        }
    ],
    "ML": [
        {
            "name": "Djigui Diarra",
            "pos": "gk",
            "title": "The Malian Wall",
            "title_es": "El Muro de Malí"
        },
        {
            "name": "Adama Coulibaly",
            "pos": "def",
            "title": "Police",
            "title_es": "Policía"
        },
        {
            "name": "Seydou Keita",
            "pos": "mid",
            "title": "The Golden Left",
            "title_es": "La Zurda de Oro"
        },
        {
            "name": "Frédéric Kanouté",
            "pos": "st",
            "title": "The Malian Giant",
            "title_es": "El Gigante Maliense"
        }
    ]
};

  const DATA = {
    FIELD_STATS, GK_STATS, POSITIONS, OVR_WEIGHTS, ATTACK_RATES,
    COUNTRIES, DECISIONS, BOOSTERS, RARITY_ROLL, CONSUMABLES, SIM_LINES, HEADLINES, RETIREMENT_QUOTES, NAT_LEGENDS, CLUB_LEGENDS,
  };

  root.GAME_DATA = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof window !== 'undefined' ? window : globalThis);
