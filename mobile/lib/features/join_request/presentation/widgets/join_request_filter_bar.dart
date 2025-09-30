import 'package:flutter/material.dart';

class JoinRequestFilterBar extends StatelessWidget {
  final String selectedStatus;
  final String searchQuery;
  final ValueChanged<String> onStatusChanged;
  final ValueChanged<String> onSearchChanged;

  const JoinRequestFilterBar({
    super.key,
    required this.selectedStatus,
    required this.searchQuery,
    required this.onStatusChanged,
    required this.onSearchChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            onChanged: onSearchChanged,
            decoration: InputDecoration(
              hintText: 'البحث بالاسم، البريد الإلكتروني، الهاتف، أو الرقم القومي...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              filled: true,
              fillColor: Colors.grey[50],
            ),
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('all', 'جميع الطلبات', Icons.list),
                const SizedBox(width: 8),
                _buildFilterChip('pending', 'في الانتظار', Icons.hourglass_empty),
                const SizedBox(width: 8),
                _buildFilterChip('approved', 'مقبولة', Icons.check_circle),
                const SizedBox(width: 8),
                _buildFilterChip('denied', 'مرفوضة', Icons.cancel),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String value, String label, IconData icon) {
    final isSelected = selectedStatus == value;
    return FilterChip(
      selected: isSelected,
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: isSelected ? Colors.white : Colors.grey[600],
          ),
          const SizedBox(width: 4),
          Text(label),
        ],
      ),
      onSelected: (_) => onStatusChanged(value),
      selectedColor: _getStatusColor(value),
      checkmarkColor: Colors.white,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.grey[700],
        fontWeight: isSelected ? FontWeight.w500 : FontWeight.normal,
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'approved':
        return Colors.green;
      case 'denied':
        return Colors.red;
      default:
        return Colors.blue;
    }
  }
}