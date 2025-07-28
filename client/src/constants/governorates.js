// Egypt governorates list for use across the application
export const EGYPT_GOVERNORATES = [
  'Cairo',
  'Alexandria', 
  'Giza',
  'Qalyubia',
  'Port Said',
  'Suez',
  'Dakahlia',
  'Sharqia',
  'Gharbia',
  'Menoufia',
  'Kafr el-Sheikh',
  'Beheira',
  'Ismailia',
  'Damietta',
  'Faiyum',
  'Beni Suef',
  'Minya',
  'Asyut',
  'Sohag',
  'Qena',
  'Aswan',
  'Luxor',
  'Red Sea',
  'New Valley',
  'Matrouh',
  'North Sinai',
  'South Sinai'
];

// Helper function to get governorate options for select components
export const getGovernorateOptions = () => {
  return EGYPT_GOVERNORATES.map(gov => ({ value: gov, label: gov }));
};