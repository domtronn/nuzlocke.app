<script>
  import { Wrapper as SettingsWrapper } from '$lib/components/Settings'
</script>

<SettingsWrapper id="nickname-clause" let:setting={showNickname}>
  <SettingsWrapper id="encounter-suggestions" let:setting={showSuggestions}>
    <SettingsWrapper id="permadeath" let:setting={permadeath}>
      <SettingsWrapper id="dupe-clause" let:setting={duplicates}>
        <SettingsWrapper id="missed-dupes" let:setting={missDuplicates}>
          <slot
            settings={{
              showNickname,
              showSuggestions,
              duplicates,
              missDuplicates,
              permadeath
            }}
          />
        </SettingsWrapper>
      </SettingsWrapper>
    </SettingsWrapper>
  </SettingsWrapper>
</SettingsWrapper>
