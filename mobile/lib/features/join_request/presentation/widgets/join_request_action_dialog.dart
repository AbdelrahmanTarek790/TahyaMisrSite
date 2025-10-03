import 'package:flutter/material.dart';

class JoinRequestActionDialog extends StatefulWidget {
  final String action; // 'approve' or 'deny'
  final Function(String) onConfirm;

  const JoinRequestActionDialog({
    super.key,
    required this.action,
    required this.onConfirm,
  });

  @override
  State<JoinRequestActionDialog> createState() => _JoinRequestActionDialogState();
}

class _JoinRequestActionDialogState extends State<JoinRequestActionDialog> {
  final _notesController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final isApprove = widget.action == 'approve';
    
    return AlertDialog(
      title: Row(
        children: [
          Icon(
            isApprove ? Icons.check_circle : Icons.cancel,
            color: isApprove ? Colors.green : Colors.red,
          ),
          const SizedBox(width: 8),
          Text(isApprove ? 'قبول الطلب' : 'رفض الطلب'),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isApprove 
              ? 'هل أنت متأكد من قبول هذا الطلب؟'
              : 'هل أنت متأكد من رفض هذا الطلب؟',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _notesController,
            decoration: InputDecoration(
              labelText: 'ملاحظات *',
              hintText: isApprove 
                ? 'اكتب ملاحظات الموافقة...'
                : 'اكتب سبب الرفض...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              prefixIcon: const Icon(Icons.note),
            ),
            maxLines: 3,
            textInputAction: TextInputAction.done,
          ),
          const SizedBox(height: 8),
          Text(
            '* الملاحظات مطلوبة',
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('إلغاء'),
        ),
        ElevatedButton(
          onPressed: _submitAction,
          style: ElevatedButton.styleFrom(
            backgroundColor: isApprove ? Colors.green : Colors.red,
            foregroundColor: Colors.white,
          ),
          child: Text(isApprove ? 'قبول' : 'رفض'),
        ),
      ],
    );
  }

  void _submitAction() {
    final notes = _notesController.text.trim();
    
    if (notes.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('يرجى إضافة ملاحظات'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    widget.onConfirm(notes);
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }
}