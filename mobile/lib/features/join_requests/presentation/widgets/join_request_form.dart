import 'package:flutter/material.dart';

import '../../data/models/create_join_request.dart';

class JoinRequestForm extends StatefulWidget {
  final Function(CreateJoinRequest) onSubmit;

  const JoinRequestForm({
    super.key,
    required this.onSubmit,
  });

  @override
  State<JoinRequestForm> createState() => _JoinRequestFormState();
}

class _JoinRequestFormState extends State<JoinRequestForm> {
  final _formKey = GlobalKey<FormState>();
  
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _nationalIDController = TextEditingController();
  final _membershipNumberController = TextEditingController();
  final _notesController = TextEditingController();
  
  String? _selectedGovernorate;
  String? _selectedPosition;
  String _selectedRole = 'member';

  final List<String> _egyptGovernorates = [
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'أسوان',
    'أسيوط',
    'البحيرة',
    'بني سويف',
    'البحر الأحمر',
    'الدقهلية',
    'دمياط',
    'الفيوم',
    'الغربية',
    'الإسماعيلية',
    'كفر الشيخ',
    'الأقصر',
    'مطروح',
    'المنيا',
    'المنوفية',
    'الوادي الجديد',
    'شمال سيناء',
    'بورسعيد',
    'القليوبية',
    'قنا',
    'سوهاج',
    'جنوب سيناء',
    'السويس',
    'شرق',
  ];

