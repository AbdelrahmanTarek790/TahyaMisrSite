import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/governorates.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../bloc/join_request_cubit.dart';
import '../bloc/join_request_state_simple.dart';

class JoinRequestPage extends StatefulWidget {
  const JoinRequestPage({super.key});

  @override
  State<JoinRequestPage> createState() => _JoinRequestPageState();
}

class _JoinRequestPageState extends State<JoinRequestPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _nationalIdController = TextEditingController();
  final _membershipNumberController = TextEditingController();
  final _notesController = TextEditingController();
  
  String? _selectedGovernorate;
  String? _selectedPosition;
  String _selectedRole = 'member';

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _nationalIdController.dispose();
    _membershipNumberController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return BlocConsumer<JoinRequestCubit, JoinRequestState>(
      listener: (context, state) {
        state.when(
          initial: () {},
          loading: () {},
          success: (message) {
            // Show success dialog instead of snackbar for better UX
            _showSuccessDialog(context, l10n);
          },
          error: (message) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(message),
                backgroundColor: theme.colorScheme.error,
              ),
            );
          },
        );
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            title: Text(l10n.joinUs),
            centerTitle: true,
          ),
          body: state.when(
            initial: () => _buildForm(context, l10n),
            loading: () => const Center(child: CircularProgressIndicator()),
            success: (message) => _buildForm(context, l10n),
            error: (message) => _buildForm(context, l10n),
          ),
        );
      },
    );
  }

  Widget _buildForm(BuildContext context, AppLocalizations l10n) {
    final theme = Theme.of(context);
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.group_add,
                          color: theme.colorScheme.primary,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          l10n.requestDetails,
                          style: theme.textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildNameField(l10n),
                    const SizedBox(height: 16),
                    _buildEmailField(l10n),
                    const SizedBox(height: 16),
                    _buildPhoneField(l10n),
                    const SizedBox(height: 16),
                    _buildNationalIdField(l10n),
                    const SizedBox(height: 16),
                    _buildGovernorateDropdown(l10n),
                    const SizedBox(height: 16),
                    _buildRoleSelection(l10n),
                    const SizedBox(height: 16),
                    _buildMembershipNumberField(l10n),
                    const SizedBox(height: 16),
                    _buildNotesField(l10n),
                    const SizedBox(height: 24),
                    _buildSubmitButton(context, l10n),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNameField(AppLocalizations l10n) {
    return TextFormField(
      controller: _nameController,
      decoration: InputDecoration(
        labelText: l10n.name,
        prefixIcon: const Icon(Icons.person),
        border: const OutlineInputBorder(),
      ),
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return l10n.nameRequired;
        }
        return null;
      },
      textInputAction: TextInputAction.next,
    );
  }

  Widget _buildEmailField(AppLocalizations l10n) {
    return TextFormField(
      controller: _emailController,
      decoration: InputDecoration(
        labelText: l10n.email,
        prefixIcon: const Icon(Icons.email),
        border: const OutlineInputBorder(),
      ),
      keyboardType: TextInputType.emailAddress,
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return l10n.emailRequired;
        }
        if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
          return l10n.emailInvalid;
        }
        return null;
      },
      textInputAction: TextInputAction.next,
    );
  }

  Widget _buildPhoneField(AppLocalizations l10n) {
    return TextFormField(
      controller: _phoneController,
      decoration: InputDecoration(
        labelText: l10n.phone,
        prefixIcon: const Icon(Icons.phone),
        border: const OutlineInputBorder(),
        hintText: '01012345678',
      ),
      keyboardType: TextInputType.phone,
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return l10n.phoneRequired;
        }
        if (!RegExp(r'^01[0-9]{9}$').hasMatch(value.trim())) {
          return l10n.phoneInvalid;
        }
        return null;
      },
      textInputAction: TextInputAction.next,
    );
  }

  Widget _buildNationalIdField(AppLocalizations l10n) {
    return TextFormField(
      controller: _nationalIdController,
      decoration: InputDecoration(
        labelText: l10n.nationalId,
        prefixIcon: const Icon(Icons.credit_card),
        border: const OutlineInputBorder(),
      ),
      keyboardType: TextInputType.number,
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return l10n.nationalIdRequired;
        }
        if (!RegExp(r'^[0-9]{14}$').hasMatch(value.trim())) {
          return l10n.nationalIdInvalid;
        }
        return null;
      },
      textInputAction: TextInputAction.next,
    );
  }

  Widget _buildGovernorateDropdown(AppLocalizations l10n) {
    return DropdownButtonFormField<String>(
      value: _selectedGovernorate,
      decoration: InputDecoration(
        labelText: l10n.governorate,
        prefixIcon: const Icon(Icons.location_city),
        border: const OutlineInputBorder(),
      ),
      items: EgyptGovernorates.governorates.map((governorate) {
        return DropdownMenuItem<String>(
          value: governorate,
          child: Text(governorate),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedGovernorate = value;
        });
      },
      validator: (value) {
        if (value == null || value.isEmpty) {
          return l10n.governorateRequired;
        }
        return null;
      },
    );
  }

  Widget _buildRoleSelection(AppLocalizations l10n) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          l10n.selectRole,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: RadioListTile<String>(
                title: Text(l10n.memberRole),
                value: 'member',
                groupValue: _selectedRole,
                onChanged: (value) {
                  setState(() {
                    _selectedRole = value!;
                  });
                },
              ),
            ),
            Expanded(
              child: RadioListTile<String>(
                title: Text(l10n.volunteerRole),
                value: 'volunteer',
                groupValue: _selectedRole,
                onChanged: (value) {
                  setState(() {
                    _selectedRole = value!;
                  });
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMembershipNumberField(AppLocalizations l10n) {
    return TextFormField(
      controller: _membershipNumberController,
      decoration: InputDecoration(
        labelText: l10n.membershipNumberOptional,
        prefixIcon: const Icon(Icons.badge),
        border: const OutlineInputBorder(),
      ),
      textInputAction: TextInputAction.next,
    );
  }

  Widget _buildNotesField(AppLocalizations l10n) {
    return TextFormField(
      controller: _notesController,
      decoration: InputDecoration(
        labelText: l10n.additionalNotes,
        hintText: l10n.additionalNotesHint,
        prefixIcon: const Icon(Icons.note),
        border: const OutlineInputBorder(),
      ),
      maxLines: 3,
      textInputAction: TextInputAction.done,
    );
  }

  Widget _buildSubmitButton(BuildContext context, AppLocalizations l10n) {
    return BlocBuilder<JoinRequestCubit, JoinRequestState>(
      builder: (context, state) {
        final isLoading = state is JoinRequestLoading;
        
        return ElevatedButton(
          onPressed: isLoading ? null : () => _submitForm(context),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: isLoading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Text(
                    l10n.submitJoinRequest,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
          ),
        );
      },
    );
  }

  void _submitForm(BuildContext context) {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<JoinRequestCubit>().submitJoinRequest(
            name: _nameController.text.trim(),
            email: _emailController.text.trim(),
            phone: _phoneController.text.trim(),
            nationalID: _nationalIdController.text.trim(),
            governorate: _selectedGovernorate!,
            position: _selectedPosition,
            membershipNumber: _membershipNumberController.text.trim().isEmpty 
                ? null 
                : _membershipNumberController.text.trim(),
            role: _selectedRole,
            notes: _notesController.text.trim().isEmpty 
                ? null 
                : _notesController.text.trim(),
          );
    }
  }

  void _showSuccessDialog(BuildContext context, AppLocalizations l10n) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          icon: Icon(
            Icons.check_circle,
            color: Theme.of(context).colorScheme.primary,
            size: 48,
          ),
          title: Text(l10n.requestSubmitted),
          content: Text(l10n.requestSubmittedMessage),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.go('/home');
              },
              child: Text(l10n.backToHome),
            ),
          ],
        );
      },
    );
  }
}