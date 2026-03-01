// Strokes Gained Tracker JavaScript
let currentRound = {
    course: '',
    date: '',
    courseRating: '',
    handicapIndex: 0,
    teeBox: '',
    holes: []
};

let allRounds = JSON.parse(localStorage.getItem('strokesGainedRounds')) || [];
let currentHoleIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('roundDate').valueAsDate = new Date();
    loadSavedRound();
});

// Round Management
function newRound() {
    if (confirm('Starting a new round will clear any unsaved data. Continue?')) {
        currentRound = {
            course: document.getElementById('courseName').value,
            date: document.getElementById('roundDate').value,
            courseRating: document.getElementById('courseRating').value,
            handicapIndex: parseFloat(document.getElementById('handicapIndex').value) || 0,
            teeBox: document.getElementById('teeBox').value,
            holes: []
        };
        saveCurrentRound();
        updateHolesList();
        alert('New round started! Begin recording hole 1.');
    }
}

function saveHole() {
    const hole = {
        number: parseInt(document.getElementById('holeNumber').value),
        par: parseInt(document.getElementById('holePar').value),
        yardage: parseInt(document.getElementById('holeYardage').value),
        score: parseInt(document.getElementById('holeScore').value),
        drivingDistance: parseInt(document.getElementById('drivingDistance').value) || 0,
        fairwayHit: document.getElementById('fairwayHit').value,
        proximity: parseFloat(document.getElementById('proximity').value) || 0,
        gir: document.getElementById('gir').value,
        startingPosition: document.getElementById('startingPosition').value,
        upAndDown: document.getElementById('upAndDown').value,
        firstPuttDistance: parseFloat(document.getElementById('firstPuttDistance').value) || 0,
        totalPutts: parseInt(document.getElementById('totalPutts').value) || 0
    };

    // Validate required fields
    if (!hole.score || !hole.yardage) {
        alert('Please enter at least score and yardage.');
        return;
    }

    // Calculate strokes gained for this hole
    hole.strokesGained = calculateStrokesGained(hole);

    // Check if hole already exists and update
    const existingIndex = currentRound.holes.findIndex(h => h.number === hole.number);
    if (existingIndex >= 0) {
        currentRound.holes[existingIndex] = hole;
    } else {
        currentRound.holes.push(hole);
    }

    // Sort holes by number
    currentRound.holes.sort((a, b) => a.number - b.number);

    saveCurrentRound();
    updateHolesList();
    clearHole();
    
    alert(`Hole ${hole.number} saved successfully! Strokes Gained: ${hole.strokesGained.total.toFixed(2)}`);
}

function calculateStrokesGained(hole) {
    const strokesGained = {
        total: 0,
        offTee: 0,
        approach: 0,
        aroundGreen: 0,
        putting: 0
    };

    // Strokes Gained Total (vs scratch)
    strokesGained.total = hole.par - hole.score;

    // Strokes Gained Off the Tee
    if (hole.par > 3) { // Only for par 4s and 5s
        const avgDrivingDistance = getAverageDrivingDistance(hole.par);
        const distanceGain = (hole.drivingDistance - avgDrivingDistance) / 10; // 0.1 strokes per 10 yards
        strokesGained.offTee = hole.fairwayHit === 'hit' ? 0.25 : (hole.fairwayHit === 'na' ? 0 : -0.25);
        strokesGained.offTee += distanceGain;
    }

    // Strokes Gained Approach
    if (hole.proximity > 0) {
        const avgProximity = getAverageProximity(hole.yardage);
        const proximityGain = (avgProximity - hole.proximity) / 10; // 0.1 strokes per 10 feet
        strokesGained.approach = hole.gir === 'yes' ? 0.25 : -0.25;
        strokesGained.approach += proximityGain;
    }

    // Strokes Gained Around the Green
    if (hole.startingPosition && hole.startingPosition !== 'na') {
        const baseAroundGreen = getBaseAroundGreen(hole.startingPosition);
        strokesGained.aroundGreen = baseAroundGreen;
        if (hole.upAndDown === 'yes') {
            strokesGained.aroundGreen += 0.25;
        } else if (hole.upAndDown === 'no') {
            strokesGained.aroundGreen -= 0.25;
        }
    }

    // Strokes Gained Putting
    if (hole.totalPutts > 0) {
        const avgPutts = getAveragePutts(hole.firstPuttDistance);
        strokesGained.putting = avgPutts - hole.totalPutts;
    }

    return strokesGained;
}

