import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../data/models/join_request_model.dart';

class JoinRequestCard extends StatelessWidget {
  final JoinRequestModel joinRequest;
  final Function(String) onApprove;
  final Function(String) onDeny;
  final Function(String) onDelete;

  const JoinRequestCard({
    super.key,
    required this.joinRequest,
    required this.onApprove,
    required this.onDeny,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: ExpansionTile(
        leading: CircleAvatar(
          backgroundColor: _getStatusColor(joinRequest.status),
          child: Icon(
            _getStatusIcon(joinRequest.status),
            color: Colors.white,
          ),
        ),
        title: Text(
          joinRequest.name,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(joinRequest.email),
            const SizedBox(height: 4),
            Row(
              children: [
                _buildStatusBadge(),
                const SizedBox(width: 8),
                _buildRoleBadge(),
              ],
            ),
          ],
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('الهاتف', joinRequest.phone, Icons.phone),
                _buildInfoRow('المحافظة', joinRequest.governorate, Icons.location_on),
                _buildInfoRow('الرقم القومي', joinRequest.nationalId, Icons.credit_card),
                _buildInfoRow(
                  'تاريخ الطلب',
                  DateFormat('yyyy-MM-dd HH:mm', 'ar').format(joinRequest.createdAt),
                  Icons.calendar_today,
                ),
                if (joinRequest.membershipNumber != null)
                  _buildInfoRow('رقم العضوية', joinRequest.membershipNumber!, Icons.card_membership),
                if (joinRequest.notes != null && joinRequest.notes!.isNotEmpty)
                  _buildInfoRow('ملاحظات', joinRequest.notes!, Icons.note),
                if (joinRequest.approvalNotes != null && joinRequest.approvalNotes!.isNotEmpty)
                  _buildInfoRow('ملاحظات الإدارة', joinRequest.approvalNotes!, Icons.admin_panel_settings),
                if (joinRequest.reviewedAt != null)
                  _buildInfoRow(
                    'تاريخ المراجعة',
                    DateFormat('yyyy-MM-dd HH:mm', 'ar').format(joinRequest.reviewedAt!),
                    Icons.schedule,
                  ),
                const SizedBox(height: 16),
                if (joinRequest.status == 'pending') _buildActionButtons(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: Colors.grey[600]),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: const TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.grey,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w400),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: _getStatusColor(joinRequest.status),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        _getStatusText(joinRequest.status),
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildRoleBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.blue[100],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.blue),
      ),
      child: Text(
        joinRequest.role == 'member' ? 'عضو' : 'متطوع',
        style: const TextStyle(
          color: Colors.blue,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildActionButtons() {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () => onApprove(joinRequest.id!),
            icon: const Icon(Icons.check, size: 16),
            label: const Text('قبول'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () => onDeny(joinRequest.id!),
            icon: const Icon(Icons.close, size: 16),
            label: const Text('رفض'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
            ),
          ),
        ),
        const SizedBox(width: 8),
        IconButton(
          onPressed: () => onDelete(joinRequest.id!),
          icon: const Icon(Icons.delete),
          color: Colors.red,
          tooltip: 'حذف',
        ),
      ],
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
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'pending':
        return Icons.hourglass_empty;
      case 'approved':
        return Icons.check_circle;
      case 'denied':
        return Icons.cancel;
      default:
        return Icons.help;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'approved':
        return 'مقبول';
      case 'denied':
        return 'مرفوض';
      default:
        return 'غير معروف';
    }
  }
}