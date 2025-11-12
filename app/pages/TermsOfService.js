import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Section = ({ title, children }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>{title}</Text>
    <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>{children}</Text>
  </View>
);

const List = ({ items = [] }) => (
  <View style={{ marginTop: 6 }}>
    {items.map((item, idx) => (
      <View key={idx} style={{ flexDirection: 'row', marginBottom: 6 }}>
        <Text style={{ marginRight: 6 }}>•</Text>
        <Text style={{ flex: 1, fontSize: 14, color: '#333', lineHeight: 20 }}>{item}</Text>
      </View>
    ))}
  </View>
);

const TermsOfService = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Terms of Service</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</Text>

        <Section title="Agreement to Terms">
          By using Rent-To-Build, you agree to these Terms. If you do not agree, please stop using the app.
        </Section>

        <Section title="Service Description">
          The app connects renters and owners of heavy machinery. We facilitate listings, discovery, and messaging. We do not own or operate the machinery.
        </Section>

        <Section title="User Responsibilities">
          <List items={[
            'Provide accurate information in your profile and ads',
            'Do not post illegal, misleading, or offensive content',
            'Comply with local laws and safety regulations',
            'Use the chat and listing features respectfully'
          ]} />
        </Section>

        <Section title="Listings and Approval">
          Ads may be reviewed and must meet quality and policy standards. We may remove or reject listings that violate policies.
        </Section>

        <Section title="Payments and Transactions">
          Payments, if any, are handled outside the core app or via third-party services. You are responsible for verifying parties and terms. We are not a party to rental contracts.
        </Section>

        <Section title="Privacy">
          Your use is also governed by our Privacy Policy. Location display on ads is controlled by your Show Location setting.
        </Section>

        <Section title="Prohibited Activities">
          <List items={[
            'Reverse engineering, scraping, or abusing the service',
            'Uploading malicious code, spam, or infringing content',
            'Attempting to bypass security or access other users’ data'
          ]} />
        </Section>

        <Section title="Intellectual Property">
          The app, branding, and software are protected. Your content remains yours, but you grant us a license to display it in the app as needed.
        </Section>

        <Section title="Termination">
          We may suspend or terminate access for violations or abuse. You may stop using the app at any time. You may also request account deletion.
        </Section>

        <Section title="Disclaimers and Liability">
          The app is provided "as is" without warranties. We are not liable for direct or indirect damages arising from your use, as allowed by law.
        </Section>

        <Section title="Changes to Terms">
          We may update these Terms. Continued use means you accept the changes.
        </Section>

        <Section title="Contact">
          For legal questions, contact: legal@rent-to-build.example
        </Section>
      </ScrollView>
    </View>
  );
};

export default TermsOfService;











