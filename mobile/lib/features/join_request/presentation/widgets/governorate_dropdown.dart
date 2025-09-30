import 'package:flutter/material.dart';

class GovernorateDropdown extends StatelessWidget {
  final String selectedGovernorate;
  final ValueChanged<String?> onChanged;
  final String? Function(String?)? validator;

  const GovernorateDropdown({
    super.key,
    required this.selectedGovernorate,
    required this.onChanged,
    this.validator,
  });

  static const List<String> _governorates = [
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'الدقهلية',
    'البحر الأحمر',
    'البحيرة',
    'الفيوم',
    'الغربية',
    'الإسماعلية',
    'المنوفية',
    'المنيا',
    'القليوبية',
    'الوادي الجديد',
    'السويس',
    'اسوان',
    'اسيوط',
    'بني سويف',
    'بورسعيد',
    'دمياط',
    'الشرقية',
    'جنوب سيناء',
    'كفر الشيخ',
    'مطروح',
    'الأقصر',
    'قنا',
    'شمال سيناء',
    'سوهاج',
  ];

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      value: selectedGovernorate.isNotEmpty ? selectedGovernorate : null,
      decoration: InputDecoration(
        labelText: 'المحافظة',
        prefixIcon: const Icon(Icons.location_on),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: Colors.grey[50],
      ),
      items: _governorates.map((governorate) {
        return DropdownMenuItem<String>(
          value: governorate,
          child: Text(governorate),
        );
      }).toList(),
      onChanged: onChanged,
      validator: validator,
      isExpanded: true,
    );
  }
}