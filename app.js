'use strict';

// ══════════════════════════════════════
// SUPABASE INIT
// ══════════════════════════════════════
const SUPABASE_URL  = 'https://lkhjiqkegffjkpbrqxyi.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxraGppcWtlZ2ZmamtwYnJxeHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODUzNDcsImV4cCI6MjA5NDk2MTM0N30.MHa4vESfMGfTj190UZoc1SGEZUlRyDPp7Y3VAx8hKfQ';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ══════════════════════════════════════
// GLOBAL STATE
// ══════════════════════════════════════
let G = {
    userId:       null, // Will be set after auth check
    routineId:    null,
    subCount:     0,
    chapCount:    0,
    topicCount:   0,
    editMode:     false,
    editData:     null,
    currentRoutine: null
};

// ══════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════
const BASE_TIME = { 1:15, 2:45, 3:75, 4:90, 5:135 };
const DIFF_MULT = { easy:0.7, medium:1.0, hard:1.4 };

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
    // Typewriter splash
    typewriter('splashSub', 'আপনার প্রস্তুতির বিশ্বস্ত সঙ্গী', 60);

    // Initialize user (create if doesn't exist)
    await initUser();

    setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        applyTheme(localStorage.getItem('atlas_theme') || 'dark');
        loadHome();
    }, 2200);

    document.getElementById('themeToggle').addEventListener('click', () => {
        const next = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('atlas_theme', next);
    });

    document.getElementById('startBigPlan').addEventListener('click', () => {
        G.editMode = false; G.editData = null;
        resetCreator();
        showPage('creatorPage');
    });

    document.getElementById('startDate').addEventListener('change', calcDays);
    document.getElementById('endDate').addEventListener('change', calcDays);
});

// ══════════════════════════════════════
// USER MANAGEMENT (No Auth - Simple UUID)
// ══════════════════════════════════════
async function initUser() {
    // Since RLS is disabled, we'll use a simple anonymous user system
    // Check if user exists in localStorage
    let storedUserId = localStorage.getItem('atlas_user_uuid');
    
    if (storedUserId) {
        // Verify it's a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(storedUserId)) {
            G.userId = storedUserId;
            return;
        }
    }
    
    // Generate a new UUID v4
    G.userId = generateUUID();
    localStorage.setItem('atlas_user_uuid', G.userId);
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function typewriter(elId, text, speed) {
    const el = document.getElementById(elId);
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) clearInterval(iv);
    }, speed);
}

function applyTheme(t) {
    document.body.className = t;
    document.getElementById('themeToggle').textContent = t === 'dark' ? '☀️' : '🌙';
}

// ══════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top:0, behavior:'smooth' });
}

function backToHome() {
    resetCreator();
    showPage('homePage');
    loadHome();
}

