<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { EmployeeForm } from '@/modules/employee/types/EmployeeForm.ts';
import TBoxBase from '@/components/TBoxBase.vue';
import DateBase from '@/components/DateBase.vue';
import { useEmployeesStore } from '@/modules/employee/store/index.ts';

const props = defineProps<{
  id?: number | null;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: any): void;
}>();

const store = useEmployeesStore();
const isEdit = ref(false);

const form = ref<EmployeeForm>({
  first_name: '',
  last_name: '',
  middle_name: '',
  date_of_birth: '',
  passport_data: '',
  registration_address: '',
});

const passportSeries = ref('');
const passportNumber = ref('');
const passportIssueDate = ref('');
const passportIssuedBy = ref('');
const departmentCode = ref('');
const region = ref('');
const city = ref('');
const street = ref('');
const house = ref('');
const building = ref('');
const apartment = ref('');
const birthDateInput = ref('');

const resetForm = () => {
  form.value = {
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: '',
    passport_data: '',
    registration_address: '',
  };
  passportSeries.value = '';
  passportNumber.value = '';
  passportIssueDate.value = '';
  passportIssuedBy.value = '';
  departmentCode.value = '';
  region.value = '';
  city.value = '';
  street.value = '';
  house.value = '';
  building.value = '';
  apartment.value = '';
  birthDateInput.value = '';
};

const handleSubmit = () => {
  if (!form.value.first_name.trim() || !form.value.last_name.trim()) {
    alert('Пожалуйста, заполните обязательные поля: Имя и Фамилия');
    return;
  }

  form.value.passport_data = [
    passportSeries.value,
    passportNumber.value,
    passportIssueDate.value,
    passportIssuedBy.value,
    departmentCode.value,
  ].join(', ');

  const addressParts = [
    region.value,
    city.value && `г. ${city.value}`,
    street.value && `ул. ${street.value}`,
    house.value && `д. ${house.value}`,
    building.value && `корп. ${building.value}`,
    apartment.value && `кв. ${apartment.value}`,
  ].filter(Boolean);

  form.value.registration_address = addressParts.join(', ');

  if (birthDateInput.value) {
    form.value.date_of_birth = `${birthDateInput.value}T00:00:00.000Z`;
  } else {
    form.value.date_of_birth = '';
  }
  const submitData = { ...form.value };

  if (isEdit.value && props.id) {
    store.updateEmployee(props.id, submitData);
  } else {
    store.createEmployee(submitData);
  }
  emit('submit', submitData);
  closeModal();
};

const closeModal = () => {
  resetForm();
  isEdit.value = false;
  emit('close');
};

const formatDateForInput = (dateStr: string): string => {
  if (!dateStr) return '';

  if (dateStr.includes('T')) {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0] || '';
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
  }
  if (dateStr.includes('.')) {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day && month && year) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  }
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  return '';
};

const parsePassportData = (passportData: string) => {
  if (!passportData) return {};
  const parts = passportData.split(', ');
  return {
    passportSeries: parts[0] || '',
    passportNumber: parts[1] || '',
    passportIssueDate: formatDateForInput(parts[2] || ''),
    passportIssuedBy: parts[3] || '',
    departmentCode: parts[4] || '',
  };
};

const parseAddressData = (addressData: string) => {
  if (!addressData) return {};
  const result: any = {};
  const parts = addressData.split(', ');

  parts.forEach((part) => {
    if (part.startsWith('г.')) {
      result.city = part.substring(3).trim();
    } else if (part.startsWith('ул.')) {
      result.street = part.substring(4).trim();
    } else if (part.startsWith('д.')) {
      result.house = part.substring(3).trim();
    } else if (part.startsWith('корп.')) {
      result.building = part.substring(6).trim();
    } else if (part.startsWith('кв.')) {
      result.apartment = part.substring(4).trim();
    } else {
      result.region = part.trim();
    }
  });
  return result;
};

