import 'package:flutter/material.dart';

class JoinRequestFilters extends StatelessWidget {
  final String selectedStatus;
  final Function(String) onStatusChanged;

  const JoinRequestFilters({
    super.key,
    required this.selectedStatus,
    required this.onStatusChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade200,
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'فلترة الطلبات',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildStatusFilter('all', 'الكل', Icons.list, Colors.blue),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildStatusFilter('pending', 'قيد المراجعة', Icons.pending, Colors.orange),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildStatusFilter('approved', 'مقبول', Icons.check_circle, Colors.green),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildStatusFilter('denied', 'مرفوض', Icons.cancel, Colors.red),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusFilter(String status, String label, IconData icon, Color color) {
    final isSelected = selectedStatus == status;
    
    return InkWell(
      onTap: () => onStatusChanged(status),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.1) : Colors.grey.shade50,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? color : Colors.grey.shade300,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: isSelected ? color : Colors.grey.shade600,
              size: 20,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? color : Colors.grey.shade600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}