// ══════════════════════════════════════
// STEP NAVIGATION
// ══════════════════════════════════════
function nextStep(n) {
    if (!validateStep(n)) return;

    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${n}`).classList.add('active');

    document.querySelectorAll('.step-item').forEach(s => {
        const sn = parseInt(s.dataset.step);
        s.classList.remove('active','done');
        if (sn === n) s.classList.add('active');
        else if (sn < n) s.classList.add('done');
    });
}

function validateStep(goTo) {
    const from = [1,2,3,4,5].find(i => document.getElementById(`step${i}`).classList.contains('active')) || 1;

    if (from === 1 && goTo === 2) {
        if (!v('routineName').trim()) { alert('রুটিনের নাম দিন'); return false; }
    }
    if (from === 2 && goTo === 3) {
        const subjects = document.querySelectorAll('.subject-card');
        if (!subjects.length) { alert('অন্তত একটি সাবজেক্ট যোগ করুন'); return false; }
        for (const s of subjects) {
            if (!s.querySelector('.subj-name').value.trim()) { alert('সব সাবজেক্টের নাম দিন'); return false; }
            const chs = s.querySelectorAll('.chapter-block');
            if (!chs.length) { alert('প্রতিটি সাবজেক্টে অন্তত একটি চ্যাপ্টার যোগ করুন'); return false; }
            for (const c of chs) {
                if (!c.querySelector('.chap-name').value.trim()) { alert('সব চ্যাপ্টারের নাম দিন'); return false; }
            }
        }
    }
    if (from === 4 && goTo === 5) {
        const sd = v('startDate'), ed = v('endDate');
        if (!sd || !ed) { alert('শুরু ও শেষের তারিখ দিন'); return false; }
        if (new Date(ed) <= new Date(sd)) { alert('শেষের তারিখ শুরুর পরে হতে হবে'); return false; }
        const days = daysBetween(sd, ed);
        if (days > 730) { alert('সর্বোচ্চ ২ বছরের রুটিন তৈরি করা যাবে'); return false; }
    }
    return true;
}

function v(id) { return document.getElementById(id).value; }

// ══════════════════════════════════════
// SYLLABUS BUILDER
// ══════════════════════════════════════
function addSubject() {
    G.subCount++;
    const sid = G.subCount;
    const div = document.createElement('div');
    div.className = 'subject-card';
    div.id = `sub${sid}`;
    div.innerHTML = `
      <div class="subject-header">
        <input class="subj-name" placeholder="সাবজেক্টের নাম" type="text">
        <button class="btn-sm" onclick="rmSub(${sid})">×</button>
      </div>
      <div id="chaps${sid}"></div>
      <button class="btn-add" onclick="addChapter(${sid})">+ চ্যাপ্টার যোগ করুন</button>
    `;
    document.getElementById('subjectsContainer').appendChild(div);
}

function rmSub(sid) {
    const el = document.getElementById(`sub${sid}`);
    if (el) el.remove();
}

function addChapter(sid, data) {
    G.chapCount++;
    const cid = G.chapCount;
    const div = document.createElement('div');
    div.className = 'chapter-block';
    div.id = `chap${cid}`;
    div.innerHTML = `
      <div class="chapter-row">
        <input class="chap-name" placeholder="চ্যাপ্টারের নাম" type="text" value="${data?.name||''}">
        <select class="chap-level">
          ${[1,2,3,4,5].map(l=>`<option value="${l}" ${data?.timeLevel==l?'selected':''}>⏱ Level-0${l}: ${['<৩০ মিনিট','৩০-৬০ মিনিট','১-১.৫ ঘণ্টা','১-২ ঘণ্টা','২ ঘণ্টা+'][l-1]}</option>`).join('')}
        </select>
        <select class="chap-diff">
          <option value="easy"   ${data?.difficulty==='easy'  ?'selected':''}>🟢 Easy</option>
          <option value="medium" ${data?.difficulty==='medium'?'selected':''}>🟡 Medium</option>
          <option value="hard"   ${data?.difficulty==='hard'  ?'selected':''}>🔴 Hard</option>
        </select>
        <button class="btn-sm" onclick="rmChap(${cid})">×</button>
      </div>
      <div id="tops${cid}"></div>
      <button class="btn-add" style="margin-left:20px" onclick="addTopic(${cid})">+ টপিক যোগ করুন</button>
    `;
    document.getElementById(`chaps${sid}`).appendChild(div);
    return cid;
}

function rmChap(cid) {
    const el = document.getElementById(`chap${cid}`);
    if (el) el.remove();
}

function addTopic(cid, name) {
    G.topicCount++;
    const tid = G.topicCount;
    const div = document.createElement('div');
    div.className = 'topic-item';
    div.id = `top${tid}`;
    div.innerHTML = `
      <input class="top-name" placeholder="টপিকের নাম" type="text" value="${name||''}">
      <button class="btn-sm" onclick="rmTopic(${tid})">×</button>
    `;
    document.getElementById(`tops${cid}`).appendChild(div);
}

function rmTopic(tid) {
    const el = document.getElementById(`top${tid}`);
    if (el) el.remove();
}

// ══════════════════════════════════════
// DAY CALCULATOR
// ══════════════════════════════════════
function calcDays() {
    const sd = v('startDate'), ed = v('endDate');
    if (!sd || !ed) return;
    const total = daysBetween(sd, ed);
    if (total <= 0) { document.getElementById('dayCalc').textContent = '❌ তারিখ সঠিক নয়'; return; }
    document.getElementById('dayCalc').innerHTML = `
      📊 মোট দিন: <strong>${total}</strong>&nbsp;&nbsp;
      📚 পড়ার দিন: <strong>~${total - Math.floor(total/7)}</strong>&nbsp;&nbsp;
      🔁 রিভিশন দিন: <strong>~${Math.floor(total/7)}</strong>
    `;
}

function daysBetween(a, b) {
    return Math.ceil((new Date(b) - new Date(a)) / 86400000) + 1;
}

// ══════════════════════════════════════
// AI ROUTINE GENERATION
// ══════════════════════════════════════
async function generateRoutine() {
    if (!validateStep(99)) return;

    showLoader('রুটিন তৈরি হচ্ছে...');

    try {
        const name      = v('routineName').trim();
        const target    = v('personalTarget').trim();
        const startStr  = v('startDate');
        const endStr    = v('endDate');
        const startTime = v('startTime');
        const endTime   = v('endTime');
        const revGap    = parseInt(document.querySelector('input[name="revGap"]:checked').value);

        const startDate = new Date(startStr);
        const endDate   = new Date(endStr);
        const totalDays = daysBetween(startStr, endStr);

        const revisionDays = Math.floor((totalDays - 1) / revGap);
        const studyDays    = totalDays - revisionDays;

        // ── Collect Syllabus ──
        const subjects   = [];
        const chapGroups = [];
        let totalChaps   = 0;
        let totalTopics  = 0;

        document.querySelectorAll('.subject-card').forEach((sEl, si) => {
            const sName = sEl.querySelector('.subj-name').value.trim() || '❌';
            const subj  = { name: sName, sortOrder: si, chapters: [] };

            sEl.querySelectorAll('.chapter-block').forEach((cEl, ci) => {
                const cName  = cEl.querySelector('.chap-name').value.trim() || '❌';
                const level  = parseInt(cEl.querySelector('.chap-level').value);
                const diff   = cEl.querySelector('.chap-diff').value;

                const rawTopics = Array.from(cEl.querySelectorAll('.top-name'))
                    .map((t, ti) => ({ name: t.value.trim() || '❌', sortOrder: ti }));

                const topics = rawTopics.length ? rawTopics : [{ name: '❌', sortOrder: 0 }];

                const base = BASE_TIME[level];
                const mult = DIFF_MULT[diff];
                const timePerTopic = (base * mult) / topics.length;

                subj.chapters.push({ name: cName, timeLevel: level, difficulty: diff, sortOrder: ci, topics });

                chapGroups.push({
                    subject: sName,
                    chapter: cName,
                    difficulty: diff,
                    timeLevel: level,
                    topics: topics.map(t => ({
                        ...t,
                        effectiveTime: timePerTopic
                    }))
                });

                totalChaps++;
                totalTopics += topics.length;
            });

            subjects.push(subj);
        });

        // ── AI Distribution ──
        const schedule = distributeTopics(chapGroups, startDate, totalDays, revGap, studyDays);

        // ── Save to DB ──
        let routineId;

        if (G.editMode && G.editData) {
            // Update
            await db.from('routines').update({
                name, 
                personal_target: target,
                start_date: startStr, 
                end_date: endStr,
                start_time: startTime, 
                end_time: endTime,
                revision_gap: revGap,
                total_days: totalDays, 
                study_days: studyDays, 
                revision_days: revisionDays,
                total_chapters: totalChaps, 
                total_topics: totalTopics,
                updated_at: new Date().toISOString()
            }).eq('id', G.editData.id);

            routineId = G.editData.id;

            await saveHistory(routineId, 'edit', G.editData.total_topics, totalTopics, totalTopics, 'Edited and regenerated');

            await db.from('routine_items').delete().eq('routine_id', routineId);
            await db.from('topics').delete().eq('routine_id', routineId);
            await db.from('chapters').delete().eq('routine_id', routineId);
            await db.from('subjects').delete().eq('routine_id', routineId);

        } else {
            // Insert new
            const { data, error } = await db.from('routines').insert({
                user_id: G.userId,
                name, 
                personal_target: target,
                start_date: startStr, 
                end_date: endStr,
                start_time: startTime, 
                end_time: endTime,
                revision_gap: revGap, 
                routine_type: 'big_plan',
                total_days: totalDays, 
                study_days: studyDays, 
                revision_days: revisionDays,
                total_chapters: totalChaps, 
                total_topics: totalTopics,
                chapters_done: 0, 
                topics_done: 0, 
                is_completed: false
            }).select().single();
            
            if (error) {
                console.error('Insert error:', error);
                throw error;
            }
            routineId = data.id;
        }

        G.routineId = routineId;

        // Insert subjects → chapters → topics
        for (const subj of subjects) {
            const { data: sd } = await db.from('subjects').insert({
                routine_id: routineId, name: subj.name, sort_order: subj.sortOrder
            }).select().single();

            for (const chap of subj.chapters) {
                const { data: cd } = await db.from('chapters').insert({
                    routine_id: routineId, subject_id: sd.id,
                    name: chap.name, time_level: chap.timeLevel,
                    difficulty: chap.difficulty, is_done: false, sort_order: chap.sortOrder
                }).select().single();

                for (const t of chap.topics) {
                    await db.from('topics').insert({
                        routine_id: routineId, chapter_id: cd.id,
                        name: t.name, is_done: false, sort_order: t.sortOrder
                    });
                }
            }
        }

        // Insert routine_items
        let sortIdx = 0;
        for (const day of schedule) {
            if (day.isRevision) {
                await db.from('routine_items').insert({
                    routine_id: routineId,
                    date: fmtDateISO(day.date),
                    day_number: day.dayNum,
                    is_revision: true,
                    sort_order: sortIdx++
                });
            } else if (day.topics.length === 0) {
                await db.from('routine_items').insert({
                    routine_id: routineId,
                    date: fmtDateISO(day.date),
                    day_number: day.dayNum,
                    subject_name: '❌', chapter_name: '❌', topic_name: '❌',
                    is_revision: false,
                    chapter_done: false, topic_done: false,
                    effective_time_minutes: 0,
                    sort_order: sortIdx++
                });
            } else {
                for (const t of day.topics) {
                    await db.from('routine_items').insert({
                        routine_id: routineId,
                        date: fmtDateISO(day.date),
                        day_number: day.dayNum,
                        subject_name: t.subject,
                        chapter_name: t.chapter,
                        topic_name: t.name,
                        is_revision: false,
                        chapter_done: false, topic_done: false,
                        effective_time_minutes: Math.round(t.effectiveTime),
                        difficulty: t.difficulty,
                        sort_order: sortIdx++
                    });
                }
            }
        }

        hideLoader();
        G.editMode = false; G.editData = null;
        await openView(routineId);

    } catch (err) {
        hideLoader();
        console.error('Generation error:', err);
        alert('ত্রুটি: ' + err.message);
    }
}

// ══════════════════════════════════════
// CORE AI DISTRIBUTION ALGORITHM
// ══════════════════════════════════════
function distributeTopics(chapGroups, startDate, totalDays, revGap, studyDays) {
    const totalTime = chapGroups.reduce((s, g) => s + g.topics.reduce((ss, t) => ss + t.effectiveTime, 0), 0);
    const dailyTarget = studyDays > 0 ? totalTime / studyDays : totalTime;

    const hard   = chapGroups.filter(g => g.difficulty === 'hard');
    const medium = chapGroups.filter(g => g.difficulty === 'medium');
    const easy   = chapGroups.filter(g => g.difficulty === 'easy');

    const ordered = [];
    const maxLen = Math.max(hard.length, medium.length, easy.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < hard.length)   ordered.push(hard[i]);
        if (i < easy.length)   ordered.push(easy[i]);
        if (i < medium.length) ordered.push(medium[i]);
    }

    const schedule = [];
    let dayNum = 1;
    let date = new Date(startDate);
    let groupIdx = 0;

    while (dayNum <= totalDays) {
        if (dayNum > 1 && (dayNum - 1) % revGap === 0) {
            schedule.push({ date: new Date(date), dayNum, isRevision: true, topics: [] });
        } else {
            const dayTopics = [];
            let dayTime = 0;
            let hardOnDay = 0;

            let tempIdx = groupIdx;
            while (tempIdx < ordered.length) {
                const group = ordered[tempIdx];
                const groupTime = group.topics.reduce((s, t) => s + t.effectiveTime, 0);
                const topicCount = group.topics.length;

                if (group.difficulty === 'hard' && hardOnDay >= 2) {
                    tempIdx++;
                    continue;
                }

                if (dayTopics.length + topicCount > 4) {
                    if (dayTopics.length > 0) break;
                }

                const enriched = group.topics.map(t => ({
                    ...t,
                    subject: group.subject,
                    chapter: group.chapter,
                    difficulty: group.difficulty
                }));
                dayTopics.push(...enriched);
                dayTime += groupTime;

                if (group.difficulty === 'hard') hardOnDay++;
                groupIdx = ++tempIdx;

                if (dayTime >= dailyTarget * 0.85) break;
            }

            schedule.push({ date: new Date(date), dayNum, isRevision: false, topics: dayTopics });
        }

        date.setDate(date.getDate() + 1);
        dayNum++;
    }

    return schedule;
}

// ══════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════
async function loadHome() {
    try {
        const { data, error } = await db.from('routines')
            .select('*')
            .eq('user_id', G.userId)
            .order('created_at', { ascending: false });

        const container = document.getElementById('savedRoutines');
        
        if (error) {
            console.error('Load home error:', error);
            container.innerHTML = '<p style="text-align:center;opacity:.5;padding:40px 20px;">লোড করতে সমস্যা হয়েছে</p>';
            return;
        }

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align:center;opacity:.5;padding:40px 20px;">কোনো রুটিন নেই। নতুন রুটিন তৈরি করুন!</p>';
            return;
        }

        container.innerHTML = '';
        data.forEach(r => container.appendChild(buildRoutineCard(r)));
    } catch (err) {
        console.error('Load home exception:', err);
    }
}

function buildRoutineCard(r) {
    const div = document.createElement('div');
    div.className = 'routine-card';

    const daysLeft = Math.ceil((new Date(r.end_date) - new Date()) / 86400000);
    const badgeClass = daysLeft > 7 ? 'ok' : daysLeft > 0 ? 'warn' : 'over';
    const badgeText  = daysLeft > 0 ? `${daysLeft} দিন বাকি` : 'সময় শেষ';
    const chPct = r.total_chapters > 0 ? ((r.chapters_done / r.total_chapters) * 100).toFixed(0) : 0;
    const tPct  = r.total_topics   > 0 ? ((r.topics_done   / r.total_topics)   * 100).toFixed(0) : 0;

    div.innerHTML = `
      <h3>${r.name}</h3>
      <p class="meta">📅 ${fmtDate(r.start_date)} → ${fmtDate(r.end_date)}</p>
      <span class="days-badge ${badgeClass}">${badgeText}</span>
      <p class="mini-prog-label">চ্যাপ্টার: ${chPct}%</p>
      <div class="mini-prog"><div style="width:${chPct}%"></div></div>
      <p class="mini-prog-label">টপিক: ${tPct}%</p>
      <div class="mini-prog"><div style="width:${tPct}%"></div></div>
      <div class="card-actions">
        <button class="btn-action" onclick="openView(${r.id})">👁 View</button>
        <button class="btn-action" onclick="startEdit(${r.id})">✏️ Edit</button>
        <button class="btn-action" onclick="pdfRoutine(${r.id})">📥 PDF</button>
        <button class="btn-action" onclick="deleteRoutine(${r.id})">🗑 Delete</button>
      </div>`;
    return div;
}

// ══════════════════════════════════════
// VIEW ROUTINE
// ══════════════════════════════════════
async function openView(id) {
    showLoader('লোড হচ্ছে...');
    G.routineId = id;

    const { data: r } = await db.from('routines').select('*').eq('id', id).single();
    const { data: items } = await db.from('routine_items').select('*')
        .eq('routine_id', id).order('sort_order');

    G.currentRoutine = r;

    document.getElementById('viewRoutineName').textContent = r.name;
    document.getElementById('viewDateRange').textContent   = `📅 ${fmtDate(r.start_date)} → ${fmtDate(r.end_date)} | মোট ${r.total_days} দিন`;

    const dl = Math.ceil((new Date(r.end_date) - new Date()) / 86400000);
    const dlEl = document.getElementById('viewDaysLeft');
    dlEl.textContent = dl > 0 ? `⏳ ${dl} দিন বাকি` : '⛔ সময় শেষ';
    dlEl.style.color = dl > 7 ? 'var(--gold)' : dl > 0 ? '#ff9600' : '#ff3c3c';

    document.getElementById('viewTarget').textContent = r.personal_target
        ? `🎯 ${r.personal_target}` : '';

    document.getElementById('pdfTitle').textContent  = r.name;
    document.getElementById('pdfDate').textContent   = `তারিখ: ${fmtDate(r.start_date)} → ${fmtDate(r.end_date)}`;
    document.getElementById('pdfTarget').textContent = r.personal_target ? `লক্ষ্য: ${r.personal_target}` : '';
    document.getElementById('pdfStats').textContent  = `মোট চ্যাপ্টার: ${r.total_chapters} | মোট টপিক: ${r.total_topics} | মোট দিন: ${r.total_days}`;

    refreshProgress(r);
    renderTable(items, r);

    hideLoader();
    showPage('viewPage');
}

function renderTable(items, r) {
    const tbody = document.getElementById('routineTbody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const tr = document.createElement('tr');

        if (item.is_revision) {
            tr.className = 'tr-revision';
            tr.innerHTML = `<td colspan="4" style="text-align:center;font-size:1.05rem;">
                🔁 REVISION DAY &nbsp;—&nbsp; ${fmtDate(item.date)}
            </td>`;
        } else {
            const isEmpty = item.topic_name === '❌' || !item.topic_name;
            const isDone  = item.chapter_done && item.topic_done;

            tr.className = isEmpty ? 'tr-empty' : isDone ? 'tr-done' : '';
            tr.innerHTML = `
              <td>${fmtDate(item.date)}</td>
              <td>${item.subject_name || '❌'}</td>
              <td>
                <div class="cb-wrap">
                  <span class="cb ${item.chapter_done?'checked':''}"
                        onclick="onChapterCb(${item.id},'${escapeStr(item.chapter_name)}',${!item.chapter_done})"></span>
                  <span>${item.chapter_name || '❌'}</span>
                </div>
              </td>
              <td>
                <div class="cb-wrap">
                  <span class="cb ${item.topic_done?'checked':''}"
                        onclick="onTopicCb(${item.id},'${escapeStr(item.chapter_name)}',${!item.topic_done})"></span>
                  <span>${item.topic_name || '❌'}</span>
                </div>
              </td>`;
        }
        tbody.appendChild(tr);
    });
}

function escapeStr(s) {
    return (s || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function refreshProgress(r) {
    const chPct = r.total_chapters > 0 ? ((r.chapters_done / r.total_chapters) * 100).toFixed(0) : 0;
    const tPct  = r.total_topics   > 0 ? ((r.topics_done   / r.total_topics)   * 100).toFixed(0) : 0;
    document.getElementById('chapterBar').style.width  = chPct + '%';
    document.getElementById('topicBar').style.width    = tPct + '%';
    document.getElementById('chapterPct').textContent  = chPct + '%';
    document.getElementById('topicPct').textContent    = tPct + '%';
    document.getElementById('pdfChPct').textContent    = chPct + '%';
    document.getElementById('pdfToPct').textContent    = tPct + '%';
}

// ══════════════════════════════════════
// CHECKBOX LOGIC
// ══════════════════════════════════════
async function onTopicCb(itemId, chapName, isDone) {
    await db.from('routine_items').update({ topic_done: isDone }).eq('id', itemId);

    const { data: item } = await db.from('routine_items').select('topic_name').eq('id', itemId).single();
    if (item?.topic_name && item.topic_name !== '❌') {
        await db.from('topics')
            .update({ is_done: isDone })
            .eq('routine_id', G.routineId)
            .eq('name', item.topic_name);
    }

    const { data: chapItems } = await db.from('routine_items')
        .select('topic_done, is_revision')
        .eq('routine_id', G.routineId)
        .eq('chapter_name', chapName)
        .eq('is_revision', false);

    const validItems = chapItems?.filter(ci => ci.topic_done !== null) || [];
    const allDone = validItems.length > 0 && validItems.every(ci => ci.topic_done);

    if (allDone) {
        await db.from('routine_items')
            .update({ chapter_done: true })
            .eq('routine_id', G.routineId)
            .eq('chapter_name', chapName);
        await db.from('chapters')
            .update({ is_done: true })
            .eq('routine_id', G.routineId)
            .eq('name', chapName);
    } else {
        if (!isDone) {
            await db.from('routine_items')
                .update({ chapter_done: false })
                .eq('routine_id', G.routineId)
                .eq('chapter_name', chapName);
            await db.from('chapters')
                .update({ is_done: false })
                .eq('routine_id', G.routineId)
                .eq('name', chapName);
        }
    }

    await syncProgressToDB();
    await openView(G.routineId);
}

async function onChapterCb(itemId, chapName, isDone) {
    await db.from('routine_items')
        .update({ chapter_done: isDone, topic_done: isDone })
        .eq('routine_id', G.routineId)
        .eq('chapter_name', chapName);

    await db.from('chapters')
        .update({ is_done: isDone })
        .eq('routine_id', G.routineId)
        .eq('name', chapName);

    const { data: chData } = await db.from('chapters')
        .select('id')
        .eq('routine_id', G.routineId)
        .eq('name', chapName);

    if (chData?.length) {
        for (const ch of chData) {
            await db.from('topics').update({ is_done: isDone }).eq('chapter_id', ch.id);
        }
    }

    await syncProgressToDB();
    await openView(G.routineId);
}

async function syncProgressToDB() {
    const { data: items } = await db.from('routine_items')
        .select('chapter_name, topic_name, chapter_done, topic_done')
        .eq('routine_id', G.routineId)
        .eq('is_revision', false);

    const chapMap = {};
    items?.forEach(i => {
        if (!i.chapter_name || i.chapter_name === '❌') return;
        if (!chapMap[i.chapter_name]) chapMap[i.chapter_name] = { total: 0, done: 0 };
        chapMap[i.chapter_name].total++;
        if (i.chapter_done) chapMap[i.chapter_name].done++;
    });
    const chaptersDone = Object.values(chapMap).filter(v => v.total > 0 && v.done === v.total).length;

    const validTopics = items?.filter(i => i.topic_name && i.topic_name !== '❌') || [];
    const topicsDone  = validTopics.filter(i => i.topic_done).length;

    await db.from('routines').update({
        chapters_done: chaptersDone,
        topics_done:   topicsDone,
        updated_at:    new Date().toISOString()
    }).eq('id', G.routineId);

    if (G.currentRoutine) {
        G.currentRoutine.chapters_done = chaptersDone;
        G.currentRoutine.topics_done   = topicsDone;
        refreshProgress(G.currentRoutine);
    }
}

// ══════════════════════════════════════
// RE-MAKE ROUTINE
// ══════════════════════════════════════
async function remakeRoutine() {
    showLoader('চেক করা হচ্ছে...');

    const { data: pending } = await db.from('routine_items')
        .select('*')
        .eq('routine_id', G.routineId)
        .eq('is_revision', false)
        .eq('topic_done', false);

    hideLoader();

    if (!pending?.length) {
        alert('🎉 সব শেষ! নতুন রুটিনের প্রয়োজন নেই।');
        return;
    }

    if (!confirm(`${pending.length}টি বাকি টপিক নিয়ে আজ থেকে নতুন রুটিন তৈরি করবেন?`)) return;

    const r = G.currentRoutine;
    const startDate = new Date();
    const endDate   = new Date(r.end_date);
    const totalDays = Math.max(1, Math.ceil((endDate - startDate) / 86400000) + 1);

    if (totalDays < 1) {
        alert('শেষের তারিখ পার হয়ে গেছে। Edit করে নতুন তারিখ দিন।');
        return;
    }

    const revGap       = r.revision_gap;
    const revisionDays = Math.floor((totalDays - 1) / revGap);
    const studyDays    = Math.max(1, totalDays - revisionDays);

    const chapMap = {};
    pending.forEach(item => {
        const key = `${item.subject_name}|||${item.chapter_name}`;
        if (!chapMap[key]) chapMap[key] = { subject: item.subject_name, chapter: item.chapter_name, difficulty: item.difficulty||'medium', topics: [] };
        chapMap[key].topics.push({ name: item.topic_name, effectiveTime: item.effective_time_minutes || 60, difficulty: item.difficulty||'medium' });
    });
    const chapGroups = Object.values(chapMap);

    showLoader('রুটিন পুনরায় তৈরি হচ্ছে...');

    await saveHistory(G.routineId, 'remake', r.total_topics, pending.length, pending.length, 'Remade with pending topics');

    await db.from('routine_items').delete().eq('routine_id', G.routineId);

    const schedule = distributeTopics(chapGroups, startDate, totalDays, revGap, studyDays);

    let sortIdx = 0;
    for (const day of schedule) {
        if (day.isRevision) {
            await db.from('routine_items').insert({
                routine_id: G.routineId, date: fmtDateISO(day.date),
                day_number: day.dayNum, is_revision: true, sort_order: sortIdx++
            });
        } else if (!day.topics.length) {
            await db.from('routine_items').insert({
                routine_id: G.routineId, date: fmtDateISO(day.date),
                day_number: day.dayNum, subject_name:'❌', chapter_name:'❌', topic_name:'❌',
                is_revision: false, chapter_done:false, topic_done:false,
                effective_time_minutes:0, sort_order: sortIdx++
            });
        } else {
            for (const t of day.topics) {
                await db.from('routine_items').insert({
                    routine_id: G.routineId, date: fmtDateISO(day.date),
                    day_number: day.dayNum,
                    subject_name: t.subject, chapter_name: t.chapter, topic_name: t.name,
                    is_revision: false, chapter_done:false, topic_done:false,
                    effective_time_minutes: Math.round(t.effectiveTime),
                    difficulty: t.difficulty, sort_order: sortIdx++
                });
            }
        }
    }

    await db.from('routines').update({
        start_date: fmtDateISO(startDate),
        total_days: totalDays, study_days: studyDays, revision_days: revisionDays,
        total_topics: pending.length, topics_done: 0, chapters_done: 0,
        updated_at: new Date().toISOString()
    }).eq('id', G.routineId);

    hideLoader();
    alert('✅ রুটিন পুনরায় তৈরি হয়েছে!');
    await openView(G.routineId);
}

// ══════════════════════════════════════
// EDIT ROUTINE
// ══════════════════════════════════════
async function startEdit(id) {
    G.routineId = id;
    editRoutine();
}

async function editRoutine() {
    showLoader('লোড হচ্ছে...');

    const { data: r } = await db.from('routines').select('*').eq('id', G.routineId).single();
    const { data: subjects } = await db.from('subjects').select('*').eq('routine_id', G.routineId).order('sort_order');

    G.editMode = true;
    G.editData = r;

    resetCreator();

    document.getElementById('routineName').value = r.name;
    document.getElementById('personalTarget').value = r.personal_target || '';
    document.getElementById('startDate').value = r.start_date?.split('T')[0] || '';
    document.getElementById('endDate').value   = r.end_date?.split('T')[0]   || '';
    document.getElementById('startTime').value = r.start_time || '06:00';
    document.getElementById('endTime').value   = r.end_time   || '23:00';
    const revRadio = document.querySelector(`input[name="revGap"][value="${r.revision_gap}"]`);
    if (revRadio) revRadio.checked = true;

    calcDays();

    for (const subj of subjects) {
        G.subCount++;
        const sid = G.subCount;
        const sdiv = document.createElement('div');
        sdiv.className = 'subject-card';
        sdiv.id = `sub${sid}`;
        sdiv.innerHTML = `
          <div class="subject-header">
            <input class="subj-name" placeholder="সাবজেক্টের নাম" type="text" value="${subj.name}">
            <button class="btn-sm" onclick="rmSub(${sid})">×</button>
          </div>
          <div id="chaps${sid}"></div>
          <button class="btn-add" onclick="addChapter(${sid})">+ চ্যাপ্টার যোগ করুন</button>`;
        document.getElementById('subjectsContainer').appendChild(sdiv);

        const { data: chapters } = await db.from('chapters').select('*').eq('subject_id', subj.id).order('sort_order');
        for (const chap of chapters) {
            const cid = addChapter(sid, { name: chap.name, timeLevel: chap.time_level, difficulty: chap.difficulty });
            const { data: topics } = await db.from('topics').select('*').eq('chapter_id', chap.id).order('sort_order');
            for (const tp of topics) {
                if (tp.name !== '❌') addTopic(cid, tp.name);
            }
        }
    }

    hideLoader();
    showPage('creatorPage');
    nextStep(1);
}

// ══════════════════════════════════════
// DELETE ROUTINE
// ══════════════════════════════════════
async function deleteRoutine(id) {
    if (!confirm('রুটিন স্থায়ীভাবে মুছে ফেলবেন?')) return;
    showLoader('মুছে ফেলা হচ্ছে...');

    const { data: r } = await db.from('routines').select('*').eq('id', id).single();
    await saveHistory(id, 'delete', r?.total_topics||0, 0, 0, `"${r?.name}" deleted`);

    await db.from('routine_items').delete().eq('routine_id', id);
    await db.from('topics').delete().eq('routine_id', id);
    await db.from('chapters').delete().eq('routine_id', id);
    await db.from('subjects').delete().eq('routine_id', id);
    await db.from('routines').delete().eq('id', id);

    hideLoader();
    await loadHome();
}

// ══════════════════════════════════════
// PDF
// ══════════════════════════════════════
async function pdfRoutine(id) {
    G.routineId = id;
    await openView(id);
    setTimeout(() => window.print(), 500);
}

function downloadPDF() {
    window.print();
}

// ══════════════════════════════════════
// HISTORY
// ══════════════════════════════════════
async function saveHistory(routineId, action, topBefore, topAfter, pending, notes) {
    const { data: hist } = await db.from('routine_history')
        .select('version')
        .eq('routine_id', routineId)
        .order('version', { ascending: false })
        .limit(1);
    const version = (hist?.[0]?.version || 0) + 1;

    await db.from('routine_history').insert({
        routine_id: routineId, version, action,
        total_topics_before: topBefore,
        total_topics_after:  topAfter,
        pending_topics:      pending,
        notes
    });
}

// ══════════════════════════════════════
// LOADER
// ══════════════════════════════════════
function showLoader(msg) {
    document.getElementById('loadingText').textContent = msg || 'লোড হচ্ছে...';
    document.getElementById('loadingOverlay').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// ══════════════════════════════════════
// RESET
// ══════════════════════════════════════
function resetCreator() {
    G.subCount = 0; G.chapCount = 0; G.topicCount = 0;
    document.getElementById('routineName').value    = '';
    document.getElementById('personalTarget').value = '';
    document.getElementById('startDate').value      = '';
    document.getElementById('endDate').value        = '';
    document.getElementById('startTime').value      = '06:00';
    document.getElementById('endTime').value        = '23:00';
    document.getElementById('subjectsContainer').innerHTML = '';
    document.getElementById('dayCalc').innerHTML    = '';
    document.querySelector('input[name="revGap"][value="7"]').checked = true;

    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    document.querySelectorAll('.step-item').forEach((s,i) => {
        s.classList.remove('active','done');
        if (i === 0) s.classList.add('active');
    });
}

// ══════════════════════════════════════
// UTILS
// ══════════════════════════════════════
function fmtDate(str) {
    if (!str) return '?';
    const d = new Date(str);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function fmtDateISO(d) {
    const date = d instanceof Date ? d : new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}