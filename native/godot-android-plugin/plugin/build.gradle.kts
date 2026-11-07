plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}
android {
    namespace = "com.antarezka.merzkava.android"
    compileSdk = 36
    buildFeatures { buildConfig = true }
    defaultConfig {
        minSdk = 23
        manifestPlaceholders["godotPluginName"] = "MerzkavaAndroid"
        manifestPlaceholders["godotPluginPackageName"] = "com.antarezka.merzkava.android"
        buildConfigField("String", "GODOT_PLUGIN_NAME", "\"MerzkavaAndroid\"")
        setProperty("archivesBaseName", "MerzkavaAndroid")
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlin {
        compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17) }
    }
}
dependencies { implementation("org.godotengine:godot:4.7.2.stable") }