  final List<String> _positions = [
    'رئيس الاتحاد',
    'نائب رئيس الاتحاد',
    'أمين عام',
    'أمين صندوق',
    'عضو مجلس إدارة',
    'رئيس لجنة',
    'عضو لجنة',
    'منسق',
    'متطوع',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _nationalIDController.dispose();
    _membershipNumberController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildPersonalInfoSection(),
          const SizedBox(height: 24),
          _buildContactInfoSection(),
          const SizedBox(height: 24),
          _buildMembershipInfoSection(),
          const SizedBox(height: 24),
          _buildAdditionalInfoSection(),
          const SizedBox(height: 32),
          _buildSubmitButton(),
        ],
      ),
    );
  }

  Widget _buildPersonalInfoSection() {
    return _buildSection(
      title: 'المعلومات الشخصية',
      icon: Icons.person,
      children: [
        _buildTextFormField(
          controller: _nameController,
          label: 'الاسم الكامل',
          hintText: 'أدخل اسمك الكامل',
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return 'الاسم مطلوب';
            }
            if (value.trim().length < 3) {
              return 'الاسم يجب أن يكون أكثر من 3 أحرف';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        _buildTextFormField(
          controller: _nationalIDController,
          label: 'الرقم القومي',
          hintText: 'أدخل رقمك القومي (14 رقم)',
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return 'الرقم القومي مطلوب';
            }
            if (value.trim().length != 14) {
              return 'الرقم القومي يجب أن يكون 14 رقم';
            }
            if (!RegExp(r'^[0-9]+$').hasMatch(value.trim())) {
              return 'الرقم القومي يجب أن يحتوي على أرقام فقط';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        _buildDropdownField<String>(
          value: _selectedGovernorate,
          label: 'المحافظة',
          hintText: 'اختر محافظتك',
          items: _egyptGovernorates.map((gov) => 
            DropdownMenuItem(value: gov, child: Text(gov))
          ).toList(),
          onChanged: (value) => setState(() => _selectedGovernorate = value),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'المحافظة مطلوبة';
            }
            return null;
          },
        ),
      ],
    );
  }

  Widget _buildContactInfoSection() {
    return _buildSection(
      title: 'بيانات التواصل',
      icon: Icons.contact_phone,
      children: [
        _buildTextFormField(
          controller: _emailController,
          label: 'البريد الإلكتروني',
          hintText: 'example@email.com',
          keyboardType: TextInputType.emailAddress,
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return 'البريد الإلكتروني مطلوب';
            }
            if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value.trim())) {
              return 'صيغة البريد الإلكتروني غير صحيحة';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        _buildTextFormField(
          controller: _phoneController,
          label: 'رقم الهاتف',
          hintText: '01012345678',
          keyboardType: TextInputType.phone,
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return 'رقم الهاتف مطلوب';
            }
            if (!RegExp(r'^01[0-9]{9}$').hasMatch(value.trim())) {
              return 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01 ويكون 11 رقم)';
            }
            return null;
          },
        ),
      ],
    );
  }

  Widget _buildMembershipInfoSection() {
    return _buildSection(
      title: 'معلومات العضوية',
      icon: Icons.card_membership,
      children: [
        _buildRoleSelection(),
        const SizedBox(height: 16),
        _buildDropdownField<String>(
          value: _selectedPosition,
          label: 'المنصب المطلوب (اختياري)',
          hintText: 'اختر المنصب المطلوب',
          items: _positions.map((position) => 
            DropdownMenuItem(value: position, child: Text(position))
          ).toList(),
          onChanged: (value) => setState(() => _selectedPosition = value),
          validator: null,
        ),
        const SizedBox(height: 16),
        _buildTextFormField(
          controller: _membershipNumberController,
          label: 'رقم العضوية (إن وجد)',
          hintText: 'أدخل رقم عضويتك السابق إن وجد',
          validator: null,
        ),
      ],
    );
  }

  Widget _buildAdditionalInfoSection() {
    return _buildSection(
      title: 'معلومات إضافية',
      icon: Icons.note,
      children: [
        _buildTextFormField(
          controller: _notesController,
          label: 'ملاحظات (اختياري)',
          hintText: 'أضف أي معلومات إضافية تود مشاركتها',
          maxLines: 4,
          validator: null,
        ),
      ],
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: Theme.of(context).primaryColor),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildTextFormField({
    required TextEditingController controller,
    required String label,
    required String hintText,
    String? Function(String?)? validator,
    TextInputType? keyboardType,
    int maxLines = 1,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hintText,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Theme.of(context).primaryColor),
        ),
      ),
      keyboardType: keyboardType,
      maxLines: maxLines,
      validator: validator,
    );
  }

  Widget _buildDropdownField<T>({
    required T? value,
    required String label,
    required String hintText,
    required List<DropdownMenuItem<T>> items,
    required void Function(T?) onChanged,
    String? Function(T?)? validator,
  }) {
    return DropdownButtonFormField<T>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        hintText: hintText,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Theme.of(context).primaryColor),
        ),
      ),
      items: items,
      onChanged: onChanged,
      validator: validator,
    );
  }

  Widget _buildRoleSelection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'نوع العضوية',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: RadioListTile<String>(
                title: const Text('عضو'),
                value: 'member',
                groupValue: _selectedRole,
                onChanged: (value) {
                  setState(() {
                    _selectedRole = value!;
                  });
                },
                contentPadding: EdgeInsets.zero,
              ),
            ),
            Expanded(
              child: RadioListTile<String>(
                title: const Text('متطوع'),
                value: 'volunteer',
                groupValue: _selectedRole,
                onChanged: (value) {
                  setState(() {
                    _selectedRole = value!;
                  });
                },
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: _handleSubmit,
        icon: const Icon(Icons.send),
        label: const Text('إرسال طلب الانضمام'),
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }

  void _handleSubmit() {
    if (_formKey.currentState!.validate()) {
      final request = CreateJoinRequest(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        phone: _phoneController.text.trim(),
        nationalID: _nationalIDController.text.trim(),
        governorate: _selectedGovernorate!,
        position: _selectedPosition,
        membershipNumber: _membershipNumberController.text.trim().isNotEmpty 
            ? _membershipNumberController.text.trim() 
            : null,
        role: _selectedRole,
        notes: _notesController.text.trim().isNotEmpty 
            ? _notesController.text.trim() 
            : null,
      );

      widget.onSubmit(request);
    }
  }
}