import 'package:flutter/material.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../../domain/entities/join_request.dart';

class JoinRequestCard extends StatelessWidget {
  final JoinRequest request;
  final VoidCallback onApprove;
  final VoidCallback onDeny;

  const JoinRequestCard({
    super.key,
    required this.request,
    required this.onApprove,
    required this.onDeny,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.person,
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    request.name,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                _buildStatusChip(context, request.status),
              ],
            ),
            const SizedBox(height: 12),
            _buildInfoRow(
              icon: Icons.email,
              label: l10n.email,
              value: request.email,
            ),
            const SizedBox(height: 8),
            _buildInfoRow(
              icon: Icons.phone,
              label: l10n.phone,
              value: request.phone,
            ),
            const SizedBox(height: 8),
            _buildInfoRow(
              icon: Icons.credit_card,
              label: l10n.nationalId,
              value: request.nationalID,
            ),
            const SizedBox(height: 8),
            _buildInfoRow(
              icon: Icons.location_city,
              label: l10n.governorate,
              value: request.governorate,
            ),
            const SizedBox(height: 8),
            _buildInfoRow(
              icon: Icons.work,
              label: l10n.role,
              value: request.role == 'member' ? l10n.memberRole : l10n.volunteerRole,
            ),
            if (request.membershipNumber != null && request.membershipNumber!.isNotEmpty) ...[
              const SizedBox(height: 8),
              _buildInfoRow(
                icon: Icons.badge,
                label: l10n.membershipNumber,
                value: request.membershipNumber!,
              ),
            ],
            if (request.notes != null && request.notes!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.note,
                    color: theme.colorScheme.outline,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.additionalNotes,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.outline,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          request.notes!,
                          style: theme.textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
            if (request.approvalNotes != null && request.approvalNotes!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.admin_panel_settings,
                    color: theme.colorScheme.outline,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.actionNotes,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.outline,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          request.approvalNotes!,
                          style: theme.textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
            if (request.isPending) ...[
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onDeny,
                      icon: const Icon(Icons.close),
                      label: Text(l10n.deny),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: theme.colorScheme.error,
                        side: BorderSide(color: theme.colorScheme.error),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: onApprove,
                      icon: const Icon(Icons.check),
                      label: Text(l10n.approve),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          color: Theme.of(context).colorScheme.outline,
          size: 20,
        ),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.outline,
            fontWeight: FontWeight.w500,
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusChip(BuildContext context, String status) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    Color backgroundColor;
    Color textColor;
    String text;
    
    switch (status) {
      case 'approved':
        backgroundColor = Colors.green.withOpacity(0.1);
        textColor = Colors.green;
        text = l10n.approved;
        break;
      case 'denied':
        backgroundColor = Colors.red.withOpacity(0.1);
        textColor = Colors.red;
        text = l10n.denied;
        break;
      case 'pending':
      default:
        backgroundColor = Colors.orange.withOpacity(0.1);
        textColor = Colors.orange;
        text = l10n.pending;
        break;
    }

    return Chip(
      label: Text(
        text,
        style: TextStyle(
          color: textColor,
          fontWeight: FontWeight.w500,
          fontSize: 12,
        ),
      ),
      backgroundColor: backgroundColor,
      side: BorderSide(color: textColor.withOpacity(0.3)),
    );
  }
}