(function (root) {
  'use strict';

  // Position-Specific Decisions
  const POS_DECISIONS = [
    // --- GOALKEEPER (GK) ---
    { id: 'gk-sweeper', min: 16, max: 39, pos: 'gk', rarity: 'bronze', title: 'Sweeper Keeper Duty',
      desc: 'The manager wants you to play much higher up the pitch to sweep behind a high defensive line.',
      options: [
        { id: 'a', text: 'Embrace the risk and push up.', changes: [{ k: 'sta', d: -3 }, { k: 'rep', d: 3 }, { k: 'pos', d: -2, v: true }, { k: 'tac', d: 4, v: true }] },
        { id: 'b', text: 'Stay closer to your line to be safe.', changes: [{ k: 'loyalty', d: -4 }, { k: 'pos', d: 3, v: true }] }
      ]
    },
    { id: 'gk-penalty-study', min: 16, max: 39, pos: 'gk', rarity: 'silver', title: 'Penalty Study Session',
      desc: 'The upcoming opponent has a lethal penalty taker. The GK coach wants you to spend extra hours studying their run-ups.',
      options: [
        { id: 'a', text: 'Study tape all night.', changes: [{ k: 'mor', d: -3 }, { k: 'tac', d: 6, v: true }, { k: 'pas', d: -2, v: true }] },
        { id: 'b', text: 'Rely on your instincts.', changes: [{ k: 'mor', d: 4 }, { k: 'tac', d: -3, v: true }, { k: 'ref', d: 4, v: true }] }
      ]
    },
    { id: 'gk-howler', min: 16, max: 39, pos: 'gk', rarity: 'bronze', title: 'Viral Howler',
      desc: 'You made a massive blunder that went viral on social media. The fans are mocking you.',
      options: [
        { id: 'a', text: 'Post a public apology.', changes: [{ k: 'rep', d: 5 }, { k: 'mor', d: -8 }, { k: 'loyalty', d: 3 }] },
        { id: 'b', text: 'Delete social media and focus on training.', changes: [{ k: 'mor', d: 4 }, { k: 'rep', d: -5 }, { k: 'pos', d: 3, v: true }] }
      ]
    },
    { id: 'gk-distribution', min: 16, max: 39, pos: 'gk', rarity: 'silver', title: 'Play From the Back',
      desc: 'The new tactical setup requires you to act as an 11th outfield player in possession.',
      options: [
        { id: 'a', text: 'Practice your short passing extensively.', changes: [{ k: 'pas', d: 8, v: true }, { k: 'ref', d: -3, v: true }, { k: 'sta', d: -4 }] },
        { id: 'b', text: 'Keep booting it long.', changes: [{ k: 'loyalty', d: -6 }, { k: 'kic', d: 6, v: true }] }
      ]
    },
    { id: 'gk-captaincy', min: 24, max: 39, pos: 'gk', rarity: 'gold', title: 'Vocal Leader',
      desc: 'The captain is injured and the manager asks you to organize the defense from the back.',
      options: [
        { id: 'a', text: 'Command the box aggressively.', changes: [{ k: 'rep', d: 8 }, { k: 'mor', d: 5 }, { k: 'pos', d: 5, v: true }, { k: 'tac', d: 5, v: true }] },
        { id: 'b', text: 'Just focus on your own saves.', changes: [{ k: 'loyalty', d: -5 }, { k: 'ref', d: 7, v: true }] }
      ]
    },

    // --- CENTER BACK (CB) ---
    { id: 'cb-aggressor', min: 16, max: 39, pos: 'def', rarity: 'bronze', title: 'The Enforcer',
      desc: 'The opposition striker is bullying your defense. You need to send a message early in the game.',
      options: [
        { id: 'a', text: 'Put in a hard, crunching tackle.', changes: [{ k: 'phy', d: 5, v: true }, { k: 'pac', d: -2, v: true }, { k: 'rep', d: 3 }] },
        { id: 'b', text: 'Jockey and wait for the mistake.', changes: [{ k: 'def', d: 4, v: true }, { k: 'phy', d: -2, v: true }] }
      ]
    },
    { id: 'cb-offside-trap', min: 16, max: 39, pos: 'def', rarity: 'silver', title: 'Master the Trap',
      desc: 'The manager is implementing a rigid offside trap. As the center back, you must coordinate the line perfectly.',
      options: [
        { id: 'a', text: 'Lead the defensive line drill.', changes: [{ k: 'tac', d: 7, v: true }, { k: 'pos', d: 4, v: true }, { k: 'mor', d: -2 }] },
        { id: 'b', text: 'Drop deep to cover runners instead.', changes: [{ k: 'loyalty', d: -5 }, { k: 'def', d: 5, v: true }, { k: 'pac', d: 3, v: true }] }
      ]
    },
    { id: 'cb-set-piece-threat', min: 16, max: 39, pos: 'def', rarity: 'bronze', title: 'Aerial Target',
      desc: 'The team has been struggling to score from corners. The coach wants you to be the primary target.',
      options: [
        { id: 'a', text: 'Spend hours on attacking headers.', changes: [{ k: 'sho', d: 5, v: true }, { k: 'phy', d: 3, v: true }, { k: 'sta', d: -3 }] },
        { id: 'b', text: 'Stay back to prevent counter-attacks.', changes: [{ k: 'def', d: 4, v: true }, { k: 'pos', d: 3, v: true }] }
      ]
    },
    { id: 'cb-injury-crisis', min: 20, max: 39, pos: 'def', rarity: 'gold', title: 'Makeshift Fullback',
      desc: 'Both fullbacks are injured. The manager asks you to cover the right flank against a rapid winger.',
      options: [
        { id: 'a', text: 'Adapt and run the channel.', changes: [{ k: 'pac', d: 6, v: true }, { k: 'dri', d: 4, v: true }, { k: 'phy', d: -4, v: true }, { k: 'sta', d: -6 }] },
        { id: 'b', text: 'Refuse, you are a pure center back.', changes: [{ k: 'loyalty', d: -10 }, { k: 'mor', d: -5 }, { k: 'def', d: 6, v: true }] }
      ]
    },
    { id: 'cb-ball-playing', min: 16, max: 39, pos: 'def', rarity: 'silver', title: 'Libero Transformation',
      desc: 'The new modern manager wants you to carry the ball into midfield and break the lines with passes.',
      options: [
        { id: 'a', text: 'Embrace the Libero role.', changes: [{ k: 'pas', d: 7, v: true }, { k: 'dri', d: 5, v: true }, { k: 'def', d: -3, v: true }] },
        { id: 'b', text: 'Stick to no-nonsense defending.', changes: [{ k: 'loyalty', d: -4 }, { k: 'def', d: 6, v: true }, { k: 'phy', d: 4, v: true }] }
      ]
    },

    // --- MIDFIELDER (MID) ---
    { id: 'mid-engine-room', min: 16, max: 39, pos: 'mid', rarity: 'bronze', title: 'Engine Room Overdrive',
      desc: 'The team lacks energy in the center of the park. You are asked to cover every blade of grass today.',
      options: [
        { id: 'a', text: 'Run until you drop.', changes: [{ k: 'sta', d: -8 }, { k: 'pac', d: 4, v: true }, { k: 'phy', d: 3, v: true }, { k: 'rep', d: 4 }] },
        { id: 'b', text: 'Pace yourself intelligently.', changes: [{ k: 'tac', d: 4, v: true }, { k: 'pos', d: 3, v: true }, { k: 'rep', d: -2 }] }
      ]
    },
    { id: 'mid-maestro', min: 16, max: 39, pos: 'mid', rarity: 'silver', title: 'The Midfield Maestro',
      desc: 'Your team is struggling against a low block. You need to dictate the tempo and unlock the defense.',
      options: [
        { id: 'a', text: 'Attempt risky killer passes.', changes: [{ k: 'pas', d: 7, v: true }, { k: 'sho', d: -3, v: true }, { k: 'rep', d: 3 }] },
        { id: 'b', text: 'Keep possession recycling safely.', changes: [{ k: 'pos', d: 5, v: true }, { k: 'dri', d: -2, v: true }, { k: 'loyalty', d: 2 }] }
      ]
    },
    { id: 'mid-dirty-work', min: 16, max: 39, pos: 'mid', rarity: 'bronze', title: 'The Dirty Work',
      desc: 'The star attacking midfielder refuses to track back. You are asked to do his defensive duties.',
      options: [
        { id: 'a', text: 'Sacrifice yourself for the team.', changes: [{ k: 'def', d: 5, v: true }, { k: 'phy', d: 3, v: true }, { k: 'sho', d: -4, v: true }, { k: 'loyalty', d: 6 }] },
        { id: 'b', text: 'Complain to the manager.', changes: [{ k: 'loyalty', d: -7 }, { k: 'mor', d: -4 }, { k: 'sho', d: 4, v: true }] }
      ]
    },
    { id: 'mid-box-crash', min: 16, max: 39, pos: 'mid', rarity: 'silver', title: 'Late Box Crasher',
      desc: 'The coach notices gaps at the edge of the area and wants you to make late runs into the box.',
      options: [
        { id: 'a', text: 'Work on your finishing and timing.', changes: [{ k: 'sho', d: 6, v: true }, { k: 'pos', d: 4, v: true }, { k: 'def', d: -3, v: true }] },
        { id: 'b', text: 'Provide cover outside the box instead.', changes: [{ k: 'def', d: 5, v: true }, { k: 'pas', d: 3, v: true }] }
      ]
    },
    { id: 'mid-penalty-duty', min: 20, max: 39, pos: 'mid', rarity: 'gold', title: 'New Penalty Taker',
      desc: 'The regular penalty taker missed three in a row. The manager hands the ball to you.',
      options: [
        { id: 'a', text: 'Accept the pressure.', changes: [{ k: 'sho', d: 7, v: true }, { k: 'mor', d: 5 }, { k: 'rep', d: 8 }, { k: 'pas', d: -4, v: true }] },
        { id: 'b', text: 'Give it back to the striker to build his confidence.', changes: [{ k: 'loyalty', d: 8 }, { k: 'mor', d: 3 }, { k: 'sho', d: -2, v: true }] }
      ]
    },

    // --- STRIKER (ST) ---
    { id: 'st-goal-drought', min: 16, max: 39, pos: 'att', rarity: 'bronze', title: 'Goal Drought',
      desc: 'You haven’t scored in 7 matches. The media is calling you a flop.',
      options: [
        { id: 'a', text: 'Stay extra hours for finishing drills.', changes: [{ k: 'sho', d: 6, v: true }, { k: 'sta', d: -5 }, { k: 'mor', d: -2 }] },
        { id: 'b', text: 'Ignore the noise, it will come naturally.', changes: [{ k: 'mor', d: 4 }, { k: 'pos', d: 3, v: true }, { k: 'sho', d: -2, v: true }] }
      ]
    },
    { id: 'st-target-man', min: 16, max: 39, pos: 'att', rarity: 'silver', title: 'Target Man Duty',
      desc: 'The team is playing long balls. You need to hold up the play against giant defenders.',
      options: [
        { id: 'a', text: 'Hit the gym and bulk up.', changes: [{ k: 'phy', d: 7, v: true }, { k: 'pac', d: -4, v: true }, { k: 'pas', d: 3, v: true }] },
        { id: 'b', text: 'Try to spin in behind instead.', changes: [{ k: 'pac', d: 5, v: true }, { k: 'dri', d: 3, v: true }, { k: 'phy', d: -3, v: true }] }
      ]
    },
    { id: 'st-selfish-streak', min: 16, max: 39, pos: 'att', rarity: 'bronze', title: 'Selfish Streak',
      desc: 'You are on a hat-trick, but your teammate is wide open for an easy tap-in.',
      options: [
        { id: 'a', text: 'Take the shot yourself for glory.', changes: [{ k: 'sho', d: 5, v: true }, { k: 'rep', d: 6 }, { k: 'loyalty', d: -6 }, { k: 'pas', d: -3, v: true }] },
        { id: 'b', text: 'Square it for the guaranteed goal.', changes: [{ k: 'pas', d: 5, v: true }, { k: 'loyalty', d: 6 }, { k: 'rep', d: -2 }] }
      ]
    },
    { id: 'st-false-nine', min: 16, max: 39, pos: 'att', rarity: 'silver', title: 'The False Nine',
      desc: 'The manager wants to surprise the opponent by deploying you as a False Nine.',
      options: [
        { id: 'a', text: 'Drop deep and link the play.', changes: [{ k: 'pas', d: 6, v: true }, { k: 'pos', d: 4, v: true }, { k: 'sho', d: -4, v: true }] },
        { id: 'b', text: 'Play on the defender’s shoulder as usual.', changes: [{ k: 'loyalty', d: -5 }, { k: 'sho', d: 5, v: true }, { k: 'pac', d: 3, v: true }] }
      ]
    },
    { id: 'st-golden-boot', min: 22, max: 39, pos: 'att', rarity: 'gold', title: 'Golden Boot Race',
      desc: 'It’s the final game of the season and you are tied for the league Golden Boot.',
      options: [
        { id: 'a', text: 'Demand every pass goes to you.', changes: [{ k: 'sho', d: 8, v: true }, { k: 'dri', d: 5, v: true }, { k: 'loyalty', d: -8 }, { k: 'mor', d: 5 }] },
        { id: 'b', text: 'Play normally for the team win.', changes: [{ k: 'loyalty', d: 8 }, { k: 'rep', d: 5 }, { k: 'sho', d: -2, v: true }] }
      ]
    },

    // --- LEAGUE SPECIFIC (PREMIER LEAGUE - GB) ---
    { id: 'gb-boxing-day', min: 16, max: 39, rarity: 'silver', title: 'Boxing Day Madness',
      desc: 'Welcome to England. It’s December, it’s freezing, and you have 3 matches in 7 days.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'GB',
      options: [
        { id: 'a', text: 'Hire a personal physio and recover.', changes: [{ k: 'sta', d: 6, v: true }, { k: 'phy', d: 3, v: true }, { k: 'money', d: -15000 }] },
        { id: 'b', text: 'Push through the pain barrier.', changes: [{ k: 'sta', d: -8 }, { k: 'loyalty', d: 6 }, { k: 'rep', d: 5 }] }
      ]
    },
    { id: 'gb-pundit-clash', min: 16, max: 39, rarity: 'bronze', title: 'Pundit Criticism',
      desc: 'A famous English pundit destroyed your performance on prime-time television.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'GB',
      options: [
        { id: 'a', text: 'Bite back on social media.', changes: [{ k: 'rep', d: 6 }, { k: 'mor', d: -4 }, { k: 'loyalty', d: -3 }] },
        { id: 'b', text: 'Answer them on the pitch.', changes: [{ k: 'mor', d: 4 }, { k: 'tac', d: 3, v: true }] }
      ]
    },
    { id: 'gb-rainy-tuesday', min: 16, max: 39, rarity: 'bronze', title: 'Cold Rainy Night',
      desc: 'It’s a freezing, rainy Tuesday night away in a hostile stadium in the cup.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'GB',
      options: [
        { id: 'a', text: 'Roll up your sleeves and battle.', changes: [{ k: 'phy', d: 5, v: true }, { k: 'sta', d: -5 }, { k: 'loyalty', d: 4 }] },
        { id: 'b', text: 'Wear gloves and avoid tackles.', changes: [{ k: 'phy', d: -4, v: true }, { k: 'pac', d: 3, v: true }, { k: 'rep', d: -4 }] }
      ]
    },

    // --- LEAGUE SPECIFIC (LA LIGA - ES) ---
    { id: 'es-tiki-taka', min: 16, max: 39, rarity: 'silver', title: 'Tiki-Taka Transition',
      desc: 'The Spanish media demands beautiful football. The coach wants the ball on the ground at all times.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'ES',
      options: [
        { id: 'a', text: 'Master the rondo passing drills.', changes: [{ k: 'pas', d: 7, v: true }, { k: 'pos', d: 4, v: true }, { k: 'phy', d: -3, v: true }] },
        { id: 'b', text: 'Stick to direct vertical play.', changes: [{ k: 'loyalty', d: -5 }, { k: 'pac', d: 5, v: true }, { k: 'sho', d: 3, v: true }] }
      ]
    },
    { id: 'es-siesta-schedule', min: 16, max: 39, rarity: 'bronze', title: 'Late Night Kick-offs',
      desc: 'Matches kick off at 10 PM here in Spain. Your sleep schedule is ruined.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'ES',
      options: [
        { id: 'a', text: 'Adapt to the local culture and siestas.', changes: [{ k: 'sta', d: 4, v: true }, { k: 'mor', d: 3 }, { k: 'rep', d: -2 }] },
        { id: 'b', text: 'Complain about the scheduling.', changes: [{ k: 'mor', d: -4 }, { k: 'rep', d: 3 }, { k: 'loyalty', d: -3 }] }
      ]
    },
    
    // --- LEAGUE SPECIFIC (SERIE A - IT) ---
    { id: 'it-catenaccio', min: 16, max: 39, rarity: 'silver', title: 'Catenaccio Revival',
      desc: 'Welcome to Italy. The coach spends 4 hours a day purely on defensive tactical shape.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'IT',
      options: [
        { id: 'a', text: 'Absorb the tactical masterclass.', changes: [{ k: 'tac', d: 8, v: true }, { k: 'def', d: 4, v: true }, { k: 'att', d: -4, v: true }] },
        { id: 'b', text: 'Sneak away to practice finishing.', changes: [{ k: 'loyalty', d: -6 }, { k: 'sho', d: 6, v: true }, { k: 'tac', d: -3, v: true }] }
      ]
    },
    { id: 'it-ultras', min: 16, max: 39, rarity: 'gold', title: 'Meeting the Ultras',
      desc: 'The passionate Italian Ultras have demanded a meeting with the squad after a bad run of form.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'IT',
      options: [
        { id: 'a', text: 'Stand at the front and take the heat.', changes: [{ k: 'rep', d: 10 }, { k: 'loyalty', d: 8 }, { k: 'mor', d: -6 }, { k: 'phy', d: 3, v: true }] },
        { id: 'b', text: 'Stay in the back of the group.', changes: [{ k: 'rep', d: -6 }, { k: 'mor', d: 3 }, { k: 'tac', d: 2, v: true }] }
      ]
    },

    // --- LEAGUE SPECIFIC (BUNDESLIGA - DE) ---
    { id: 'de-gegenpress', min: 16, max: 39, rarity: 'silver', title: 'Gegenpressing Hell',
      desc: 'The German coach demands intense pressing the moment possession is lost. It is exhausting.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'DE',
      options: [
        { id: 'a', text: 'Run until your lungs burst.', changes: [{ k: 'sta', d: -6 }, { k: 'phy', d: 5, v: true }, { k: 'pos', d: 4, v: true }, { k: 'loyalty', d: 5 }] },
        { id: 'b', text: 'Save energy for counter-attacks.', changes: [{ k: 'loyalty', d: -6 }, { k: 'pac', d: 6, v: true }, { k: 'sho', d: 3, v: true }] }
      ]
    },
    
    // --- LEAGUE SPECIFIC (LIGUE 1 - FR) ---
    { id: 'fr-physical-league', min: 16, max: 39, rarity: 'bronze', title: 'Physical Battles',
      desc: 'The French league is known for its incredible athleticism and tough tackling.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'FR',
      options: [
        { id: 'a', text: 'Spend extra time in the weights room.', changes: [{ k: 'phy', d: 6, v: true }, { k: 'pac', d: -2, v: true }, { k: 'sta', d: -3 }] },
        { id: 'b', text: 'Rely on your agility to avoid tackles.', changes: [{ k: 'dri', d: 5, v: true }, { k: 'phy', d: -3, v: true }] }
      ]
    },

    // --- LEAGUE SPECIFIC (BRASILEIRAO - BR) ---
    { id: 'br-joga-bonito', min: 16, max: 39, rarity: 'silver', title: 'Joga Bonito',
      desc: 'The Brazilian fans demand flair, skill, and entertainment, not just results.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'BR',
      options: [
        { id: 'a', text: 'Practice new skill moves.', changes: [{ k: 'dri', d: 7, v: true }, { k: 'rep', d: 5 }, { k: 'tac', d: -4, v: true }] },
        { id: 'b', text: 'Play efficient, European-style football.', changes: [{ k: 'rep', d: -5 }, { k: 'pas', d: 5, v: true }, { k: 'tac', d: 4, v: true }] }
      ]
    },

    // --- LEAGUE SPECIFIC (MLS - US) ---
    { id: 'us-travel-fatigue', min: 16, max: 39, rarity: 'bronze', title: 'Cross-Country Flights',
      desc: 'In the MLS, away games can mean a 6-hour flight across time zones.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).countryId === 'US',
      options: [
        { id: 'a', text: 'Buy first-class recovery equipment.', changes: [{ k: 'sta', d: 5, v: true }, { k: 'money', d: -20000 }] },
        { id: 'b', text: 'Just sleep on the plane.', changes: [{ k: 'sta', d: -6 }, { k: 'mor', d: -2 }, { k: 'money', d: 5000 }] }
      ]
    },

    // --- BIG CLUB SPECIFIC ---
    { id: 'big-club-pressure', min: 18, max: 39, rarity: 'gold', title: 'Weight of the Shirt',
      desc: 'Playing for a giant club means every mistake is magnified by millions of fans globally.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).s >= 83,
      options: [
        { id: 'a', text: 'Hire a sports psychologist.', changes: [{ k: 'mor', d: 8 }, { k: 'tac', d: 5, v: true }, { k: 'money', d: -35000 }] },
        { id: 'b', text: 'Thrive on the pressure.', changes: [{ k: 'rep', d: 8 }, { k: 'mor', d: -4 }, { k: 'sho', d: 4, v: true }] }
      ]
    },
    { id: 'big-club-rotation', min: 18, max: 39, rarity: 'silver', title: 'Star-Studded Bench',
      desc: 'The squad is so packed with Galácticos that the manager is rotating you out of big games.',
      condition: (s) => s.club && E().clubByCid(s.club.cid).s >= 85,
      options: [
        { id: 'a', text: 'Fight for your spot in training.', changes: [{ k: 'phy', d: 4, v: true }, { k: 'sta', d: -6 }, { k: 'loyalty', d: 4 }] },
        { id: 'b', text: 'Leak your frustration to the press.', changes: [{ k: 'rep', d: 6 }, { k: 'loyalty', d: -12 }, { k: 'mor', d: -5 }] }
      ]
    },

    // --- NATIONAL TEAM SPECIFIC ---
    { id: 'nt-major-tournament', min: 18, max: 39, rarity: 'gold', title: 'National Hero',
      desc: 'It’s the summer of a major international tournament. Your country expects glory.',
      condition: (s) => s.ntCalledUp && s.totals && s.totals.caps > 0,
      options: [
        { id: 'a', text: 'Play through a minor injury for your country.', changes: [{ k: 'rep', d: 15 }, { k: 'sta', d: -12 }, { k: 'mor', d: 5 }, { k: 'phy', d: -4, v: true }] },
        { id: 'b', text: 'Prioritize your club fitness and withdraw.', changes: [{ k: 'rep', d: -15 }, { k: 'sta', d: 10 }, { k: 'loyalty', d: 8 }] }
      ]
    },
    
    // --- CONFLICT & DRAMA ---
    { id: 'conflict-manager-bustup', min: 16, max: 39, rarity: 'silver', title: 'Dressing Room Bust-Up',
      desc: 'You and the manager had a massive screaming match in front of the whole squad at halftime.',
      options: [
        { id: 'a', text: 'Apologize in front of the team.', changes: [{ k: 'loyalty', d: 10 }, { k: 'mor', d: -5 }, { k: 'rep', d: -3 }] },
        { id: 'b', text: 'Refuse to back down.', changes: [{ k: 'loyalty', d: -15 }, { k: 'rep', d: 6 }, { k: 'mor', d: 4 }] }
      ]
    },
    { id: 'conflict-teammate-feud', min: 16, max: 39, rarity: 'bronze', title: 'Training Ground Scuffle',
      desc: 'A heavy tackle in training led to a physical altercation with the club captain.',
      options: [
        { id: 'a', text: 'Shake hands and move on.', changes: [{ k: 'loyalty', d: 5 }, { k: 'mor', d: 3 }, { k: 'phy', d: 2, v: true }] },
        { id: 'b', text: 'Hold a grudge and ignore him on the pitch.', changes: [{ k: 'pas', d: -5, v: true }, { k: 'loyalty', d: -8 }, { k: 'sho', d: 4, v: true }] }
      ]
    }
,
    {"id":"gen-gk-0","min":16,"max":39,"pos":"gk","rarity":"silver","title":"New Cleats 0","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":-2},{"k":"kic","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"ref","d":1},{"k":"def","d":-3}]}]},
    {"id":"gen-def-1","min":16,"max":39,"pos":"def","rarity":"bronze","title":"Sponsorship Offer 1","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":1},{"k":"pac","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"def","d":-1},{"k":"def","d":-4}]}]},
    {"id":"gen-any-2","min":16,"max":39,"pos":"any","rarity":"gold","title":"Night Out 2","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":5},{"k":"mor","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"phy","d":3},{"k":"ref","d":-1}]}]},
    {"id":"gen-att-3","min":16,"max":39,"pos":"att","rarity":"gold","title":"Late to Training 3","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":1},{"k":"pac","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":3},{"k":"kic","d":-1}]}]},
    {"id":"gen-any-4","min":16,"max":39,"pos":"any","rarity":"silver","title":"New Cleats 4","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"phy","d":-4},{"k":"loyalty","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":0},{"k":"pas","d":-2}]}]},
    {"id":"gen-def-5","min":16,"max":39,"pos":"def","rarity":"gold","title":"Media Interview 5","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"kic","d":-3},{"k":"dri","d":2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":-2},{"k":"mor","d":0}]}]},
    {"id":"gen-def-6","min":16,"max":39,"pos":"def","rarity":"silver","title":"Sponsorship Offer 6","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"mor","d":1},{"k":"loyalty","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"mor","d":3},{"k":"sta","d":2}]}]},
    {"id":"gen-mid-7","min":16,"max":39,"pos":"mid","rarity":"bronze","title":"Media Interview 7","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":5},{"k":"pos","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":-2},{"k":"dri","d":-1}]}]},
    {"id":"gen-gk-8","min":16,"max":39,"pos":"gk","rarity":"silver","title":"Late to Training 8","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sho","d":-5},{"k":"pos","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"mor","d":-4},{"k":"sta","d":-4}]}]},
    {"id":"gen-gk-9","min":16,"max":39,"pos":"gk","rarity":"silver","title":"Charity Match 9","desc":"You are invited to play in a charity match.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":-5},{"k":"ref","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":2},{"k":"def","d":-5}]}]},
    {"id":"gen-def-10","min":16,"max":39,"pos":"def","rarity":"gold","title":"Dietary Change 10","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":-5},{"k":"def","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":5},{"k":"pos","d":-1}]}]},
    {"id":"gen-gk-11","min":16,"max":39,"pos":"gk","rarity":"silver","title":"Rival Taunt 11","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":2},{"k":"pas","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"ref","d":-1},{"k":"sho","d":3}]}]},
    {"id":"gen-any-12","min":16,"max":39,"pos":"any","rarity":"diamond","title":"Fan Meeting 12","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sho","d":-3},{"k":"loyalty","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"mor","d":0},{"k":"phy","d":0}]}]},
    {"id":"gen-mid-13","min":16,"max":39,"pos":"mid","rarity":"silver","title":"Media Interview 13","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":5},{"k":"dri","d":0}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"tac","d":-1},{"k":"pac","d":3}]}]},
    {"id":"gen-mid-14","min":16,"max":39,"pos":"mid","rarity":"silver","title":"Dietary Change 14","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":3},{"k":"pac","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":1},{"k":"dri","d":2}]}]},
    {"id":"gen-def-15","min":16,"max":39,"pos":"def","rarity":"silver","title":"Night Out 15","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"phy","d":3},{"k":"sho","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":-4},{"k":"phy","d":-1}]}]},
    {"id":"gen-att-16","min":16,"max":39,"pos":"att","rarity":"diamond","title":"Late to Training 16","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sho","d":2},{"k":"pos","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":0},{"k":"phy","d":2}]}]},
    {"id":"gen-att-17","min":16,"max":39,"pos":"att","rarity":"bronze","title":"Charity Match 17","desc":"You are invited to play in a charity match.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"tac","d":-2},{"k":"loyalty","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":-4},{"k":"sho","d":-1}]}]},
    {"id":"gen-any-18","min":16,"max":39,"pos":"any","rarity":"diamond","title":"Rival Taunt 18","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":1},{"k":"ref","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":-1},{"k":"phy","d":-5}]}]},
    {"id":"gen-mid-19","min":16,"max":39,"pos":"mid","rarity":"diamond","title":"Fan Meeting 19","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"kic","d":-3},{"k":"ref","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":-1},{"k":"tac","d":4}]}]},
    {"id":"gen-any-20","min":16,"max":39,"pos":"any","rarity":"silver","title":"Late to Training 20","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":4},{"k":"kic","d":0}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"ref","d":-4},{"k":"pas","d":-5}]}]},
    {"id":"gen-any-21","min":16,"max":39,"pos":"any","rarity":"silver","title":"Dietary Change 21","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pos","d":1},{"k":"pac","d":1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":0},{"k":"dri","d":0}]}]},
    {"id":"gen-att-22","min":16,"max":39,"pos":"att","rarity":"silver","title":"New Cleats 22","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":4},{"k":"phy","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":-4},{"k":"pos","d":0}]}]},
    {"id":"gen-att-23","min":16,"max":39,"pos":"att","rarity":"diamond","title":"Sponsorship Offer 23","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"ref","d":-4},{"k":"ref","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":1},{"k":"phy","d":3}]}]},
    {"id":"gen-mid-24","min":16,"max":39,"pos":"mid","rarity":"bronze","title":"Dietary Change 24","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":-4},{"k":"pac","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"phy","d":-4},{"k":"mor","d":-2}]}]},
    {"id":"gen-def-25","min":16,"max":39,"pos":"def","rarity":"gold","title":"Fan Meeting 25","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"tac","d":-1},{"k":"mor","d":0}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":-1},{"k":"def","d":-2}]}]},
    {"id":"gen-mid-26","min":16,"max":39,"pos":"mid","rarity":"bronze","title":"Fan Meeting 26","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"rep","d":4},{"k":"mor","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":2},{"k":"pos","d":-2}]}]},
    {"id":"gen-def-27","min":16,"max":39,"pos":"def","rarity":"diamond","title":"Fan Meeting 27","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sho","d":3},{"k":"pas","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"phy","d":3},{"k":"def","d":-5}]}]},
    {"id":"gen-gk-28","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Tactical Disagreement 28","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":-1},{"k":"phy","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":2},{"k":"kic","d":-1}]}]},
    {"id":"gen-att-29","min":16,"max":39,"pos":"att","rarity":"diamond","title":"Tactical Disagreement 29","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":2},{"k":"tac","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pas","d":1},{"k":"phy","d":-3}]}]},
    {"id":"gen-gk-30","min":16,"max":39,"pos":"gk","rarity":"bronze","title":"Sponsorship Offer 30","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":2},{"k":"kic","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"dri","d":-4},{"k":"dri","d":-1}]}]},
    {"id":"gen-def-31","min":16,"max":39,"pos":"def","rarity":"silver","title":"Media Interview 31","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":4},{"k":"sta","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":-4},{"k":"tac","d":4}]}]},
    {"id":"gen-att-32","min":16,"max":39,"pos":"att","rarity":"silver","title":"New Cleats 32","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":5},{"k":"loyalty","d":2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pas","d":-5},{"k":"pas","d":-3}]}]},
    {"id":"gen-mid-33","min":16,"max":39,"pos":"mid","rarity":"gold","title":"Tactical Disagreement 33","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"mor","d":0},{"k":"kic","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pas","d":3},{"k":"sta","d":-4}]}]},
    {"id":"gen-gk-34","min":16,"max":39,"pos":"gk","rarity":"bronze","title":"Sponsorship Offer 34","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pos","d":5},{"k":"pos","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":4},{"k":"loyalty","d":4}]}]},
    {"id":"gen-mid-35","min":16,"max":39,"pos":"mid","rarity":"diamond","title":"Media Interview 35","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":2},{"k":"sta","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":3},{"k":"pac","d":0}]}]},
    {"id":"gen-mid-36","min":16,"max":39,"pos":"mid","rarity":"silver","title":"Dietary Change 36","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"rep","d":-4},{"k":"tac","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"mor","d":-3},{"k":"mor","d":2}]}]},
    {"id":"gen-mid-37","min":16,"max":39,"pos":"mid","rarity":"silver","title":"Media Interview 37","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":1},{"k":"dri","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":3},{"k":"mor","d":-3}]}]},
    {"id":"gen-mid-38","min":16,"max":39,"pos":"mid","rarity":"bronze","title":"Late to Training 38","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"tac","d":4},{"k":"loyalty","d":2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pas","d":5},{"k":"kic","d":-5}]}]},
    {"id":"gen-any-39","min":16,"max":39,"pos":"any","rarity":"gold","title":"Fan Meeting 39","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"ref","d":-2},{"k":"tac","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"mor","d":1},{"k":"sta","d":4}]}]},
    {"id":"gen-any-40","min":16,"max":39,"pos":"any","rarity":"diamond","title":"Dietary Change 40","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"ref","d":-2},{"k":"phy","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"phy","d":-5},{"k":"pas","d":-2}]}]},
    {"id":"gen-mid-41","min":16,"max":39,"pos":"mid","rarity":"diamond","title":"Media Interview 41","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"ref","d":-3},{"k":"sta","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":-4},{"k":"def","d":-3}]}]},
    {"id":"gen-gk-42","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Dietary Change 42","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":5},{"k":"loyalty","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"phy","d":4},{"k":"sta","d":-1}]}]},
    {"id":"gen-def-43","min":16,"max":39,"pos":"def","rarity":"diamond","title":"Media Interview 43","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pas","d":-2},{"k":"tac","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"def","d":5},{"k":"pos","d":3}]}]},
    {"id":"gen-att-44","min":16,"max":39,"pos":"att","rarity":"gold","title":"Rival Taunt 44","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":-2},{"k":"ref","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pos","d":-3},{"k":"def","d":-3}]}]},
    {"id":"gen-mid-45","min":16,"max":39,"pos":"mid","rarity":"gold","title":"Night Out 45","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":-3},{"k":"rep","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"tac","d":2},{"k":"loyalty","d":-3}]}]},
    {"id":"gen-att-46","min":16,"max":39,"pos":"att","rarity":"diamond","title":"Sponsorship Offer 46","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":2},{"k":"pos","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":-5},{"k":"ref","d":0}]}]},
    {"id":"gen-def-47","min":16,"max":39,"pos":"def","rarity":"diamond","title":"Rival Taunt 47","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sho","d":-3},{"k":"mor","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"phy","d":0},{"k":"sho","d":0}]}]},
    {"id":"gen-mid-48","min":16,"max":39,"pos":"mid","rarity":"silver","title":"Sponsorship Offer 48","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"mor","d":3},{"k":"kic","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":-5},{"k":"rep","d":-4}]}]},
    {"id":"gen-any-49","min":16,"max":39,"pos":"any","rarity":"gold","title":"Night Out 49","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":2},{"k":"phy","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pos","d":0},{"k":"tac","d":-2}]}]},
    {"id":"gen-att-50","min":16,"max":39,"pos":"att","rarity":"bronze","title":"Night Out 50","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":-5},{"k":"loyalty","d":2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":1},{"k":"pos","d":5}]}]},
    {"id":"gen-any-51","min":16,"max":39,"pos":"any","rarity":"gold","title":"Late to Training 51","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pos","d":-5},{"k":"phy","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":5},{"k":"def","d":1}]}]},
    {"id":"gen-def-52","min":16,"max":39,"pos":"def","rarity":"silver","title":"Rival Taunt 52","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pas","d":5},{"k":"sho","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":3},{"k":"sho","d":2}]}]},
    {"id":"gen-gk-53","min":16,"max":39,"pos":"gk","rarity":"gold","title":"Media Interview 53","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pas","d":-4},{"k":"tac","d":2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":1},{"k":"loyalty","d":-2}]}]},
    {"id":"gen-gk-54","min":16,"max":39,"pos":"gk","rarity":"gold","title":"Night Out 54","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":-4},{"k":"tac","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"mor","d":0},{"k":"ref","d":4}]}]},
    {"id":"gen-gk-55","min":16,"max":39,"pos":"gk","rarity":"bronze","title":"Tactical Disagreement 55","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"rep","d":4},{"k":"loyalty","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":3},{"k":"sho","d":0}]}]},
    {"id":"gen-def-56","min":16,"max":39,"pos":"def","rarity":"diamond","title":"Late to Training 56","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":-5},{"k":"dri","d":1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pas","d":0},{"k":"tac","d":0}]}]},
    {"id":"gen-gk-57","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Rival Taunt 57","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":1},{"k":"sta","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"ref","d":-5},{"k":"tac","d":-4}]}]},
    {"id":"gen-gk-58","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Late to Training 58","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pas","d":-5},{"k":"phy","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":3},{"k":"def","d":0}]}]},
    {"id":"gen-mid-59","min":16,"max":39,"pos":"mid","rarity":"gold","title":"Late to Training 59","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":-4},{"k":"pos","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":-1},{"k":"kic","d":0}]}]},
    {"id":"gen-gk-60","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Dietary Change 60","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sho","d":0},{"k":"pac","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":5},{"k":"dri","d":3}]}]},
    {"id":"gen-any-61","min":16,"max":39,"pos":"any","rarity":"gold","title":"Dietary Change 61","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":-1},{"k":"pos","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"tac","d":-1},{"k":"tac","d":2}]}]},
    {"id":"gen-gk-62","min":16,"max":39,"pos":"gk","rarity":"gold","title":"New Cleats 62","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":-3},{"k":"rep","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"def","d":1},{"k":"pac","d":-4}]}]},
    {"id":"gen-att-63","min":16,"max":39,"pos":"att","rarity":"silver","title":"Sponsorship Offer 63","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":-5},{"k":"loyalty","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":-5},{"k":"sta","d":4}]}]},
    {"id":"gen-gk-64","min":16,"max":39,"pos":"gk","rarity":"gold","title":"Fan Meeting 64","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"rep","d":-2},{"k":"sta","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pas","d":0},{"k":"pos","d":-3}]}]},
    {"id":"gen-any-65","min":16,"max":39,"pos":"any","rarity":"silver","title":"Rival Taunt 65","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":2},{"k":"tac","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":-2},{"k":"kic","d":-4}]}]},
    {"id":"gen-att-66","min":16,"max":39,"pos":"att","rarity":"diamond","title":"Tactical Disagreement 66","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":0},{"k":"loyalty","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":1},{"k":"kic","d":2}]}]},
    {"id":"gen-gk-67","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Media Interview 67","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":-4},{"k":"dri","d":1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":0},{"k":"sta","d":-3}]}]},
    {"id":"gen-def-68","min":16,"max":39,"pos":"def","rarity":"gold","title":"Charity Match 68","desc":"You are invited to play in a charity match.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sho","d":5},{"k":"pas","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"def","d":-2},{"k":"tac","d":-1}]}]},
    {"id":"gen-def-69","min":16,"max":39,"pos":"def","rarity":"gold","title":"Fan Meeting 69","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"ref","d":-2},{"k":"phy","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":3},{"k":"sho","d":-5}]}]},
    {"id":"gen-mid-70","min":16,"max":39,"pos":"mid","rarity":"silver","title":"Charity Match 70","desc":"You are invited to play in a charity match.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":-5},{"k":"sta","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":-1},{"k":"tac","d":3}]}]},
    {"id":"gen-gk-71","min":16,"max":39,"pos":"gk","rarity":"bronze","title":"Media Interview 71","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"kic","d":-3},{"k":"dri","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pos","d":-4},{"k":"sta","d":-1}]}]},
    {"id":"gen-mid-72","min":16,"max":39,"pos":"mid","rarity":"silver","title":"Dietary Change 72","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sho","d":4},{"k":"sta","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":-4},{"k":"def","d":-3}]}]},
    {"id":"gen-any-73","min":16,"max":39,"pos":"any","rarity":"bronze","title":"Sponsorship Offer 73","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"ref","d":-1},{"k":"phy","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pas","d":-2},{"k":"kic","d":4}]}]},
    {"id":"gen-mid-74","min":16,"max":39,"pos":"mid","rarity":"diamond","title":"Sponsorship Offer 74","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"mor","d":1},{"k":"tac","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":3},{"k":"def","d":-4}]}]},
    {"id":"gen-mid-75","min":16,"max":39,"pos":"mid","rarity":"gold","title":"Dietary Change 75","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":-2},{"k":"pos","d":1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":5},{"k":"dri","d":5}]}]},
    {"id":"gen-gk-76","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Sponsorship Offer 76","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":5},{"k":"loyalty","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"def","d":3},{"k":"kic","d":2}]}]},
    {"id":"gen-att-77","min":16,"max":39,"pos":"att","rarity":"bronze","title":"New Cleats 77","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":2},{"k":"pas","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":-3},{"k":"kic","d":3}]}]},
    {"id":"gen-gk-78","min":16,"max":39,"pos":"gk","rarity":"silver","title":"Dietary Change 78","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"tac","d":5},{"k":"pos","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"mor","d":0},{"k":"loyalty","d":1}]}]},
    {"id":"gen-any-79","min":16,"max":39,"pos":"any","rarity":"bronze","title":"Fan Meeting 79","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"kic","d":-5},{"k":"dri","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":5},{"k":"pos","d":-1}]}]},
    {"id":"gen-gk-80","min":16,"max":39,"pos":"gk","rarity":"bronze","title":"Tactical Disagreement 80","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"mor","d":2},{"k":"dri","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pos","d":5},{"k":"pac","d":4}]}]},
    {"id":"gen-gk-81","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Media Interview 81","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":-5},{"k":"pas","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pos","d":2},{"k":"sta","d":3}]}]},
    {"id":"gen-att-82","min":16,"max":39,"pos":"att","rarity":"bronze","title":"Night Out 82","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":-5},{"k":"pas","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"ref","d":5},{"k":"sta","d":2}]}]},
    {"id":"gen-mid-83","min":16,"max":39,"pos":"mid","rarity":"gold","title":"Late to Training 83","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pas","d":-4},{"k":"ref","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sta","d":-2},{"k":"def","d":-4}]}]},
    {"id":"gen-att-84","min":16,"max":39,"pos":"att","rarity":"gold","title":"New Cleats 84","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":5},{"k":"pac","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":-2},{"k":"pos","d":-1}]}]},
    {"id":"gen-gk-85","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Rival Taunt 85","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":2},{"k":"sho","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":3},{"k":"sta","d":-2}]}]},
    {"id":"gen-gk-86","min":16,"max":39,"pos":"gk","rarity":"diamond","title":"Late to Training 86","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"kic","d":4},{"k":"tac","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":-1},{"k":"rep","d":1}]}]},
    {"id":"gen-att-87","min":16,"max":39,"pos":"att","rarity":"silver","title":"Media Interview 87","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"def","d":3},{"k":"rep","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":-2},{"k":"sho","d":-5}]}]},
    {"id":"gen-any-88","min":16,"max":39,"pos":"any","rarity":"diamond","title":"Tactical Disagreement 88","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"ref","d":5},{"k":"sta","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":-3},{"k":"phy","d":-1}]}]},
    {"id":"gen-any-89","min":16,"max":39,"pos":"any","rarity":"silver","title":"Fan Meeting 89","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":-4},{"k":"loyalty","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":-1},{"k":"dri","d":2}]}]},
    {"id":"gen-att-90","min":16,"max":39,"pos":"att","rarity":"gold","title":"Late to Training 90","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"ref","d":3},{"k":"dri","d":1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":5},{"k":"kic","d":-3}]}]},
    {"id":"gen-gk-91","min":16,"max":39,"pos":"gk","rarity":"silver","title":"Late to Training 91","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"tac","d":-4},{"k":"loyalty","d":0}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":4},{"k":"tac","d":0}]}]},
    {"id":"gen-mid-92","min":16,"max":39,"pos":"mid","rarity":"gold","title":"Night Out 92","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pas","d":5},{"k":"sta","d":5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":3},{"k":"tac","d":-1}]}]},
    {"id":"gen-def-93","min":16,"max":39,"pos":"def","rarity":"diamond","title":"Media Interview 93","desc":"A controversial journalist wants an exclusive interview.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":4},{"k":"loyalty","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":-1},{"k":"pac","d":0}]}]},
    {"id":"gen-gk-94","min":16,"max":39,"pos":"gk","rarity":"bronze","title":"Sponsorship Offer 94","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"kic","d":2},{"k":"pac","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"def","d":5},{"k":"rep","d":0}]}]},
    {"id":"gen-gk-95","min":16,"max":39,"pos":"gk","rarity":"bronze","title":"New Cleats 95","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":5},{"k":"loyalty","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"mor","d":-4},{"k":"loyalty","d":0}]}]},
    {"id":"gen-att-96","min":16,"max":39,"pos":"att","rarity":"diamond","title":"Late to Training 96","desc":"You slept in and are late for training.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pos","d":-1},{"k":"dri","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":-5},{"k":"pas","d":-3}]}]},
    {"id":"gen-def-97","min":16,"max":39,"pos":"def","rarity":"bronze","title":"Fan Meeting 97","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"loyalty","d":2},{"k":"mor","d":2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":-1},{"k":"loyalty","d":-3}]}]},
    {"id":"gen-att-98","min":16,"max":39,"pos":"att","rarity":"diamond","title":"Rival Taunt 98","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"mor","d":-3},{"k":"ref","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"dri","d":-2},{"k":"loyalty","d":-4}]}]},
    {"id":"gen-att-99","min":16,"max":39,"pos":"att","rarity":"bronze","title":"Night Out 99","desc":"Teammates invite you to a late night out before a game.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"kic","d":5},{"k":"sho","d":1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"dri","d":-5},{"k":"pas","d":4}]}]},
    {"id":"gen-gk-100","min":16,"max":39,"pos":"gk","rarity":"gold","title":"Charity Match 100","desc":"You are invited to play in a charity match.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pos","d":-4},{"k":"sho","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"loyalty","d":-2},{"k":"tac","d":-2}]}]},
    {"id":"gen-att-101","min":16,"max":39,"pos":"att","rarity":"gold","title":"Dietary Change 101","desc":"The club nutritionist wants you on a strict diet.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"tac","d":-4},{"k":"def","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":4},{"k":"pac","d":4}]}]},
    {"id":"gen-mid-102","min":16,"max":39,"pos":"mid","rarity":"diamond","title":"Tactical Disagreement 102","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":0},{"k":"def","d":-5}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"sho","d":2},{"k":"def","d":-5}]}]},
    {"id":"gen-def-103","min":16,"max":39,"pos":"def","rarity":"gold","title":"New Cleats 103","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pos","d":-4},{"k":"rep","d":-4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"tac","d":-2},{"k":"pas","d":-1}]}]},
    {"id":"gen-mid-104","min":16,"max":39,"pos":"mid","rarity":"bronze","title":"Rival Taunt 104","desc":"An opposing player trash-talked you in the press.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pac","d":-1},{"k":"sta","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"dri","d":-4},{"k":"pos","d":-1}]}]},
    {"id":"gen-gk-105","min":16,"max":39,"pos":"gk","rarity":"silver","title":"Sponsorship Offer 105","desc":"A local brand wants to sponsor you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"phy","d":5},{"k":"ref","d":-1}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"phy","d":-4},{"k":"sho","d":-1}]}]},
    {"id":"gen-def-106","min":16,"max":39,"pos":"def","rarity":"gold","title":"Fan Meeting 106","desc":"A local fan club requested a meeting with you.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pas","d":5},{"k":"pos","d":-3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"def","d":-4},{"k":"ref","d":2}]}]},
    {"id":"gen-att-107","min":16,"max":39,"pos":"att","rarity":"gold","title":"Tactical Disagreement 107","desc":"You disagree with the coach's new tactics.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"dri","d":0},{"k":"pos","d":-2}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"kic","d":3},{"k":"mor","d":-1}]}]},
    {"id":"gen-att-108","min":16,"max":39,"pos":"att","rarity":"bronze","title":"New Cleats 108","desc":"A sponsor sent you experimental new cleats.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"pos","d":-3},{"k":"sta","d":3}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"pac","d":-4},{"k":"mor","d":-4}]}]},
    {"id":"gen-def-109","min":16,"max":39,"pos":"def","rarity":"diamond","title":"Charity Match 109","desc":"You are invited to play in a charity match.","options":[{"id":"a","text":"Option A (Generated)","changes":[{"k":"sta","d":-3},{"k":"tac","d":4}]},{"id":"b","text":"Option B (Generated)","changes":[{"k":"rep","d":3},{"k":"sta","d":2}]}]}
  ];

  if (root.DATA) {
    if (!root.DATA.DECISIONS) root.DATA.DECISIONS = [];
    root.DATA.DECISIONS = root.DATA.DECISIONS.concat(POS_DECISIONS);
  } else {
    console.error("DATA not found. Make sure data.js is loaded before data-decisions.js");
  }

})(typeof window !== 'undefined' ? window : globalThis);