async function loadEmployee(id: number) {
  await store.getEmployeeById(id);
  if (store.employee) {
    const employee = store.employee;
    form.value.first_name = employee.first_name || '';
    form.value.last_name = employee.last_name || '';
    form.value.middle_name = employee.middle_name || '';
    form.value.date_of_birth = employee.date_of_birth || '';
    birthDateInput.value = formatDateForInput(employee.date_of_birth || '');
    if (employee.passport_data) {
      const passport = parsePassportData(employee.passport_data);
      passportSeries.value = passport.passportSeries || '';
      passportNumber.value = passport.passportNumber || '';
      passportIssueDate.value = passport.passportIssueDate || '';
      passportIssuedBy.value = passport.passportIssuedBy || '';
      departmentCode.value = passport.departmentCode || '';
    }
    if (employee.registration_address) {
      const address = parseAddressData(employee.registration_address);
      region.value = address.region || '';
      city.value = address.city || '';
      street.value = address.street || '';
      house.value = address.house || '';
      building.value = address.building || '';
      apartment.value = address.apartment || '';
    }
  }
}

watch(
  () => props.id,
  async (newId) => {
    if (newId != null) {
      isEdit.value = true;
      await loadEmployee(newId);
    } else {
      isEdit.value = false;
      resetForm();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="visible" class="modal">
    <form @submit.prevent="handleSubmit" class="modal-content">
      <h3>{{ isEdit ? 'Редактировать информацию' : 'Добавить информацию' }}</h3>

      <div class="base-container">
        <div class="left-column">
          <div class="input-field">
            <label>Имя:</label>
            <TBoxBase v-model="form.first_name" placeholder="Введите имя" />
          </div>
          <div class="input-field">
            <label>Фамилия:</label>
            <TBoxBase v-model="form.last_name" placeholder="Введите фамилию" />
          </div>
          <div class="input-field">
            <label>Отчество:</label>
            <TBoxBase v-model="form.middle_name" placeholder="Введите отчество" />
          </div>
          <div class="input-field">
            <label>Серия паспорта:</label>
            <TBoxBase v-model="passportSeries" placeholder="1234" />
          </div>
          <div class="input-field">
            <label>Номер паспорта:</label>
            <TBoxBase v-model="passportNumber" placeholder="123456" />
          </div>
          <div class="input-field">
            <label>Дата рождения:</label>
            <DateBase v-model="birthDateInput" />
          </div>
          <div class="input-field">
            <label>Дата выдачи паспорта:</label>
            <DateBase v-model="passportIssueDate" />
          </div>
        </div>

        <div class="right-column">
          <div class="input-field">
            <label>Кем выдан паспорт:</label>
            <TBoxBase v-model="passportIssuedBy" placeholder="ОВД района..." class="full-width" />
          </div>
          <div class="input-field">
            <label>Код подразделения:</label>
            <TBoxBase v-model="departmentCode" placeholder="123-456" />
          </div>
          <div class="input-field">
            <label>Область/Край:</label>
            <TBoxBase v-model="region" placeholder="Московская область" />
          </div>
          <div class="input-field">
            <label>Город/Населенный пункт:</label>
            <TBoxBase v-model="city" placeholder="Москва" />
          </div>
          <div class="input-field">
            <label>Улица:</label>
            <TBoxBase v-model="street" placeholder="Ленина" />
          </div>
          <div class="input-field">
            <label>Адрес:</label>
            <div class="address-row">
              <div class="address-item">
                <TBoxBase v-model="house" placeholder="Дом" />
              </div>
              <div class="address-item">
                <TBoxBase v-model="building" placeholder="Корпус" />
              </div>
              <div class="address-item">
                <TBoxBase v-model="apartment" placeholder="Квартира" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="buttons">
        <button type="submit" class="btn-primary">{{ isEdit ? 'Изменить' : 'Добавить' }}</button>
        <button type="button" @click="closeModal" class="btn-secondary">Отмена</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.modal-content {
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
}

.base-container {
  display: flex;
  gap: 40px;
}

.left-column,
.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-field {
  margin-bottom: 20px;
}

.input-field label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #424242;
  font-weight: 500;
}

.address-row {
  display: flex;
  gap: 12px;
}

.address-item {
  flex: 1;
}

.full-width {
  width: 100%;
}

.buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}
</style>
