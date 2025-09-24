import 'package:flutter/material.dart';
import 'package:flutter_mediaCubit.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../features/auth/presentation/cubits/auth_cubit.dart';
import '../../gen_l10n/app_localizations.dart';

class MainNavigation extends StatefulWidget {
  final Widget child;

  const MainNavigation({
    super.key,
    required this.child,
  });

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

  List<NavigationItem> _getNavigationItems(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final bool isGuest = context.read<AuthCubit>().asGuest;
    final items = [
      NavigationItem(
        icon: Icons.home_outlined,
        activeIcon: Icons.home,
        label: l10n.home,
        route: '/home',
      ),
      NavigationItem(
        icon: Icons.dashboard_outlined,
        activeIcon: Icons.dashboard,
        label: l10n.dashboard,
        route: '/dashboard',
      ),
      NavigationItem(
        icon: Icons.article_outlined,
        activeIcon: Icons.article,
        label: l10n.news,
        route: '/news',
      ),
      NavigationItem(
        icon: Icons.event_outlined,
        activeIcon: Icons.event,
        label: l10n.events,
        route: '/events',
      ),
      NavigationItem(
        icon: Icons.person_outline,
        activeIcon: Icons.person,
        label: l10n.profile,
        route: '/profile',
      ),
    ];

    // remove dashboard if guest
    if (isGuest) {
      items.removeWhere((item) => item.route == '/dashboard');
    }

    return items;

  }

  @override
  Widget build(BuildContext context) {
    final navigationItems = _getNavigationItems(context);

    // Update selected index based on current route
    final currentRoute = GoRouterState.of(context).uri.path;
    for (int i = 0; i < navigationItems.length; i++) {
      if (currentRoute.startsWith(navigationItems[i].route)) {
        if (_selectedIndex != i) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            setState(() {
              _selectedIndex = i;
            });
          });
        }
        break;
      }
    }

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
          child: NavigationBar(
            selectedIndex: _selectedIndex,
            onDestinationSelected: (index) {
              setState(() {
                _selectedIndex = index;
              });
              context.go(navigationItems[index].route);
            },
            backgroundColor: Theme.of(context).colorScheme.surface,
            indicatorColor:
                Theme.of(context).colorScheme.primary.withValues(alpha: 0.2),
            destinations: navigationItems.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              final isSelected = _selectedIndex == index;

              return NavigationDestination(
                icon: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  child: Icon(
                    isSelected ? item.activeIcon : item.icon,
                    key: ValueKey(isSelected),
                    color: isSelected
                        ? Theme.of(context).colorScheme.primary
                        : Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ).animate().scale(duration: 200.ms),
                label: item.label,
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final String route;

  NavigationItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.route,
  });
}
