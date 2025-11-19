export class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.title = document.getElementById('modalTitulo');
        this.inputs = {
            field1: document.getElementById('modalCampo1'),
            field2: document.getElementById('modalCampo2'),
            field3: document.getElementById('modalCampo3')
        };
        this.labels = {
            field1: document.getElementById('modalCampo1Label'),
            field2: document.getElementById('modalCampo2Label'),
            field3: document.getElementById('modalCampo3Label')
        };
        this.saveBtn = document.getElementById('btnSalvarModal');
        this.cancelBtn = document.getElementById('btnCancelarModal');

        this.currentContext = null;

        this.bindEvents();
    }

    bindEvents() {
        this.cancelBtn.addEventListener('click', () => this.close());
        this.saveBtn.addEventListener('click', () => this.handleSave());
    }

    open(context) {
        this.currentContext = context;
        this.modal.style.display = 'flex';
        this.title.innerText = context.title;

        // Reset and setup fields based on context
        this.setupField('field1', context.fields.field1);
        this.setupField('field2', context.fields.field2);
        this.setupField('field3', context.fields.field3);
    }

    setupField(fieldName, config) {
        const input = this.inputs[fieldName];
        const label = this.labels[fieldName];

        if (config) {
            input.style.display = 'block';
            label.style.display = 'block';
            label.innerText = config.label;
            input.value = config.value || '';
            input.type = config.type || 'text';
            if (config.step) input.step = config.step;
        } else {
            input.style.display = 'none';
            label.style.display = 'none';
        }
    }

    close() {
        this.modal.style.display = 'none';
        this.currentContext = null;
    }

    async handleSave() {
        if (!this.currentContext) return;

        const data = {
            field1: this.inputs.field1.value,
            field2: this.inputs.field2.value,
            field3: this.inputs.field3.value
        };

        try {
            await this.currentContext.onSave(data);
            this.close();
        } catch (error) {
            alert('Erro ao salvar: ' + error.message);
        }
    }
}
