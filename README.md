# Introduction

This VS Code extension is used to automatically generate a dart class for managing Flutter assets.



# How to use

After installing the plugin, when opening the Flutter project, it will start listening for file changes in the 'assets' directory and automatically generate the corresponding' assets. dart 'file after the changes The 'assets' directory name and the' assets. dart 'file name can both be customized and configured, as explained below.

Of course, you can also proactively execute the following two commands to trigger:

- The command 'Flutter Assets: Generate Now' is used to generate the 'assets. dart' file from the 'assets' directory.

- The command 'Flutter Assets: Update Config Now' is used to update the configuration from 'pubspec. yaml'.



## Add Custom Configuration

Add the following configuration information to pubspec.yaml.

```yaml
flutter-assets:
  auto-generate: false
  assets-path: assets
  output-path: lib/assets
  ignore-ext: false
```

The meaning of each field is as follows, with default values as shown in the code above.

- **auto-generate**: Automatically generate code when the assets-path directory changes
- **assets-path**: Directory of assets
- **output-path**: Directory where the generated dart file is located
- **output-name**: The generated dart file name, where the class name is in the form of 'UpperCamelCase' for this field
- **ignore-ext**: whether the generated attribute contains a file suffix name



## Using in Code

You can simply use it this way. This will directly use the light image, ignoring the theme settings.

```dart
AssetsData.light().images.ic_flutter
```

It is recommended to use it in conjunction with the provider. Like this below.

```dart
AssetsData.brightness(Theme.of(context).brightness).images.ic_flutter
```

This usage may be a bit complicated and may seem a bit lengthy, but it can make the code versatile in any design style, such as MaterialApp, CupertinoApp, or other desktop style designs.

For ease of use, you can write your own extension for BuildContext, as shown below.

```dart
extension AssetsExt on BuildContext {
  AssetsData get assets => AssetsData.brightness(Theme.of(this).brightness);
}
```

Then, you can easily obtain the required assets.

```dart
context.assets.images.ic_flutter
```


