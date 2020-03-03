resource "google_kms_key_ring" "keys" {
  name     = "keys"
  location = "global"

  depends_on = [
    google_project_service.services["cloudkms.googleapis.com"],
  ]
}

data "google_iam_policy" "keyring_keys" {
  binding {
    role    = "roles/cloudkms.cryptoKeyEncrypterDecrypter"
    members = local.all_function_accounts
  }
}

resource "google_kms_key_ring_iam_policy" "keys" {
  key_ring_id = google_kms_key_ring.keys.id
  policy_data = data.google_iam_policy.keyring_keys.policy_data
}

resource "google_kms_crypto_key" "micropub_token" {
  name     = "micropub-token"
  key_ring = google_kms_key_ring.keys.id
  purpose  = "ENCRYPT_DECRYPT"

  // 6 months
  rotation_period = "15552000s"

  lifecycle {
    prevent_destroy = true
  }
}