// Benchmark averages (simplified for demo)
function getAverageDrivingDistance(par) {
    return par === 4 ? 280 : par === 5 ? 320 : 0;
}

function getAverageProximity(yardage) {
    if (yardage < 150) return 18;
    if (yardage < 200) return 25;
    if (yardage < 250) return 35;
    return 45;
}

function getBaseAroundGreen(position) {
    const bases = {
        'fairway': 0.1,
        'rough': -0.1,
        'sand': -0.2,
        'recovery': -0.3
    };
    return bases[position] || 0;
}

function getAveragePutts(distance) {
    if (distance < 10) return 1.2;
    if (distance < 20) return 1.8;
    if (distance < 30) return 2.1;
    if (distance < 40) return 2.3;
    return 2.5;
}

function nextHole() {
    const currentHole = parseInt(document.getElementById('holeNumber').value);
    if (currentHole < 18) {
        document.getElementById('holeNumber').value = currentHole + 1;
        document.getElementById('currentHoleNum').textContent = currentHole + 1;
        clearHole();
    } else {
        alert('You\'ve completed all 18 holes!');
    }
}

function clearHole() {
    document.getElementById('holeScore').value = '';
    document.getElementById('drivingDistance').value = '';
    document.getElementById('fairwayHit').value = '';
    document.getElementById('proximity').value = '';
    document.getElementById('gir').value = '';
    document.getElementById('startingPosition').value = '';
    document.getElementById('upAndDown').value = '';
    document.getElementById('firstPuttDistance').value = '';
    document.getElementById('totalPutts').value = '';
}

