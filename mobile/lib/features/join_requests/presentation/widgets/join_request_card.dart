import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../domain/entities/join_request.dart';

class JoinRequestCard extends StatelessWidget {
  final JoinRequest joinRequest;
  final VoidCallback? onApprove;
  final VoidCallback? onDeny;
  final VoidCallback? onDelete;

  const JoinRequestCard({
    super.key,
    required this.joinRequest,
    this.onApprove,
    this.onDeny,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            const SizedBox(height: 12),
            _buildRequestInfo(),
            const SizedBox(height: 12),
            _buildContactInfo(),
            if (joinRequest.notes != null && joinRequest.notes!.isNotEmpty) ...[
              const SizedBox(height: 12),
              _buildNotes(),
            ],
            if (joinRequest.reviewedBy != null) ...[
              const SizedBox(height: 12),
              _buildReviewInfo(),
            ],
            const SizedBox(height: 16),
            _buildActions(context),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        CircleAvatar(
          backgroundColor: _getStatusColor(),
          child: Icon(
            _getStatusIcon(),
            color: Colors.white,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                joinRequest.name,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  _buildStatusChip(),
                  const SizedBox(width: 8),
                  Text(
                    DateFormat('dd/MM/yyyy').format(joinRequest.createdAt),
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatusChip() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: _getStatusColor().withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _getStatusColor()),
      ),
      child: Text(
        _getStatusText(),
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: _getStatusColor(),
        ),
      ),
    );
  }

  Widget _buildRequestInfo() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          _buildInfoRow(Icons.location_on, 'المحافظة', joinRequest.governorate),
          _buildInfoRow(Icons.badge, 'نوع العضوية', _getRoleText()),
          if (joinRequest.position != null)
            _buildInfoRow(Icons.work, 'المنصب المطلوب', joinRequest.position!),
          if (joinRequest.membershipNumber != null && joinRequest.membershipNumber!.isNotEmpty)
            _buildInfoRow(Icons.card_membership, 'رقم العضوية', joinRequest.membershipNumber!),
        ],
      ),
    );
  }

  Widget _buildContactInfo() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          _buildInfoRow(Icons.email, 'البريد الإلكتروني', joinRequest.email),
          _buildInfoRow(Icons.phone, 'رقم الهاتف', joinRequest.phone),
          _buildInfoRow(Icons.credit_card, 'الرقم القومي', joinRequest.nationalID),
        ],
      ),
    );
  }

  Widget _buildNotes() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.orange.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.note, size: 16, color: Colors.orange.shade600),
              const SizedBox(width: 4),
              Text(
                'ملاحظات مقدم الطلب:',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.orange.shade600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            joinRequest.notes!,
            style: TextStyle(
              fontSize: 14,
              color: Colors.orange.shade800,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewInfo() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: _getStatusColor().withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: _getStatusColor().withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(_getStatusIcon(), size: 16, color: _getStatusColor()),
              const SizedBox(width: 4),
              Text(
                'تمت المراجعة بواسطة:',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: _getStatusColor(),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            joinRequest.reviewedBy!,
            style: TextStyle(
              fontSize: 14,
              color: _getStatusColor(),
              fontWeight: FontWeight.w500,
            ),
          ),
          if (joinRequest.reviewedAt != null) ...[
            const SizedBox(height: 4),
            Text(
              'تاريخ المراجعة: ${DateFormat('dd/MM/yyyy - hh:mm a').format(joinRequest.reviewedAt!)}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
          ],
          if (joinRequest.approvalNotes != null && joinRequest.approvalNotes!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              'ملاحظات المراجع:',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: _getStatusColor(),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              joinRequest.approvalNotes!,
              style: TextStyle(
                fontSize: 14,
                color: _getStatusColor(),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.grey.shade600),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.grey.shade700,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActions(BuildContext context) {
    if (joinRequest.status != 'pending') {
      return const SizedBox.shrink();
    }

    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: onApprove,
            icon: const Icon(Icons.check, size: 18),
            label: const Text('موافقة'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: ElevatedButton.icon(
            onPressed: onDeny,
            icon: const Icon(Icons.close, size: 18),
            label: const Text('رفض'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        IconButton(
          onPressed: onDelete,
          icon: const Icon(Icons.delete_outline),
          color: Colors.grey.shade600,
          tooltip: 'حذف',
        ),
      ],
    );
  }

  Color _getStatusColor() {
    switch (joinRequest.status) {
      case 'approved':
        return Colors.green;
      case 'denied':
        return Colors.red;
      case 'pending':
      default:
        return Colors.orange;
    }
  }

  IconData _getStatusIcon() {
    switch (joinRequest.status) {
      case 'approved':
        return Icons.check_circle;
      case 'denied':
        return Icons.cancel;
      case 'pending':
      default:
        return Icons.pending;
    }
  }

  String _getStatusText() {
    switch (joinRequest.status) {
      case 'approved':
        return 'مقبول';
      case 'denied':
        return 'مرفوض';
      case 'pending':
      default:
        return 'قيد المراجعة';
    }
  }

  String _getRoleText() {
    switch (joinRequest.role) {
      case 'member':
        return 'عضو';
      case 'volunteer':
        return 'متطوع';
      default:
        return joinRequest.role;
    }
  }
}