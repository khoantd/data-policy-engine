provider "kubernetes" {
  # Path to the kubeconfig file can be overridden by var.kubeconfig_path
  config_path = var.kubeconfig_path
}
