// src/styles/global.js
import { StyleSheet } from 'react-native';
import theme from '../theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.small,
    marginBottom: theme.spacing.medium,
    backgroundColor: '#FFF',
    fontSize: theme.fontSize.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.small,
    alignItems: 'center',
    marginVertical: theme.spacing.small,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing.small,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: theme.spacing.medium,
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.large,
  },
});
