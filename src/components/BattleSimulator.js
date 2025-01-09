'use client';
import { useState } from 'react';
import { units } from '@/lib/units';

const rollD6 = (count = 1) => {
  let results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.floor(Math.random() * 6) + 1);
  }
  return results;
};

export default function BattleSimulator() {
  const [leftUnit, setLeftUnit] = useState('Space Marines');
  const [rightUnit, setRightUnit] = useState('Ork Boys');
  const [leftCount, setLeftCount] = useState(5);
  const [rightCount, setRightCount] = useState(10);
  const [distance, setDistance] = useState(18);
  const [results, setResults] = useState(null);
  const [battleLog, setBattleLog] = useState([]);

  const addToLog = (message) => {
    setBattleLog(prev => [...prev, message]);
  };

  const simulateMeleePhase = (attackers, attackingUnit, defendingUnit, unitName) => {
    const weapon = Object.entries(attackingUnit.weapons)
      .filter(([_, w]) => w.range === 0)
      .sort(([_, a], [__, b]) => b.strength - a.strength)[0];
    
    const [weaponName, weaponStats] = weapon;
    const totalAttacks = attackers * (attackingUnit.attacks + weaponStats.shots);
    
    const hitRolls = rollD6(totalAttacks);
    const hits = hitRolls.filter(roll => roll >= attackingUnit.weaponSkill);
    
    const woundRolls = rollD6(hits.length);
    const wounds = woundRolls.filter(roll => 
      roll >= (weaponStats.strength >= defendingUnit.toughness ? 3 : 5)
    );
    
    const saveRolls = rollD6(wounds.length);
    const failedSaves = saveRolls.filter(roll => {
      // A roll of 1 always fails
      if (roll === 1) return true;
      // Apply AP modifier to save characteristic
      const modifiedSave = defendingUnit.save - weaponStats.ap;
      // Check if save is successful (needs to equal or exceed modified save value)
      return roll < modifiedSave;
    });

    const rolls = `${weaponName}:
    Attacks (${totalAttacks}): ${hitRolls.join(', ')}
    Hits (${hits.length}): WS${attackingUnit.weaponSkill}+
    Wounds (${wounds.length}): ${weaponStats.strength >= defendingUnit.toughness ? '3' : '5'}+
    Failed Saves (${failedSaves.length}): ${defendingUnit.save}+`;

    return { 
      casualties: Math.floor(failedSaves.length / defendingUnit.wounds),
      rolls 
    };
  };

  const simulateShootingPhase = (attackers, attackingUnit, defendingUnit, distance, unitName) => {
    const weapon = Object.entries(attackingUnit.weapons)
      .filter(([_, w]) => w.range >= distance)
      .sort(([_, a], [__, b]) => b.strength - a.strength)[0];
    
    if (!weapon) return { casualties: 0, rolls: "No weapon in range" };

    const [weaponName, weaponStats] = weapon;
    const totalShots = attackers * weaponStats.shots;
    const hitRolls = rollD6(totalShots);
    // Keep track of successful hit rolls
    const successfulHitRolls = hitRolls.filter(roll => roll >= attackingUnit.ballisticSkill);
    const hits = successfulHitRolls.length;
    
    // Only roll wounds for successful hits
    const woundRolls = rollD6(hits);
    // Keep track of successful wound rolls
    const successfulWoundRolls = woundRolls.filter(roll => 
      roll >= (weaponStats.strength >= defendingUnit.toughness ? 3 : 5)
    );
    const wounds = successfulWoundRolls.length;
    
    const saveRolls = rollD6(wounds.length);
    const failedSaves = saveRolls.filter(roll => 
      roll + weaponStats.ap < defendingUnit.save
    );

    const rolls = `${weaponName}:
    Shots (${totalShots}): ${hitRolls.join(', ')}
    Successful Hits (${hits}): BS${attackingUnit.ballisticSkill}+ needed
    Wound Rolls: ${woundRolls.join(', ')}
    Successful Wounds (${wounds}): ${weaponStats.strength >= defendingUnit.toughness ? '3' : '5'}+ needed
    Save Rolls: ${saveRolls.join(', ')}
    Failed Saves (${failedSaves.length}): ${defendingUnit.save}+ needed`;

    return { 
      casualties: Math.floor(failedSaves.length / defendingUnit.wounds),
      rolls 
    };
  };

  const simulateBattle = () => {
    setBattleLog([]); // Clear previous battle log
    const result = runCombatRound();
    setResults({
      winner: result > 0 ? leftUnit : result < 0 ? rightUnit : 'Draw',
      leftSurvivors: result > 0 ? Math.abs(result) : 0,
      rightSurvivors: result < 0 ? Math.abs(result) : 0
    });
  };

  const runCombatRound = () => {
    let leftSurvivors = leftCount;
    let rightSurvivors = rightCount;
    let currentDistance = distance;
    let roundCount = 1;
    const leftUnitStats = units[leftUnit];
    const rightUnitStats = units[rightUnit];
    
    while (leftSurvivors > 0 && rightSurvivors > 0) {
      addToLog(`\n=== Round ${roundCount} ===`);

      // Left player's full turn
      addToLog(`\n=== ${leftUnit}'s Turn ===`);
      
      // Command phase
      addToLog('\n- Command Phase -');
      // Currently no command abilities implemented
      
      // Movement phase
      addToLog('\n- Movement Phase -');
      const leftMove = leftUnitStats.movement;
      currentDistance = Math.max(0, currentDistance - leftMove);
      addToLog(`Unit moves ${leftMove}" closer`);
      addToLog(`New distance: ${currentDistance}"`);

      // Shooting phase
      addToLog('\n- Shooting Phase -');
      if (currentDistance <= Math.max(...Object.values(leftUnitStats.weapons).map(w => w.range))) {
        const { casualties, rolls } = simulateShootingPhase(leftSurvivors, leftUnitStats, rightUnitStats, currentDistance, leftUnit);
        addToLog(`${leftUnit} shooting:\n${rolls}`);
        rightSurvivors -= casualties;
        addToLog(`${rightUnit} casualties: ${casualties}`);
      } else {
        addToLog('Out of range');
      }

      // Charge phase
      addToLog('\n- Charge Phase -');
      if (currentDistance <= 12) {
        const leftChargeRoll = rollD6(2);
        const leftChargeDistance = leftChargeRoll.reduce((a, b) => a + b, 0);
        addToLog(`Charge roll: ${leftChargeRoll.join(', ')} = ${leftChargeDistance}"`);
        
        if (leftChargeDistance >= currentDistance) {
          currentDistance = 0;
          addToLog('Charge successful!');
        } else {
          addToLog('Charge failed');
        }
      } else {
        addToLog('Too far to attempt charge');
      }

      // Fight phase
      addToLog('\n- Fight Phase -');
      if (currentDistance === 0) {
        const leftCombatResult = simulateMeleePhase(leftSurvivors, leftUnitStats, rightUnitStats, leftUnit);
        addToLog(`${leftUnit} melee attacks:\n${leftCombatResult.rolls}`);
        rightSurvivors -= leftCombatResult.casualties;
        addToLog(`${rightUnit} casualties: ${leftCombatResult.casualties}`);
      } else {
        addToLog('No units in combat range');
      }

      addToLog(`\nAfter ${leftUnit}'s turn:`);
      addToLog(`${leftUnit} remaining: ${Math.max(0, leftSurvivors)}`);
      addToLog(`${rightUnit} remaining: ${Math.max(0, rightSurvivors)}`);

      // Check if right unit is wiped out
      if (rightSurvivors <= 0) {
        continue;
      }

      // Right player's full turn
      addToLog(`\n=== ${rightUnit}'s Turn ===`);
      
      // Command phase
      addToLog('\n- Command Phase -');
      // Currently no command abilities implemented
      
      // Movement phase
      addToLog('\n- Movement Phase -');
      const rightMove = rightUnitStats.movement;
      currentDistance = Math.max(0, currentDistance - rightMove);
      addToLog(`Unit moves ${rightMove}" closer`);
      addToLog(`New distance: ${currentDistance}"`);

      // Shooting phase
      addToLog('\n- Shooting Phase -');
      if (currentDistance <= Math.max(...Object.values(rightUnitStats.weapons).map(w => w.range))) {
        const { casualties, rolls } = simulateShootingPhase(rightSurvivors, rightUnitStats, leftUnitStats, currentDistance, rightUnit);
        addToLog(`${rightUnit} shooting:\n${rolls}`);
        leftSurvivors -= casualties;
        addToLog(`${leftUnit} casualties: ${casualties}`);
      } else {
        addToLog('Out of range');
      }

      // Charge phase
      addToLog('\n- Charge Phase -');
      if (currentDistance <= 12) {
        const rightChargeRoll = rollD6(2);
        const rightChargeDistance = rightChargeRoll.reduce((a, b) => a + b, 0);
        addToLog(`Charge roll: ${rightChargeRoll.join(', ')} = ${rightChargeDistance}"`);
        
        if (rightChargeDistance >= currentDistance) {
          currentDistance = 0;
          addToLog('Charge successful!');
        } else {
          addToLog('Charge failed');
        }
      } else {
        addToLog('Too far to attempt charge');
      }

      // Fight phase
      addToLog('\n- Fight Phase -');
      if (currentDistance === 0) {
        const rightCombatResult = simulateMeleePhase(rightSurvivors, rightUnitStats, leftUnitStats, rightUnit);
        addToLog(`${rightUnit} melee attacks:\n${rightCombatResult.rolls}`);
        leftSurvivors -= rightCombatResult.casualties;
        addToLog(`${leftUnit} casualties: ${rightCombatResult.casualties}`);
      } else {
        addToLog('No units in combat range');
      }

      addToLog(`\n=== End of Round ${roundCount} ===`);
      addToLog(`${leftUnit} remaining: ${Math.max(0, leftSurvivors)}`);
      addToLog(`${rightUnit} remaining: ${Math.max(0, rightSurvivors)}`);
      
      roundCount++;
      if (roundCount > 10) {
        addToLog("\nBattle ended in stalemate after 10 rounds");
        return 0;
      }
    }
    
    addToLog(`\n=== Final Battle Results ===`);
    addToLog(`${leftUnit} remaining: ${Math.max(0, leftSurvivors)}`);
    addToLog(`${rightUnit} remaining: ${Math.max(0, rightSurvivors)}`);
    
    return leftSurvivors > rightSurvivors ? leftSurvivors : rightSurvivors > leftSurvivors ? -rightSurvivors : 0;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between space-x-4">
        {/* Left Unit Card */}
        <div className={`w-1/2 p-4 rounded-lg bg-white shadow-md ${
          results?.winner === leftUnit ? 'border-2 border-green-500' : 
          results?.winner === rightUnit ? 'border-2 border-red-500' : 
          'border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-4">Left Side</h2>
          <div className="space-y-4">
            <select 
              value={leftUnit}
              onChange={(e) => setLeftUnit(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {Object.keys(units).map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <select
              value={leftCount}
              onChange={(e) => setLeftCount(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              {[5, 10, 15, 20].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Unit Card */}
        <div className={`w-1/2 p-4 rounded-lg bg-white shadow-md ${
          results?.winner === rightUnit ? 'border-2 border-green-500' : 
          results?.winner === leftUnit ? 'border-2 border-red-500' : 
          'border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-4">Right Side</h2>
          <div className="space-y-4">
            <select
              value={rightUnit}
              onChange={(e) => setRightUnit(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {Object.keys(units).map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <select
              value={rightCount}
              onChange={(e) => setRightCount(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              {[5, 10, 15, 20].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Distance Slider */}
      <div className="p-4 rounded-lg bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-4">Starting Distance ({distance}")</h2>
        <input 
          type="range"
          min="0"
          max="48"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Fight Button */}
      <button 
        onClick={simulateBattle}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Fight!
      </button>

      {/* Battle Log */}
      {results && (
        <div className="p-4 rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-4">Battle Results</h2>
          <div className="h-96 overflow-y-auto border rounded-md p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {battleLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}