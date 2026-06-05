document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = 'https://qgriwpjsslovkkmnlntg.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_ZnEVeUYjF7ZII5An9ku5rw_1CrNo3Gl';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const loginSection     = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const pinInput         = document.getElementById('admin-pin');
    const btnLogin         = document.getElementById('btn-login');
    const configForm       = document.getElementById('config-form');
    const btnSave          = document.getElementById('btn-save');
    const saveStatus       = document.getElementById('save-status');

    const DEFAULT_CONFIG = {
        id: 1,
        carnePremiumKg: 210,
        panPorPersona: 10,
        aderezosPorPersona: 6,
        packagingPorPersona: 8,
        ensaladaKg: 60,
        picadaKg: 100,
        verdurasPorPersona: 15,
        asadorHora: 240,
        asistenteHora: 200,
        logistica: 2000
    };

    const FIELDS = Object.keys(DEFAULT_CONFIG).filter(k => k !== 'id');

    // Login
    btnLogin.addEventListener('click', () => {
        if (pinInput.value === '1764') {
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            loadData();
        } else {
            pinInput.style.borderColor = '#ff4444';
            setTimeout(() => pinInput.style.borderColor = '#333', 1500);
            alert('PIN incorrecto');
        }
    });
    pinInput.addEventListener('keypress', e => { if (e.key === 'Enter') btnLogin.click(); });

    async function loadData() {
        try {
            let { data, error } = await supabase
                .from('criollo_config').select('*').eq('id', 1).single();
            if (error || !data) {
                console.warn('No DB data, using defaults');
                data = DEFAULT_CONFIG;
            }
            FIELDS.forEach(key => {
                const el = document.getElementById(key);
                if (el && data[key] !== undefined) el.value = data[key];
            });
        } catch (err) {
            console.error('Error loading data:', err);
        }
    }

    configForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnSave.textContent = 'Guardando...';
        btnSave.disabled = true;

        const newData = { id: 1 };
        FIELDS.forEach(key => {
            const el = document.getElementById(key);
            if (el) newData[key] = Number(el.value);
        });

        try {
            const { data: updated, error: updateError } = await supabase
                .from('criollo_config').update(newData).eq('id', 1).select();

            if (updateError) {
                if (updateError.message && updateError.message.includes('row-level security'))
                    throw new Error('RLS bloqueó la escritura. Desactivá RLS en Supabase → criollo_config.');
                throw updateError;
            }

            if (!updated || updated.length === 0) {
                const { error: insertError } = await supabase
                    .from('criollo_config').insert(newData);
                if (insertError) throw insertError;
            }

            saveStatus.style.display = 'block';
            saveStatus.style.color = '#4CAF50';
            saveStatus.textContent = '✅ ¡Guardado exitosamente! La calculadora se actualizó en vivo.';
            setTimeout(() => { saveStatus.style.display = 'none'; }, 4000);
        } catch (err) {
            console.error('Error saving:', err);
            saveStatus.style.display = 'block';
            saveStatus.style.color = '#ff4444';
            saveStatus.textContent = '❌ ' + (err.message || 'Error desconocido. Ver consola.');
            setTimeout(() => { saveStatus.style.display = 'none'; }, 6000);
        } finally {
            btnSave.textContent = '💾 Guardar Cambios en Supabase';
            btnSave.disabled = false;
        }
    });
});
