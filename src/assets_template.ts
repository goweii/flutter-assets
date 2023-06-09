export class AssetsTemplate {
    static assetsFileName = 'assets.dart';

    static assetsWidgetClassName = 'Assets';

    static assetsDataClassName = 'AssetsData';

    static filderHeaderString =
        '// Generated by Flutter Assets';

    static assetsNotDirErrorString =
        "// 'assets-path' should be a dir!";

    static assetsWidgetClassString =
        `// ignore_for_file: unused_field, camel_case_types, non_constant_identifier_names, library_private_types_in_public_api

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
        
class ${this.assetsWidgetClassName} extends StatelessWidget {
  final ${this.assetsDataClassName} assets;
  final Widget child;

  const ${this.assetsWidgetClassName}({
    super.key,
    required this.assets,
    required this.child,
  });

  static ${this.assetsDataClassName} of(BuildContext context) {
    final widget = context.dependOnInheritedWidgetOfExactType<_Inherited${this.assetsWidgetClassName}>();
    return widget?.assets ?? ${this.assetsDataClassName}.light();
  }

  @override
  Widget build(BuildContext context) {
    return _InheritedAssets(
      assets: assets,
      child: child,
    );
  }
}

class _Inherited${this.assetsWidgetClassName} extends InheritedWidget {
  final ${this.assetsDataClassName} assets;

  const _Inherited${this.assetsWidgetClassName}({
    required this.assets,
    required super.child,
  });

  @override
  bool updateShouldNotify(covariant _Inherited${this.assetsWidgetClassName} oldWidget) => assets != oldWidget.assets;
}`;
}