import 'package:flutter/material.dart';

class PositionDropdown extends StatefulWidget {
  final String selectedPosition;
  final ValueChanged<String?> onChanged;
  final String? Function(String?)? validator;

  const PositionDropdown({
    super.key,
    required this.selectedPosition,
    required this.onChanged,
    this.validator,
  });

  @override
  State<PositionDropdown> createState() => _PositionDropdownState();
}

class _PositionDropdownState extends State<PositionDropdown> {
  List<PositionModel> _positions = [];

  @override
  void initState() {
    super.initState();
    // Load positions if needed
    // Note: We'll create a mock list for now since we don't have the position feature implemented
    _positions = _getMockPositions();
  }

  List<PositionModel> _getMockPositions() {
    return [
      PositionModel(
        id: '1',
        name: 'رئيس الاتحاد',
        description: 'رئيس اتحاد الطلاب',
        isActive: true,
        isGlobal: true,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
      PositionModel(
        id: '2',
        name: 'نائب الرئيس',
        description: 'نائب رئيس اتحاد الطلاب',
        isActive: true,
        isGlobal: true,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
      PositionModel(
        id: '3',
        name: 'أمين الصندوق',
        description: 'أمين صندوق الاتحاد',
        isActive: true,
        isGlobal: true,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
      PositionModel(
        id: '4',
        name: 'أمين عام',
        description: 'أمين عام الاتحاد',
        isActive: true,
        isGlobal: true,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
      PositionModel(
        id: '5',
        name: 'مسؤول الأنشطة',
        description: 'مسؤول الأنشطة والفعاليات',
        isActive: true,
        isGlobal: false,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      initialValue: widget.selectedPosition.isNotEmpty ? widget.selectedPosition : null,
      decoration: InputDecoration(
        labelText: 'المنصب (إختياري)',
        prefixIcon: const Icon(Icons.work_outline),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: Colors.grey[50],
      ),
      items: [
        const DropdownMenuItem<String>(
          value: '',
          child: Text('لا يوجد منصب محدد'),
        ),
        ..._positions.where((position) => position.isActive).map((position) {
          return DropdownMenuItem<String>(
            value: position.id,
            child: Text(position.name),
          );
        }).toList(),
      ],
      onChanged: widget.onChanged,
      validator: widget.validator,
      isExpanded: true,
    );
  }
}

// Mock PositionModel class for now
class PositionModel {
  final String id;
  final String name;
  final String description;
  final bool isActive;
  final bool isGlobal;
  final DateTime createdAt;
  final DateTime updatedAt;

  PositionModel({
    required this.id,
    required this.name,
    required this.description,
    required this.isActive,
    required this.isGlobal,
    required this.createdAt,
    required this.updatedAt,
  });
}