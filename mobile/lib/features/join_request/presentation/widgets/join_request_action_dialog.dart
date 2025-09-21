import 'package:flutter/material.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../../domain/entities/join_request.dart';

class JoinRequestActionDialog extends StatefulWidget {
  final JoinRequest request;
  final bool isApproval;
  final Function(String notes, String? university, String? membershipExpiry) onAction;

  const JoinRequestActionDialog({
    super.key,
    required this.request,
    required this.isApproval,
    required this.onAction,
  });

  @override
  State<JoinRequestActionDialog> createState() => _JoinRequestActionDialogState();
}

class _JoinRequestActionDialogState extends State<JoinRequestActionDialog> {
  final _notesController = TextEditingController();
  final _universityController = TextEditingController();
  DateTime? _selectedMembershipExpiry;
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _notesController.dispose();
    _universityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return AlertDialog(
      title: Row(
        children: [
          Icon(
            widget.isApproval ? Icons.check_circle : Icons.cancel,
            color: widget.isApproval ? Colors.green : Colors.red,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              widget.isApproval ? l10n.approveRequest : l10n.denyRequest,
              style: theme.textTheme.titleLarge,
            ),
          ),
        ],
      ),
      content: SizedBox(
        width: MediaQuery.of(context).size.width * 0.8,
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Request summary
                Card(
                  color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.requestDetails,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text('${l10n.name}: ${widget.request.name}'),
                        Text('${l10n.email}: ${widget.request.email}'),
                        Text('${l10n.governorate}: ${widget.request.governorate}'),
                        Text('${l10n.role}: ${widget.request.role == 'member' ? l10n.memberRole : l10n.volunteerRole}'),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Action notes (required)
                TextFormField(
                  controller: _notesController,
                  decoration: InputDecoration(
                    labelText: '${l10n.actionNotes} *',
                    hintText: widget.isApproval 
                        ? 'أسباب الموافقة وتوجيهات للعضو الجديد'
                        : 'أسباب الرفض وتوضيحات للمتقدم',
                    prefixIcon: const Icon(Icons.note),
                    border: const OutlineInputBorder(),
                  ),
                  maxLines: 3,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return l10n.actionNotesRequired;
                    }
                    return null;
                  },
                ),
                
                if (widget.isApproval) ...[
                  const SizedBox(height: 16),
                  
                  // University field (for approval only)
                  TextFormField(
                    controller: _universityController,
                    decoration: InputDecoration(
                      labelText: l10n.university,
                      hintText: 'جامعة العضو (اختياري)',
                      prefixIcon: const Icon(Icons.school),
                      border: const OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Membership expiry date
                  InkWell(
                    onTap: () => _selectMembershipExpiry(context),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border.all(color: theme.colorScheme.outline),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.calendar_today,
                            color: theme.colorScheme.onSurface,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              _selectedMembershipExpiry != null
                                  ? '${l10n.membershipExpiry}: ${_formatDate(_selectedMembershipExpiry!)}'
                                  : '${l10n.membershipExpiry} (اختياري)',
                              style: TextStyle(
                                color: _selectedMembershipExpiry != null 
                                    ? theme.colorScheme.onSurface
                                    : theme.colorScheme.outline,
                              ),
                            ),
                          ),
                          if (_selectedMembershipExpiry != null)
                            IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                                setState(() {
                                  _selectedMembershipExpiry = null;
                                });
                              },
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(l10n.cancel),
        ),
        ElevatedButton(
          onPressed: _submitAction,
          style: ElevatedButton.styleFrom(
            backgroundColor: widget.isApproval ? Colors.green : Colors.red,
            foregroundColor: Colors.white,
          ),
          child: Text(widget.isApproval ? l10n.approve : l10n.deny),
        ),
      ],
    );
  }

  void _submitAction() {
    if (_formKey.currentState?.validate() ?? false) {
      widget.onAction(
        _notesController.text.trim(),
        widget.isApproval && _universityController.text.trim().isNotEmpty 
            ? _universityController.text.trim() 
            : null,
        widget.isApproval && _selectedMembershipExpiry != null 
            ? _selectedMembershipExpiry!.toIso8601String() 
            : null,
      );
      Navigator.of(context).pop();
    }
  }

  Future<void> _selectMembershipExpiry(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 365)), // Default to 1 year from now
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)), // Max 5 years from now
    );
    
    if (picked != null && picked != _selectedMembershipExpiry) {
      setState(() {
        _selectedMembershipExpiry = picked;
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}