function updateHolesList() {
    const holesList = document.getElementById('holesList');
    holesList.innerHTML = '';

    if (currentRound.holes.length === 0) {
        holesList.innerHTML = '<p class="text-gray-500">No holes recorded yet.</p>';
        document.getElementById('roundTotals').innerHTML = '';
        return;
    }

    let totalScore = 0;
    let totalPar = 0;
    let totalStrokesGained = 0;
    let sgOffTee = 0;
    let sgApproach = 0;
    let sgAroundGreen = 0;
    let sgPutting = 0;

    currentRound.holes.forEach(hole => {
        totalScore += hole.score;
        totalPar += hole.par;
        totalStrokesGained += hole.strokesGained.total;
        sgOffTee += hole.strokesGained.offTee;
        sgApproach += hole.strokesGained.approach;
        sgAroundGreen += hole.strokesGained.aroundGreen;
        sgPutting += hole.strokesGained.putting;

        const holeDiv = document.createElement('div');
        holeDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        
        const sgClass = hole.strokesGained.total > 0 ? 'strokes-gained-positive' : 
                       hole.strokesGained.total < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral';
        
        holeDiv.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="bg-green-600 text-white px-3 py-1 rounded-full font-bold">${hole.number}</div>
                <div>
                    <span class="font-semibold">Par ${hole.par}</span>
                    <span class="text-gray-500 ml-2">${hole.yardage}yds</span>
                </div>
            </div>
            <div class="flex items-center space-x-6">
                <span class="font-bold">Score: ${hole.score}</span>
                <span class="${sgClass}">SG: ${hole.strokesGained.total.toFixed(2)}</span>
                <button onclick="editHole(${hole.number})" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteHole(${hole.number})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        holesList.appendChild(holeDiv);
    });

    // Update totals
    const netScore = totalScore - totalPar;
    document.getElementById('roundTotals').innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="stat-card bg-gray-50 p-3 rounded">
                <div class="text-2xl font-bold ${netScore > 0 ? 'strokes-gained-negative' : netScore < 0 ? 'strokes-gained-positive' : 'strokes-gained-neutral'}">${totalScore}</div>
                <div class="text-sm text-gray-600">Total Score</div>
                <div class="text-xs ${netScore > 0 ? 'strokes-gained-negative' : netScore < 0 ? 'strokes-gained-positive' : 'strokes-gained-neutral'}">${netScore > 0 ? '+' : ''}${netScore}</div>
            </div>
            <div class="stat-card bg-gray-50 p-3 rounded">
                <div class="text-2xl font-bold ${totalStrokesGained > 0 ? 'strokes-gained-positive' : totalStrokesGained < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${totalStrokesGained.toFixed(2)}</div>
                <div class="text-sm text-gray-600">Total SG</div>
                <div class="text-xs ${totalStrokesGained > 0 ? 'strokes-gained-positive' : totalStrokesGained < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">vs Scratch</div>
            </div>
            <div class="stat-card bg-gray-50 p-3 rounded">
                <div class="text-2xl font-bold ${sgOffTee > 0 ? 'strokes-gained-positive' : sgOffTee < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${sgOffTee.toFixed(2)}</div>
                <div class="text-sm text-gray-600">SG Off Tee</div>
            </div>
            <div class="stat-card bg-gray-50 p-3 rounded">
                <div class="text-2xl font-bold ${sgApproach > 0 ? 'strokes-gained-positive' : sgApproach < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${sgApproach.toFixed(2)}</div>
                <div class="text-sm text-gray-600">SG Approach</div>
            </div>
            <div class="stat-card bg-gray-50 p-3 rounded">
                <div class="text-2xl font-bold ${sgAroundGreen > 0 ? 'strokes-gained-positive' : sgAroundGreen < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${sgAroundGreen.toFixed(2)}</div>
                <div class="text-sm text-gray-600">SG Around</div>
            </div>
            <div class="stat-card bg-gray-50 p-3 rounded">
                <div class="text-2xl font-bold ${sgPutting > 0 ? 'strokes-gained-positive' : sgPutting < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${sgPutting.toFixed(2)}</div>
                <div class="text-sm text-gray-600">SG Putting</div>
            </div>
        </div>
        <div class="mt-4 flex space-x-4">
            <button onclick="finishRound()" class="positive-bg text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                <i class="fas fa-check mr-2"></i>Finish Round
            </button>
            <button onclick="exportRound()" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                <i class="fas fa-download mr-2"></i>Export Round
            </button>
        </div>
    `;
}

function editHole(holeNumber) {
    const hole = currentRound.holes.find(h => h.number === holeNumber);
    if (hole) {
        document.getElementById('holeNumber').value = hole.number;
        document.getElementById('holePar').value = hole.par;
        document.getElementById('holeYardage').value = hole.yardage;
        document.getElementById('holeScore').value = hole.score;
        document.getElementById('drivingDistance').value = hole.drivingDistance;
        document.getElementById('fairwayHit').value = hole.fairwayHit;
        document.getElementById('proximity').value = hole.proximity;
        document.getElementById('gir').value = hole.gir;
        document.getElementById('startingPosition').value = hole.startingPosition;
        document.getElementById('upAndDown').value = hole.upAndDown;
        document.getElementById('firstPuttDistance').value = hole.firstPuttDistance;
        document.getElementById('totalPutts').value = hole.totalPutts;
        document.getElementById('currentHoleNum').textContent = hole.number;
    }
}

function deleteHole(holeNumber) {
    if (confirm(`Delete hole ${holeNumber}?`)) {
        currentRound.holes = currentRound.holes.filter(h => h.number !== holeNumber);
        saveCurrentRound();
        updateHolesList();
    }
}

function finishRound() {
    if (currentRound.holes.length === 0) {
        alert('No holes recorded yet!');
        return;
    }

    if (confirm(`Finish round with ${currentRound.holes.length} holes? This will save your data and prepare for a new round.`)) {
        // Export data automatically
        exportData();
        
        // Clear for new round
        if (confirm('Round exported! Start a new round?')) {
            allRounds.push({...currentRound, completed: new Date().toISOString()});
            localStorage.setItem('strokesGainedRounds', JSON.stringify(allRounds));
            
            currentRound = { course: '', date: '', courseRating: '', handicapIndex: 0, teeBox: '', holes: [] };
            localStorage.removeItem('currentStrokesGainedRound');
            
            document.getElementById('courseName').value = '';
            document.getElementById('roundDate').valueAsDate = new Date();
            document.getElementById('courseRating').value = '';
            document.getElementById('handicapIndex').value = '';
            document.getElementById('teeBox').value = '';
            
            updateHolesList();
            alert('New round ready! Good luck!');
        }
    }
}

function exportRound() {
    if (currentRound.holes.length === 0) {
        alert('No data to export');
        return;
    }

    let csv = 'Course,Date,Hole,Par,Yardage,Score,SG Total,SG Off Tee,SG Approach,SG Around Green,SG Putting,Driving Distance,Fairway Hit,Proximity,GIR,Starting Position,Up and Down,First Putt Distance,Total Putts\n';
    
    currentRound.holes.forEach(hole => {
        csv += `"${currentRound.course}","${currentRound.date}",${hole.number},${hole.par},${hole.yardage},${hole.score},${hole.strokesGained.total.toFixed(2)},${hole.strokesGained.offTee.toFixed(2)},${hole.strokesGained.approach.toFixed(2)},${hole.strokesGained.aroundGreen.toFixed(2)},${hole.strokesGained.putting.toFixed(2)},${hole.drivingDistance},"${hole.fairwayHit}",${hole.proximity},"${hole.gir}","${hole.startingPosition}","${hole.upAndDown}",${hole.firstPuttDistance},${hole.totalPutts}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strokes-gained-${currentRound.date || 'today'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function viewStats() {
    const statsSection = document.getElementById('statsDashboard');
    const statsContent = document.getElementById('statsContent');
    
    if (allRounds.length === 0) {
        statsContent.innerHTML = '<p class="text-gray-500">No completed rounds found.</p>';
    } else {
        // Calculate statistics
        let totalRounds = allRounds.length;
        let totalHoles = 0;
        let totalScore = 0;
        let totalPar = 0;
        let totalStrokesGained = 0;
        let sgOffTee = 0;
        let sgApproach = 0;
        let sgAroundGreen = 0;
        let sgPutting = 0;

        allRounds.forEach(round => {
            round.holes.forEach(hole => {
                totalHoles++;
                totalScore += hole.score;
                totalPar += hole.par;
                totalStrokesGained += hole.strokesGained.total;
                sgOffTee += hole.strokesGained.offTee;
                sgApproach += hole.strokesGained.approach;
                sgAroundGreen += hole.strokesGained.aroundGreen;
                sgPutting += hole.strokesGained.putting;
            });
        });

        const avgScore = (totalScore / totalRounds).toFixed(1);
        const avgSG = (totalStrokesGained / totalRounds).toFixed(2);
        const avgSGOffTee = (sgOffTee / totalRounds).toFixed(2);
        const avgSGApproach = (sgApproach / totalRounds).toFixed(2);
        const avgSGAroundGreen = (sgAroundGreen / totalRounds).toFixed(2);
        const avgSGPutting = (sgPutting / totalRounds).toFixed(2);

        statsContent.innerHTML = `
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                    <div class="text-3xl font-bold text-green-600">${totalRounds}</div>
                    <div class="text-gray-600">Total Rounds</div>
                </div>
                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                    <div class="text-3xl font-bold text-blue-600">${avgScore}</div>
                    <div class="text-gray-600">Average Score</div>
                </div>
                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                    <div class="text-3xl font-bold ${avgSG > 0 ? 'strokes-gained-positive' : avgSG < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${avgSG}</div>
                    <div class="text-gray-600">Average SG Total</div>
                </div>
                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                    <div class="text-3xl font-bold ${avgSGOffTee > 0 ? 'strokes-gained-positive' : avgSGOffTee < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${avgSGOffTee}</div>
                    <div class="text-gray-600">Average SG Off Tee</div>
                </div>
                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                    <div class="text-3xl font-bold ${avgSGApproach > 0 ? 'strokes-gained-positive' : avgSGApproach < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${avgSGApproach}</div>
                    <div class="text-gray-600">Average SG Approach</div>
                </div>
                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                    <div class="text-3xl font-bold ${avgSGAroundGreen > 0 ? 'strokes-gained-positive' : avgSGAroundGreen < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${avgSGAroundGreen}</div>
                    <div class="text-gray-600">Average SG Around</div>
                </div>
                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                    <div class="text-3xl font-bold ${avgSGPutting > 0 ? 'strokes-gained-positive' : avgSGPutting < 0 ? 'strokes-gained-negative' : 'strokes-gained-neutral'}">${avgSGPutting}</div>
                    <div class="text-gray-600">Average SG Putting</div>
                </div>
                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                    <div class="text-3xl font-bold text-purple-600">${totalHoles}</div>
                    <div class="text-gray-600">Total Holes Played</div>
                </div>
            </div>
            <div class="mt-6">
                <button onclick="exportAllStats()" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    <i class="fas fa-download mr-2"></i>Export All Statistics
                </button>
            </div>
        `;
    }
    
    statsSection.classList.toggle('hidden');
}

function exportAllStats() {
    let csv = 'Course,Date,Round Score,Holes Played,Average Score,SG Total,SG Off Tee,SG Approach,SG Around Green,SG Putting\n';
    
    allRounds.forEach(round => {
        let totalScore = 0;
        let totalPar = 0;
        let totalStrokesGained = 0;
        let sgOffTee = 0;
        let sgApproach = 0;
        let sgAroundGreen = 0;
        let sgPutting = 0;

        round.holes.forEach(hole => {
            totalScore += hole.score;
            totalPar += hole.par;
            totalStrokesGained += hole.strokesGained.total;
            sgOffTee += hole.strokesGained.offTee;
            sgApproach += hole.strokesGained.approach;
            sgAroundGreen += hole.strokesGained.aroundGreen;
            sgPutting += hole.strokesGained.putting;
        });

        const avgScore = (totalScore / round.holes.length).toFixed(1);
        const avgSG = (totalStrokesGained / round.holes.length).toFixed(2);
        const avgSGOffTee = (sgOffTee / round.holes.length).toFixed(2);
        const avgSGApproach = (sgApproach / round.holes.length).toFixed(2);
        const avgSGAroundGreen = (sgAroundGreen / round.holes.length).toFixed(2);
        const avgSGPutting = (sgPutting / round.holes.length).toFixed(2);

        csv += `"${round.course}","${round.date}",${totalScore},${round.holes.length},${avgScore},${avgSG},${avgSGOffTee},${avgSGApproach},${avgSGAroundGreen},${avgSGPutting}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strokes-gained-statistics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function saveCurrentRound() {
    localStorage.setItem('currentStrokesGainedRound', JSON.stringify(currentRound));
}

function loadSavedRound() {
    const saved = localStorage.getItem('currentStrokesGainedRound');
    if (saved) {
        currentRound = JSON.parse(saved);
        document.getElementById('courseName').value = currentRound.course || '';
        document.getElementById('roundDate').value = currentRound.date || '';
        document.getElementById('courseRating').value = currentRound.courseRating || '';
        document.getElementById('handicapIndex').value = currentRound.handicapIndex || '';
        document.getElementById('teeBox').value = currentRound.teeBox || '';
        updateHolesList();
    }
}
