document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = 'https://qgriwpjsslovkkmnlntg.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_ZnEVeUYjF7ZII5An9ku5rw_1CrNo3Gl';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const pinInput = document.getElementById('admin-pin');
    const btnLogin = document.getElementById('btn-login');
    const configForm = document.getElementById('config-form');
    const btnSave = document.getElementById('btn-save');
    const saveStatus = document.getElementById('save-status');

    // Mismos valores por defecto en caso de que la BD esté vacía
    const DEFAULT_CONFIG = {
        id: 1, // Siempre será la fila 1
        carnePremiumKg: 210,
        carneEuropeaKg: 170,
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

    // Login Logic
    btnLogin.addEventListener('click', () => {
        if (pinInput.value === '1764') {
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            loadData();
        } else {
            alert('PIN incorrecto');
        }
    });

    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnLogin.click();
    });

    // Load data from Supabase
    async function loadData() {
        try {
            let { data, error } = await supabase
                .from('criollo_config')
                .select('*')
                .eq('id', 1)
                .single();
            
            if (error || !data) {
                console.warn('No hay datos en la BD. Cargando valores por defecto...');
                data = DEFAULT_CONFIG;
            }

            // Llenar formulario
            document.getElementById('carnePremiumKg').value = data.carnePremiumKg;
            document.getElementById('carneEuropeaKg').value = data.carneEuropeaKg;
            document.getElementById('panPorPersona').value = data.panPorPersona;
            document.getElementById('aderezosPorPersona').value = data.aderezosPorPersona;
            document.getElementById('packagingPorPersona').value = data.packagingPorPersona;
            document.getElementById('ensaladaKg').value = data.ensaladaKg;
            document.getElementById('picadaKg').value = data.picadaKg;
            document.getElementById('verdurasPorPersona').value = data.verdurasPorPersona;
            document.getElementById('asadorHora').value = data.asadorHora;
            document.getElementById('asistenteHora').value = data.asistenteHora;
            document.getElementById('logistica').value = data.logistica;

        } catch (err) {
            console.error('Error al cargar datos:', err);
            alert('No se pudo conectar a Supabase. Revisa la consola para más detalles.');
        }
    }

    // Save data to Supabase
    configForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnSave.textContent = 'Guardando...';
        btnSave.disabled = true;

        const newData = {
            id: 1, // Update o Insert en la fila 1
            carnePremiumKg: Number(document.getElementById('carnePremiumKg').value),
            carneEuropeaKg: Number(document.getElementById('carneEuropeaKg').value),
            panPorPersona: Number(document.getElementById('panPorPersona').value),
            aderezosPorPersona: Number(document.getElementById('aderezosPorPersona').value),
            packagingPorPersona: Number(document.getElementById('packagingPorPersona').value),
            ensaladaKg: Number(document.getElementById('ensaladaKg').value),
            picadaKg: Number(document.getElementById('picadaKg').value),
            verdurasPorPersona: Number(document.getElementById('verdurasPorPersona').value),
            asadorHora: Number(document.getElementById('asadorHora').value),
            asistenteHora: Number(document.getElementById('asistenteHora').value),
            logistica: Number(document.getElementById('logistica').value)
        };

        try {
            const { data: updated, error: updateError } = await supabase
                .from('criollo_config')
                .update(newData)
                .eq('id', 1)
                .select();

            if (updateError) {
                // RLS policy blocking writes
                if (updateError.message && updateError.message.includes('row-level security')) {
                    throw new Error('Permiso denegado por Supabase (RLS). Seguí los pasos en la consola del navegador para habilitarlo.');
                }
                throw updateError;
            }

            if (!updated || updated.length === 0) {
                // Row might not exist yet — try insert
                const { error: insertError } = await supabase
                    .from('criollo_config')
                    .insert({ ...newData, id: 1 });

                if (insertError) {
                    if (insertError.message && insertError.message.includes('row-level security')) {
                        throw new Error('RLS bloqueó la escritura. En Supabase → Table Editor → criollo_config → RLS Policies → agregá una política UPDATE para "anon".');
                    }
                    throw insertError;
                }
            }

            saveStatus.style.display = 'block';
            saveStatus.textContent = '✅ ¡Guardado exitosamente!';
            saveStatus.style.color = '#4CAF50';
            setTimeout(() => { saveStatus.style.display = 'none'; }, 3000);

        } catch (err) {
            console.error('Error al guardar:', err);
            saveStatus.style.display = 'block';
            saveStatus.style.color = '#ff4444';
            saveStatus.textContent = '❌ ' + (err.message || 'Error desconocido. Ver consola.');
            setTimeout(() => { saveStatus.style.display = 'none'; }, 6000);
        } finally {
            btnSave.textContent = 'Guardar Cambios en Supabase';
            btnSave.disabled = false;
        }
    });
});
